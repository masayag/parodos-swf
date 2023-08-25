import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  EmbeddedEditor,
  EmbeddedEditorChannelApiImpl,
  useEditorRef,
} from '@kie-tools-core/editor/dist/embedded';
import {
  ChannelType,
  EditorEnvelopeLocator,
  EnvelopeContentType,
  EnvelopeMapping,
} from '@kie-tools-core/editor/dist/api';
import {
  ProcessInstance,
  SwfItem,
  actions_open_api_file,
  actions_open_api_file_path,
  empty_definition,
  to_be_entered,
} from '@parodos/plugin-swf-common';
import { Notification } from '@kie-tools-core/notifications/dist/api';
import { useApi } from '@backstage/core-plugin-api';
import { swfApiRef } from '../../api';
import {
  EmbeddedEditorFile,
  StateControl,
} from '@kie-tools-core/editor/dist/channel';
import {
  SwfCatalogSourceType,
  SwfServiceCatalogService,
} from '@kie-tools/serverless-workflow-service-catalog/dist/api';
import { useCancelableEffect } from '@kie-tools-core/react-hooks/dist/useCancelableEffect';
import { parseApiContent } from '@kie-tools/serverless-workflow-service-catalog/dist/channel';
import { MessageBusClientApi } from '@kie-tools-core/envelope-bus/dist/api';
import { ServerlessWorkflowCombinedEditorChannelApi } from '@kie-tools/serverless-workflow-combined-editor/dist/api';
import { ServerlessWorkflowCombinedEditorEnvelopeApi } from '@kie-tools/serverless-workflow-combined-editor/dist/api/ServerlessWorkflowCombinedEditorEnvelopeApi';
import { SwfPreviewOptionsChannelApiImpl } from '@kie-tools/serverless-workflow-combined-editor/dist/impl/SwfPreviewOptionsChannelApiImpl';
import { SwfCombinedEditorChannelApiImpl } from '@kie-tools/serverless-workflow-combined-editor/dist/impl/SwfCombinedEditorChannelApiImpl';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver-types';
import { SwfLanguageService } from './channel/SwfLanguageService';
import { SwfLanguageServiceChannelApiImpl } from './channel/SwfLanguageServiceChannelApiImpl';
import {
  PromiseStateWrapper,
  usePromiseState,
} from '@kie-tools-core/react-hooks/dist/PromiseState';

export enum EditorViewKind {
  AUTHORING = 'AUTHORING',
  DIAGRAM_VIEWER = 'DIAGRAM_VIEWER',
  EXTENDED_DIAGRAM_VIEWER = 'EXTENDED_DIAGRAM_VIEWER',
  RUNTIME = 'RUNTIME',
}

export interface SWFEditorRef {
  validate: () => Promise<Notification[]>;
  getContent: () => Promise<string | undefined>;
  swfItem: SwfItem | undefined;
  isReady: boolean;
}

const EDITOR_CONTEXT_PATH = '/swf';
const LOCALE = 'en';
const DEFAULT_FILENAME = 'fileName.sw.json';
const NODE_COLORS = {
  error: '#f4d5d5',
  success: '#d5f4e6',
};
const DEFAULT_SWF_ITEM_FOR_AUTHORING: SwfItem = {
  id: to_be_entered,
  name: to_be_entered,
  description: to_be_entered,
  definition: JSON.stringify(empty_definition, null, 2),
};

export type SwfEditorView =
  | { kind: EditorViewKind.AUTHORING }
  | { kind: EditorViewKind.DIAGRAM_VIEWER }
  | { kind: EditorViewKind.EXTENDED_DIAGRAM_VIEWER }
  | { kind: EditorViewKind.RUNTIME; processInstance: ProcessInstance };

type SWFEditorProps = {
  swfId: string | undefined;
} & SwfEditorView;

const RefForwardingSWFEditor: ForwardRefRenderFunction<
  SWFEditorRef,
  SWFEditorProps
