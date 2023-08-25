import { createServiceBuilder } from '@backstage/backend-common';
import { Server } from 'http';
import { Logger } from 'winston';
import { createRouter } from './router';
import { Config } from '@backstage/config';
import { EventBroker } from '@backstage/plugin-events-node';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
  eventBroker: EventBroker;
  config: Config;
  discovery: DiscoveryApi;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'swf-backend' });
  logger.debug('Starting application server...');
  const router = await createRouter({
    logger: logger,
    eventBroker: options.eventBroker,
    config: options.config,
    discovery: options.discovery,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/swf', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
