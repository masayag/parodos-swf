import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { ServerlessWorkflowEntityProvider } from '@parodos/plugin-swf-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());

  // SWF Entity Provider
  const config = env.config;
  const logger = env.logger;
  const kogitoBaseUrl =
    config.getOptionalString('swf.baseUrl') ?? 'http://localhost';
  const kogitoPort = config.getOptionalNumber('swf.port') ?? 8899;
  logger.info(
    `Using kogito Serverless Workflow Url of: ${kogitoBaseUrl}:${kogitoPort}`,
  );
  const owner =
    config.getOptionalString('swf.workflow-service.owner') ?? 'infrastructure';
  const environment =
    config.getOptionalString('swf.workflow-service.environment') ??
    'development';

  const swfProvider = new ServerlessWorkflowEntityProvider({
    reader: env.reader,
    kogitoServiceUrl: `${kogitoBaseUrl}:${kogitoPort}`,
    swfPluginUrl: await env.discovery.getBaseUrl('swf'),
    eventBroker: env.eventBroker,
    scheduler: env.scheduler,
    logger: env.logger,
    owner: owner,
    env: environment,
  });
  builder.addEntityProvider(swfProvider);

  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
