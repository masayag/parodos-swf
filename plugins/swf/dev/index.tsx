import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { swfPlugin, SWFPage } from '../src/plugin';

createDevApp()
  .registerPlugin(swfPlugin)
  .addPage({
    element: <SWFPage />,
    title: 'Root Page',
    path: '/swf',
  })
  .render();
