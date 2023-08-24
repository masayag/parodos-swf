import { createRouter } from '@parodos/plugin-swf-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    eventBroker: env.eventBroker,
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
  });
}
