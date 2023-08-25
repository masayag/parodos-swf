import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import fetch from 'node-fetch';
import { DiscoveryService } from '@backstage/backend-plugin-api';

const id = 'swf:execute';

const examples = [
  {
    description: 'Execute Serverless Workflow',
    example: yaml.stringify({
      steps: [
        {
          action: id,
          id: 'swf-execute',
          name: 'Execute Serverless Workflow',
          input: {
            swfId: 'swf1',
            parameters: {},
          },
        },
      ],
    }),
  },
];
export const executeServerlessWorkflowAction = (options: {
  discovery: DiscoveryService;
}) => {
  return createTemplateAction<{ swfId: string; parameters: any }>({
    id,
    description: 'Execute a Serverless Workflow definition.',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['swfId', 'parameters'],
        properties: {
          swfId: {
            title: 'ProcessId',
            description: 'The Serverless Workflow Process Definition Id',
            type: 'string',
          },
          parameters: {
            title: 'parameters',
            description: 'Workflow input parameters',
            type: 'object',
          },
        },
      },
      output: {
        type: 'object',
        required: ['results'],
        properties: {
          results: {
            type: 'object',
          },
        },
      },
    },

    async handler(ctx) {
      const { swfId, parameters } = ctx.input;
      const swfApiUrl: string = await options.discovery.getBaseUrl('swf');
      const swfApiRequest = await fetch(`${swfApiUrl}/execute/${swfId}`, {
        method: 'POST',
        body: JSON.stringify(parameters),
        headers: { 'content-type': 'application/json' },
      });
      ctx.output('results', await swfApiRequest.json());
    },
  });
};
