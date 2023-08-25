import { ResponseError } from '@backstage/errors';
import { SwfApi } from './api';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import {
  ProcessInstance,
  SwfItem,
  SwfListResult,
} from '@parodos/plugin-swf-common';
import { OpenAPIV3 } from 'openapi-types';

export interface SwfClientOptions {
  discoveryApi: DiscoveryApi;
}
export class SwfClient implements SwfApi {
  private readonly discoveryApi: DiscoveryApi;
  constructor(options: SwfClientOptions) {
    this.discoveryApi = options.discoveryApi;
  }

  async getSwf(swfId: string): Promise<SwfItem> {
    const baseUrl = await this.discoveryApi.getBaseUrl('swf');
    const res = await fetch(`${baseUrl}/items/${swfId}`);
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
    const data: SwfItem = await res.json();
    return data;
  }
  async listSwfs(): Promise<SwfListResult> {
    const baseUrl = await this.discoveryApi.getBaseUrl('swf');
    const res = await fetch(`${baseUrl}/items`);
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
    const data: SwfListResult = await res.json();
    return data;
  }

  async getInstances(): Promise<ProcessInstance[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('swf');
    const res = await fetch(`${baseUrl}/instances`);
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
    const data: ProcessInstance[] = await res.json();
    return data;
  }

  async getInstance(instanceId: string): Promise<ProcessInstance> {
    const baseUrl = await this.discoveryApi.getBaseUrl('swf');
    const res = await fetch(`${baseUrl}/instances/${instanceId}`);
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
    const data: ProcessInstance = await res.json();
    return data;
  }
  async createWorkflowDefinition(
    url: string,
    content: string,
  ): Promise<SwfItem> {
    const baseUrl = await this.discoveryApi.getBaseUrl('swf');
    const res = await fetch(`${baseUrl}/workflows?url=${url}`, {
      method: 'POST',
      body: content,
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
    const data: SwfItem = await res.json();
    return data;
  }

  async deleteWorkflowDefinition(swfId: string): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('swf');
    const res = await fetch(`${baseUrl}/workflows/${swfId}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
  }

  async getActionsSchema(): Promise<OpenAPIV3.Document> {
    const baseUrl = await this.discoveryApi.getBaseUrl('swf');
    const res = await fetch(`${baseUrl}/actions/schema`);
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
    return res.json();
  }
}
