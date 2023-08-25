import { resolvePackagePath } from '@backstage/backend-common';
import fs from 'fs-extra';
import { OpenApiService } from './OpenApiService';
import {
  actions_open_api_file_path,
  schemas_folder,
} from '@parodos/plugin-swf-common';
import { Specification } from '@severlessworkflow/sdk-typescript';
import { DataInputSchemaService } from './DataInputSchemaService';
import { join } from 'path';

export class WorkflowService {
  private openApiService: OpenApiService;
  private dataInputSchemaService: DataInputSchemaService;
  private readonly resourcesPath = `workflows`;

  constructor(
    openApiService: OpenApiService,
    dataInputSchemaService: DataInputSchemaService,
  ) {
    this.openApiService = openApiService;
    this.dataInputSchemaService = dataInputSchemaService;
  }

  async saveWorkflowDefinition(
    workflow: Specification.Workflow,
  ): Promise<Specification.Workflow> {
    const definitionsPath = resolvePackagePath(
      `@backstage/plugin-swf-backend`,
      `${this.resourcesPath}/${workflow.id}.sw.json`,
    );
    const dataInputSchemaPath = await this.saveDataInputSchema(workflow);
    if (dataInputSchemaPath) {
      workflow.dataInputSchema = dataInputSchemaPath;
    }

    await this.saveFile(definitionsPath, workflow);
    return workflow;
  }

  private async saveFile(path: string, data: any): Promise<void> {
    await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf8');
  }

  async saveWorkflowDefinitionFromUrl(
    url: string,
  ): Promise<Specification.Workflow> {
    const workflow = await this.fetchWorkflowDefinitionFromUrl(url);
    await this.saveWorkflowDefinition(workflow);
    return workflow;
  }

  async fetchWorkflowDefinitionFromUrl(
    url: string,
  ): Promise<Specification.Workflow> {
    const response = await fetch(url);
    return await response.json();
  }

  async saveOpenApi(): Promise<void> {
    const path = resolvePackagePath(
      `@backstage/plugin-swf-backend`,
      `${this.resourcesPath}/${actions_open_api_file_path}`,
    );
    const openApi = await this.openApiService.generateOpenApi();
    if (!openApi) {
      return;
    }
    await this.saveFile(path, openApi);
  }

  async saveDataInputSchema(
    workflow: Specification.Workflow,
  ): Promise<string | undefined> {
    const openApi = await this.openApiService.generateOpenApi();
    // TODO Generate human readable description for the schema's fields
    const dataInputSchema = await this.dataInputSchemaService.generate({
      workflow,
      openApi,
    });

    if (!dataInputSchema) {
      return undefined;
    }

    const workflowDataInputSchemaPath = join(
      schemas_folder,
      dataInputSchema.compositionSchema.fileName,
    );

    dataInputSchema.compositionSchema.jsonSchema = {
      $id: `classpath:/${workflowDataInputSchemaPath}`,
      ...dataInputSchema.compositionSchema.jsonSchema,
    };

    dataInputSchema.actionSchemas.forEach(actionSchema => {
      actionSchema.jsonSchema = {
        $id: `classpath:/${schemas_folder}/${actionSchema.fileName}`,
        ...actionSchema.jsonSchema,
      };
    });

    const schemaFiles = [
      dataInputSchema.compositionSchema,
      ...dataInputSchema.actionSchemas,
    ];

    const saveSchemaPromises = schemaFiles.map(schemaFile => {
      const path = resolvePackagePath(
        `@backstage/plugin-swf-backend`,
        join(this.resourcesPath, schemas_folder, schemaFile.fileName),
      );
      return this.saveFile(path, schemaFile.jsonSchema);
    });

    await Promise.all(saveSchemaPromises);

    return workflowDataInputSchemaPath;
  }

  async deleteWorkflowDefinitionById(swfId: string): Promise<void> {
    const definitionsPath = resolvePackagePath(
      `@backstage/plugin-swf-backend`,
      `${this.resourcesPath}/${swfId}.sw.json`,
    );
    await fs.rm(definitionsPath, { force: true });
  }
}
