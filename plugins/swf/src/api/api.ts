import { createApiRef } from '@backstage/core-plugin-api';
import {
  ProcessInstance,
  SwfItem,
  SwfListResult,
} from '@parodos/plugin-swf-common';
import { OpenAPIV3 } from 'openapi-types';

export interface SwfApi {
  getSwf(swfId: string): Promise<SwfItem>;

  listSwfs(): Promise<SwfListResult>;

  getInstances(): Promise<ProcessInstance[]>;

  getInstance(instanceId: string): Promise<ProcessInstance>;

  createWorkflowDefinition(url: string, content?: string): Promise<SwfItem>;

  deleteWorkflowDefinition(swfId: string): Promise<any>;

  getActionsSchema(): Promise<OpenAPIV3.Document>;
}

export const swfApiRef = createApiRef<SwfApi>({
  id: 'plugin.swf.api',
});
