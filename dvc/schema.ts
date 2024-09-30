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
});

/**
 * A single-action DVC stage, or the `do` section of a `foreach` stage.
 */
export type ActionStage = z.infer<typeof ACTION_SCHEMA>;

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
export type ForeachStage = z.infer<typeof FOREACH_SCHEMA>;

export const STAGE_SCHEMA = z.union([ACTION_SCHEMA, FOREACH_SCHEMA]);

/**
 * A DVC stage (either single-action or `foreach`).
 */
export type Stage = ActionStage | ForeachStage;
