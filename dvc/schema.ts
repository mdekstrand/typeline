/**
 * Zod and TypeScript schema for DVC pipelines.
 * @module
 */
import * as z from "zod";

export const ACTION_SCHEMA = z.object({
  cmd: z.string(),
  wdir: z.string().optional(),
  deps: z.string().array(),
  outs: z.array(z.union([z.string(), z.record(z.object({ cache: z.boolean() }))])),
  metrics: z.array(z.union([z.string(), z.record(z.object({ cache: z.boolean() }))])),
  params: z.array(z.union([z.string(), z.record(z.string().array())])).optional(),
});

/**
 * A single-action DVC stage, or the `do` section of a `foreach` stage.
 */
export type ActionStageSpec = z.infer<typeof ACTION_SCHEMA>;

export const FOREACH_SCHEMA = z.object({
  foreach: z.union([
    z.string().array(),
    z.record(z.union([z.string(), z.number(), z.boolean()])),
  ]),
  do: ACTION_SCHEMA,
});
/**
 * A DVC `foreach` stage.
 */
export type ForeachStageSpec = z.infer<typeof FOREACH_SCHEMA>;

export const STAGE_SCHEMA = z.union([ACTION_SCHEMA, FOREACH_SCHEMA]);

/**
 * A DVC stage (either single-action or `foreach`).
 */
export type StageSpec = ActionStageSpec | ForeachStageSpec;

/**
 * Test if a stage is a single-action stage.
 * @param stage The stage.
 * @returns `true` if the stage is a single-action stage.
 */
export function isActionStage(stage: StageSpec): stage is ActionStageSpec {
  return Object.prototype.hasOwnProperty.call(stage, "cmd");
}

/**
 * Test if a stage is a foreach stage.
 * @param stage The stage.
 * @returns `true` if the stage is a foreach stage.
 */
export function isForeachStage(stage: StageSpec): stage is ForeachStageSpec {
  return Object.prototype.hasOwnProperty.call(stage, "foreach");
}

export const PIPELINE_SCHEMA = z.object({
  stages: z.array(STAGE_SCHEMA),
});

/**
 * A full DVC pipeline.
 */
export type PipelineSpec = z.infer<typeof PIPELINE_SCHEMA>;
