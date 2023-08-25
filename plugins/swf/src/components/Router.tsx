import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  definitionsRouteRef,
  importWorkflowRouteRef,
  createWorkflowRouteRef,
  swfInstanceRouteRef,
  swfInstancesRouteRef,
  editWorkflowRouteRef,
} from '../routes';
import { SWFPage } from './SWFPage';
import { SWFInstancesViewerPage } from './SWFInstancesViewerPage';
import { SWFDefinitionViewerPage } from './SWFDefinitionViewerPage';
import { ImportWorkflowViewerPage } from './ImportWorkflowViewerPage';
import { CreateSWFPage } from './CreateSWFPage';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<SWFPage />} />
      <Route
        path={definitionsRouteRef.path}
        element={<SWFDefinitionViewerPage />}
      />
      <Route
        path={swfInstancesRouteRef.path}
        element={<SWFInstancesViewerPage />}
      />
      <Route
        path={swfInstanceRouteRef.path}
        element={<SWFInstancesViewerPage />}
      />
      <Route
        path={importWorkflowRouteRef.path}
        element={<ImportWorkflowViewerPage />}
      />
      <Route path={createWorkflowRouteRef.path} element={<CreateSWFPage />} />
      <Route path={editWorkflowRouteRef.path} element={<CreateSWFPage />} />
    </Routes>
  );
};
