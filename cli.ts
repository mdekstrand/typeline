import { resolve } from "@std/path";
import { toFileUrl } from "@std/path/posix";

import { Command } from "@cliffy/command";

import * as github from "./github/mod.ts";
import { renderYaml, saveYaml } from "./yaml.ts";

interface ModelSpec<T> {
  name: string;
  load(url: string): Promise<T>;
  modelData(model: T): Record<string, unknown>;
  defaultOutput?(url: string): string | null;
}

const command = new Command()
  .name("typeline")
  .version("0.1.0")
  .description("Write pipeline specifications in TypeScript.")
  .option("-o, --output <file>", "Render to <file>")
  .option("-c, --stdout", "Force rendering to stdout")
  .group("Model selection")
  .option("--dvc", "Render a DVC pipeline")
  .option("--github", "Render a GitHub Actions workflow")
  .arguments("<module...>");

const { options, args } = await command.parse(Deno.args);

const model = findModel(options);

for (let file of args) {
  console.info("loading %s model from %s", model.name, file);
  let url = toFileUrl(resolve(file));
  let mod = await model.load(url.toString());
  let data = model.modelData(mod);
  let outfn = model.defaultOutput ? model.defaultOutput(file) : null;
  if (outfn == null) {
    console.info("rendered result of %s:", file);
    console.log(renderYaml(data));
  } else {
    console.log("saving to %s", outfn);
    saveYaml(data, outfn, file);
  }
}

function findModel(
  options: { github?: boolean; dvc?: boolean },
): ModelSpec<unknown> {
  if (options.github) {
    return github;
  } else if (options.dvc) {
    console.error("DVC support not yet implemented");
  } else {
    console.error("No pipeline model specified.");
  }
  Deno.exit(2);
}
