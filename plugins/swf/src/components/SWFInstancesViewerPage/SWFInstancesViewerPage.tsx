import React, { useCallback, useState } from 'react';
import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { ProcessVariablesViewer } from './ProcessVariablesViewer';
import { ProcessGraphViewer } from './ProcessGraphViewer';
import { ProcessInstancesTable } from './ProcessInstancesTable';
import { ProcessInstance, workflow_title } from '@parodos/plugin-swf-common';
import { ProcessDetailsViewer } from './ProcessDetailsViewer';
import { ProcessTimeline } from './ProcessTimeline';

export const SWFInstancesViewerPage = () => {
  const [selectedInstance, setSelectedInstance] = useState<ProcessInstance>();

  const toJsonVariables = useCallback(() => {
    const variables: string | undefined = selectedInstance?.variables;
    return variables ? JSON.parse(variables) : undefined;
  }, [selectedInstance]);

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
        <ContentHeader title={`${workflow_title} Instances`}>
          <SupportButton>Orchestrate things with stuff.</SupportButton>
        </ContentHeader>
        <Grid container direction="row">
          <Grid item xs={12} lg={8}>
            <ProcessInstancesTable
              selectedInstance={selectedInstance}
              setSelectedInstance={setSelectedInstance}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <ProcessGraphViewer
              swfId={selectedInstance?.processId}
              selectedInstance={selectedInstance}
            />
          </Grid>
          <Grid item xs={12} lg={8}>
            <Grid container direction="row">
              <Grid item xs={12}>
                <ProcessVariablesViewer variables={toJsonVariables()} />
              </Grid>
              <Grid item xs={12}>
                <ProcessTimeline selectedInstance={selectedInstance} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <ProcessDetailsViewer selectedInstance={selectedInstance} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
