














import { KogitoEditorChannelApi } from '@kie-tools-core/editor/dist/api';
import { SwfLanguageServiceChannelApi } from '@kie-tools/serverless-workflow-language-service/dist/api';
import { SwfServiceCatalogChannelApi } from '@kie-tools/serverless-workflow-service-catalog/dist/api';

export interface SwfTextEditorChannelApi
  extends KogitoEditorChannelApi,
    SwfServiceCatalogChannelApi,
    SwfLanguageServiceChannelApi {
  kogitoSwfTextEditor__onSelectionChanged(args: { nodeName: string }): void;
}
