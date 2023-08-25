














import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { SWFDefinitionsListComponent } from '../SWFDefinitionsListComponent';
import {
  workflow_title,
} from '@parodos/plugin-swf-common';

export const SWFPage = () => {
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
        <ContentHeader title={workflow_title}>
          <SupportButton>Orchestrate things with stuff.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <SWFDefinitionsListComponent />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
