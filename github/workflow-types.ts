/**
 * TypeScript types for GitHub workflows (incomplete).
 * @module
 */

export type Workflow = {
  name?: string;
  on?: Record<string, unknown>;
  concurrency?: {
    group: string;
    ["cancel-in-progress"]?: boolean;
  };
  permissions?: Record<string, "read" | "write">;
  jobs: Record<string, WorkflowJob>;
};

export type WorkflowJob = {
  name?: string;
  ["runs-on"]?: string;
  if?: string;
  outputs?: Record<string, string>;
  environment?: string | Record<string, string>;
  ["timeout-minutes"]?: number;
  strategy?: Record<string, unknown>;
  defaults?: Record<string, unknown>;
  needs?: string[];
  steps?: WorkflowStep[];
};

export type WorkflowStep = {
  id?: string;
  name?: string;
  uses?: string;
  if?: string;
  run?: string;
  shell?: string;
  with?: Record<string, string | number | boolean>;
  env?: Record<string, string | number>;
};
