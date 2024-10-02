/**
 * DVC pipeline abstraction and utilities.
 * @module
 */

import { ActionStageSpec, StageSpec } from "./schema.ts";

/**
 * Symbol to indicate paths should be relative to the project root.
 */
export const PROJECT_ROOT = Symbol.for("pipeline-project-root");
/**
 * Symbol to indicate paths should be relative to the pipeline directory.
 */
export const PIPELINE_DIR = Symbol.for("pipeline-dir");

/**
 * Class wrapping a DVC pipeline with utility and construction functions.
 */
export class DVCPipeline {
  /**
   * The pipeline directory relative to the project root.
   */
  readonly dir: string;
  stages: Record<string, StageSpec>;

  constructor(dir: string, stages?: Record<string, StageSpec>) {
    this.dir = dir;
    this.stages = stages ?? {};
  }

  /**
   * Look up a stage specification.
   * @param name The stage name.
   * @param spec The stage specification.
   */
  stage(name: string, spec: StageSpec) {
    if (this.stages[name]) {
      console.warn("%s: stage %s already defined", name);
    }
    this.stages[name] = spec;
  }
}
