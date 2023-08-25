














import {
  createExternalRouteRef,
  createRouteRef,
  createSubRouteRef,
} from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'swf',
});

// This route demos a standalone plugin and is not integrated into Scaffolder
export const definitionsRouteRef = createSubRouteRef({
  id: 'swf/items',
  parent: rootRouteRef,
  path: '/items/:swfId',
});

// This route integrates with Scaffolder and lists all SWF instances
export const swfInstancesRouteRef = createSubRouteRef({
  id: 'swf/instance',
  parent: rootRouteRef,
  path: '/instances',
});

// This route integrates with Scaffolder and lists all SWF instances, selecting a specific one.
export const swfInstanceRouteRef = createSubRouteRef({
  id: 'swf/instance',
  parent: rootRouteRef,
  path: '/instances/:instanceId',
});

export const importWorkflowRouteRef = createSubRouteRef({
  id: 'swf/workflows/import',
  parent: rootRouteRef,
  path: '/workflows/import',
});

export const createWorkflowRouteRef = createSubRouteRef({
  id: 'swf/workflows/create',
  parent: rootRouteRef,
  path: '/workflows/create',
});

export const editWorkflowRouteRef = createSubRouteRef({
  id: 'swf/workflows/edit',
  parent: rootRouteRef,
  path: '/workflows/edit/:swfId',
});

export const scaffolderTemplateSelectedRouteRef = createExternalRouteRef({
  id: 'scaffolder-template-selected',
  optional: true,
  params: ['namespace', 'templateName'],
});