> = (props, forwardedRef) => {
  const swfApi = useApi(swfApiRef);
  const { swfId, kind } = props;
  const { editor, editorRef } = useEditorRef();
  const [embeddedFile, setEmbeddedFile] = useState<EmbeddedEditorFile>();
  const [swfItemPromise, setSwfItemPromise] = usePromiseState<SwfItem>();
  const [catalogServices, setCatalogServices] = useState<
    SwfServiceCatalogService[]
  >([]);
  const [canRender, setCanRender] = useState(false);
  const [isReady, setReady] = useState(false);

  const currentProcessInstance = useMemo(() => {
    if (kind !== EditorViewKind.RUNTIME) {
      return undefined;
    }
    return props.processInstance;
  }, [props, kind]);

  const envelopeLocator = useMemo(
    () =>
      new EditorEnvelopeLocator(window.location.origin, [
        new EnvelopeMapping({
          type: 'swf',
          filePathGlob: '**/*.sw.json',
          resourcesPathPrefix: EDITOR_CONTEXT_PATH,
          envelopeContent: {
            type: EnvelopeContentType.PATH,
            // TODO Copy swf webpack config and envelop files from original repo, try to use another approach
            path: `${EDITOR_CONTEXT_PATH}/serverless-workflow-combined-editor-envelope.html`,
          },
        }),
      ]),
    [],
  );

  const stateControl = useMemo(() => new StateControl(), []);

  const languageService = useMemo(() => {
    if (!embeddedFile) {
      return undefined;
    }
    const swfLanguageService = new SwfLanguageService(catalogServices);
    return swfLanguageService.getLs(embeddedFile.path!);
  }, [embeddedFile, catalogServices]);

  const colorNodes = useCallback(
    (processInstance: ProcessInstance) => {
      if (!editor) {
        return undefined;
      }

      const combinedEditorChannelApi = editor.getEnvelopeServer()
        .envelopeApi as unknown as MessageBusClientApi<ServerlessWorkflowCombinedEditorChannelApi>;

      const subscription =
        combinedEditorChannelApi.notifications.kogitoSwfCombinedEditor_combinedEditorReady.subscribe(
          () => {
            const combinedEditorEnvelopeApi = editor.getEnvelopeServer()
              .envelopeApi as unknown as MessageBusClientApi<ServerlessWorkflowCombinedEditorEnvelopeApi>;

            const colorConnectedEnds = !!processInstance.nodes.find(
              node => node.name === 'End',
            );

            const errorNodeDefinitionId =
              processInstance.error?.nodeDefinitionId;

            let errorNodesNames: string[] = [];
            if (errorNodeDefinitionId) {
              errorNodesNames = processInstance.nodes
                .filter(
                  node =>
                    node.definitionId === errorNodeDefinitionId || !node.exit,
                )
                .map(node => node.name);

              if (errorNodesNames.length) {
                combinedEditorEnvelopeApi.notifications.kogitoSwfCombinedEditor_colorNodes.send(
                  {
                    nodeNames: errorNodesNames,
                    color: NODE_COLORS.error,
                    colorConnectedEnds,
                  },
                );
              }
            }

            const successNodeNames = processInstance.nodes
              .filter(node => node.exit && !errorNodesNames.includes(node.name))
              .map(node => node.name);

            if (successNodeNames) {
              combinedEditorEnvelopeApi.notifications.kogitoSwfCombinedEditor_colorNodes.send(
                {
                  nodeNames: successNodeNames,
                  color: NODE_COLORS.success,
                  colorConnectedEnds,
                },
              );
            }
          },
        );

      return () => {
        combinedEditorChannelApi.notifications.kogitoSwfCombinedEditor_combinedEditorReady.unsubscribe(
          subscription,
        );
      };
    },
    [editor],
  );

  const validate = useCallback(async () => {
    if (!editor || !languageService || !embeddedFile) {
      return [];
    }

    const content = await editor.getContent();
    const lsDiagnostics = await languageService.getDiagnostics({
      content: content,
      uriPath: embeddedFile.path!,
    });

    return lsDiagnostics.map(
      (lsDiagnostic: Diagnostic) =>
        ({
          path: '', // empty to not group them by path, as we're only validating one file.
          severity:
            lsDiagnostic.severity === DiagnosticSeverity.Error
              ? 'ERROR'
              : 'WARNING',
          message: `${lsDiagnostic.message} [Line ${
            lsDiagnostic.range.start.line + 1
          }]`,
          type: 'PROBLEM',
          position: {
            startLineNumber: lsDiagnostic.range.start.line + 1,
            startColumn: lsDiagnostic.range.start.character + 1,
            endLineNumber: lsDiagnostic.range.end.line + 1,
            endColumn: lsDiagnostic.range.end.character + 1,
          },
        } as Notification),
    );
  }, [editor, embeddedFile, languageService]);

  const getContent = useCallback(async () => editor?.getContent(), [editor]);

  const customEditorApi = useMemo(() => {
    if (!embeddedFile || !languageService) {
      return undefined;
    }

    const defaultApiImpl = new EmbeddedEditorChannelApiImpl(
      stateControl,
      embeddedFile,
      LOCALE,
      {
        kogitoEditor_ready: () => {
          setReady(true);
        },
      },
    );

    const swfLanguageServiceChannelApiImpl =
      new SwfLanguageServiceChannelApiImpl(languageService);

    const swfPreviewOptionsChannelApiImpl = new SwfPreviewOptionsChannelApiImpl(
      {
        editorMode: 'full',
        defaultWidth: kind === EditorViewKind.AUTHORING ? '50%' : '100%',
      },
    );

    return new SwfCombinedEditorChannelApiImpl(
      defaultApiImpl,
      undefined,
      swfLanguageServiceChannelApiImpl,
      swfPreviewOptionsChannelApiImpl,
    );
  }, [embeddedFile, languageService, stateControl, kind]);

  useEffect(() => {
    if (!isReady || !currentProcessInstance) {
      return;
    }
    colorNodes(currentProcessInstance);
  }, [colorNodes, currentProcessInstance, isReady]);

  useImperativeHandle(
    forwardedRef,
    () => {
      return {
        validate,
        getContent,
        swfItem: swfItemPromise.data,
        isReady,
      };
    },
    [validate, getContent, swfItemPromise.data, isReady],
  );

  useCancelableEffect(
    useCallback(
      ({ canceled }) => {
        setCanRender(false);

        const promise = swfId
          ? swfApi.getSwf(swfId)
          : Promise.resolve(DEFAULT_SWF_ITEM_FOR_AUTHORING);

        promise
          .then(item => {
            if (canceled.get()) {
              return;
            }
            setSwfItemPromise({ data: item });

            setEmbeddedFile({
              path: DEFAULT_FILENAME,
              getFileContents: async () => item.definition,
              isReadOnly: kind !== EditorViewKind.AUTHORING,
              fileExtension: 'sw.json',
              fileName: DEFAULT_FILENAME,
            });

            setCanRender(true);
          })
          .catch(e => {
            setSwfItemPromise({ error: e });
          });
      },
      [kind, setSwfItemPromise, swfApi, swfId],
    ),
  );

  useCancelableEffect(
    useCallback(
      ({ canceled }) => {
        if (kind !== EditorViewKind.AUTHORING) {
          return;
        }
        swfApi.getActionsSchema().then(schema => {
          if (canceled.get()) {
            return;
          }
          const service = parseApiContent({
            serviceFileContent: JSON.stringify(schema),
            serviceFileName: actions_open_api_file,
            source: {
              type: SwfCatalogSourceType.LOCAL_FS,
              absoluteFilePath: actions_open_api_file_path,
            },
          });
          setCatalogServices([service]);
        });
      },
      [kind, swfApi],
    ),
  );

  return (
    <PromiseStateWrapper
      promise={swfItemPromise}
      resolved={swfItem =>
        canRender &&
        embeddedFile && (
          <EmbeddedEditor
            key={currentProcessInstance?.id ?? swfItem.id}
            ref={editorRef}
            file={embeddedFile}
            channelType={ChannelType.ONLINE}
            editorEnvelopeLocator={envelopeLocator}
            customChannelApiImpl={customEditorApi}
            stateControl={stateControl}
            locale={LOCALE}
            isReady={isReady}
          />
        )
      }
    />
  );
};

export const SWFEditor = forwardRef(RefForwardingSWFEditor);
