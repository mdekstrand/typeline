/**
 * Schemas for rendering GitHub Actions workflows.  These are still partial.
 *
 * @module
 */
import { Workflow } from "./workflow-types.ts";

export type { Workflow, WorkflowJob, WorkflowStep } from "./workflow-types.ts";
export const name = "GitHub Actions workflow";

export interface Module {
  workflow: Workflow;
}

/**
 * Test whether an object appears to be a workflow module (very incomplete).
 * @param obj The object to test.
 */
export function isWorkflowModule(obj: object): obj is Module {
  return Object.prototype.hasOwnProperty.call(obj, "workflow");
}

/**
 * Load a workflow module.
 * @param url The module URL to load.
 * @returns
 */
export async function load(url: string | URL): Promise<Module> {
  if (url instanceof URL) {
    url = url.toString();
  }
  let mod = await import(url);
  if (isWorkflowModule(mod)) {
    return mod;
  } else {
    throw new Error("module does not appear to be a workflow");
  }
}

export function modelData(module: Module): Record<string, unknown> {
  return module.workflow;
}
