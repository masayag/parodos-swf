export const topic = 'kogito-swf-service-ready';

export const to_be_entered = `<Enter>`;

export const empty_definition = {
  id: 'workflow_unique_identifier',
  version: '0.1',
  specVersion: '0.8',
  name: 'Workflow name',
  description: 'Workflow description',
  start: 'StartState',
  functions: [
    {
      name: 'uniqueFunctionName',
      operation: 'specs/actions-openapi.json#catalog:fetch',
    },
  ],
  states: [
    {
      name: 'StartState',
      type: 'operation',
      actions: [
        {
          name: 'uniqueActionName',
          functionRef: {
            refName: 'uniqueFunctionName',
            arguments: {
              entityRef: '.entityRef',
            },
          },
        },
      ],
      end: true,
    },
  ],
};

export const actions_open_api_file = 'actions-openapi.json';
export const actions_open_api_file_path = `specs/${actions_open_api_file}`;

export const schemas_folder = 'schemas';

export const workflow_title = 'Workflow';
export const workflow_title_plural = 'Workflows';
export const workflow_type = 'workflow';


export type SwfItem = {
  id: string;
  name: string;
  description: string;
  definition: string;
};

export type SwfListResult = {
  items: SwfItem[];
  totalCount: number;
  offset: number;
  limit: number;
};

export enum ProcessInstanceState {
  Active = 'ACTIVE',
  Completed = 'COMPLETED',
  Aborted = 'ABORTED',
  Suspended = 'SUSPENDED',
  Error = 'ERROR',
}

export enum MilestoneStatus {
  Available = 'AVAILABLE',
  Active = 'ACTIVE',
  Completed = 'COMPLETED',
}

export interface NodeInstance {
  __typename?: 'NodeInstance';
  id: string;
  name: string;
  type: string;
  enter: Date;
  exit?: Date;
  definitionId: string;
  nodeId: string;
}

export interface TriggerableNode {
  id: number;
  name: string;
  type: string;
  uniqueId: string;
  nodeDefinitionId: string;
}

export interface Milestone {
  __typename?: 'Milestone';
  id: string;
  name: string;
  status: MilestoneStatus;
}

export interface ProcessInstanceError {
  __typename?: 'ProcessInstanceError';
  nodeDefinitionId: string;
  message?: string;
}
export interface ProcessInstance {
  id: string;
  processId: string;
  processName?: string;
  parentProcessInstanceId?: string;
  rootProcessInstanceId?: string;
  rootProcessId?: string;
  roles?: string[];
  state: ProcessInstanceState;
  endpoint: string;
  serviceUrl?: string;
  nodes: NodeInstance[];
  milestones?: Milestone[];
  variables?: string;
  start: Date;
  end?: Date;
  parentProcessInstance?: ProcessInstance;
  childProcessInstances?: ProcessInstance[];
  error?: ProcessInstanceError;
  addons?: string[];
  lastUpdate: Date;
  businessKey?: string;
  isSelected?: boolean;
  errorMessage?: string;
  isOpen?: boolean;
  diagram?: string;
  nodeDefinitions?: TriggerableNode[];
  source?: string;
}
