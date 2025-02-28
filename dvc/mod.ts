/**
 * Support for rendering DVC pipelines.
 *
 * @module
 */

import { basename, dirname, fromFileUrl, join as joinPath } from "@std/path/posix";

export const name = "DVC workflow";

import { DVCPipeline } from "./pipeline.ts";
import { PIPELINE_SCHEMA, PipelineSpec } from "./schema.ts";

export type { ActionStageSpec, ForeachStageSpec, PipelineSpec, StageSpec } from "./schema.ts";
export { PIPELINE_SCHEMA, STAGE_SCHEMA } from "./schema.ts";
export { DVCPipeline };

export async function load(url: string | URL): Promise<PipelineSpec> {
  if (url instanceof URL) {
    url = url.toString();
  }
  let mod = await import(url);

  let obj = mod.default ?? mod.pipeline;
  if (obj instanceof DVCPipeline) {
    return obj;
  } else if (obj) {
    return PIPELINE_SCHEMA.parse(obj);
  } else {
    throw new Error("module does not export pipeline object");
  }
}

export function modelData(model: PipelineSpec): Record<string, unknown> {
  return model;
}

export function defaultOutput(url: string | URL): string | null {
  let path = fromFileUrl(url);
  if (basename(path) != "pipeline.ts") {
    console.warn("DVC pipeline not named pipeline.ts");
  }

  return joinPath(dirname(path), "dvc.yaml");
}
