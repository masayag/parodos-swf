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
