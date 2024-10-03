/**
 * DVC pipeline abstraction and utilities.
 * @module
 */
import { join, normalize, relative } from "@std/path/posix";

import { StageSpec } from "./schema.ts";

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

  /**
   * Resolve a path relative to this pipeline (possibly with an additional
   * working directory specification, as in the `wdir` option in a DVC stage) to
   * a path relative to the project root.
   *
   * @param path The path to resolve, relative to this pipeline or working
   * directory.
   * @param wdir The working directory, relative to this pipeline.
   */
  resolvePath(path: string, wdir?: string | null): string {
    let base = this.dir;
    if (wdir) base = join(base, wdir);
    let rpath = join(base, path);
    rpath = normalize(rpath);
    if (rpath.startsWith("../")) {
      throw new Error(`path outside project root: ${rpath}`);
    }
    return rpath;
  }

  /**
   * Relativize a path to this pipeline (and optionally a stage `wdir`).
   *
   * @param path The path to relativize, relative to the project root.
   * @param wdir The working directory, relative to this pipeline (a stage `wdir`).
   */
  relativize(path: string, wdir?: string | null): string {
    let base = this.dir;
    if (wdir) base = join(base, wdir);
    let rpath = relative(base, path);
    rpath = normalize(rpath);
    return rpath;
  }
}
