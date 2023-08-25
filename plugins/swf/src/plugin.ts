














import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core-plugin-api';

import {
  definitionsRouteRef,
  rootRouteRef,
  scaffolderTemplateSelectedRouteRef,
} from './routes';
import { swfApiRef, SwfClient } from './api';

export const swfPlugin = createPlugin({
  id: 'swf',
  apis: [
    createApiFactory({
      api: swfApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory({ discoveryApi }) {
        return new SwfClient({ discoveryApi });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
    definitions: definitionsRouteRef,
  },
  externalRoutes: {
    scaffolderTemplateSelectedLink: scaffolderTemplateSelectedRouteRef,
  },
});

export const SWFInstancesViewerPage = swfPlugin.provide(
  createRoutableExtension({
    name: 'SWFInstancesViewerPage',
    component: () =>
      import('./components/SWFInstancesViewerPage').then(
        m => m.SWFInstancesViewerPage,
      ),
    mountPoint: rootRouteRef,
  }),
);

export const SWFPage = swfPlugin.provide(
  createRoutableExtension({
    name: 'SWFPage',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);
