














import React, { useEffect, useState } from 'react';
import { useRouteRefParams } from '@backstage/core-plugin-api';
import { definitionsRouteRef } from '../../routes';
import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  InfoCard,
  Page,
  Progress,
  SupportButton,
} from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { workflow_title } from '@parodos/plugin-swf-common';
import { SWFEditor } from '../SWFEditor';
import { EditorViewKind, SWFEditorRef } from '../SWFEditor/SWFEditor';
import { useController } from '@kie-tools-core/react-hooks/dist/useController';

export const SWFDefinitionViewerPage = () => {
  const [name, setName] = useState<string>();
  const { swfId } = useRouteRefParams(definitionsRouteRef);
  const [swfEditor, swfEditorRef] = useController<SWFEditorRef>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!swfEditor?.swfItem) {
      return;
    }
    setLoading(false);
    setName(swfEditor.swfItem.name);
  }, [swfEditor]);

  return (
    <Page themeId="tool">
      <Header
        title={workflow_title}
        subtitle={`Where all your ${workflow_title} needs come to life!`}
      >
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title={`${workflow_title} Definition`}>
          <SupportButton>Orchestrate things with stuff.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            {loading && <Progress />}
            <InfoCard title={name || ''}>
              <div style={{ height: '600px' }}>
                <SWFEditor
                  ref={swfEditorRef}
                  kind={EditorViewKind.EXTENDED_DIAGRAM_VIEWER}
                  swfId={swfId}
                />
              </div>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
