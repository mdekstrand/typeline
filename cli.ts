import { resolve } from "@std/path";
import { toFileUrl } from "@std/path/posix";
import { expandGlob } from "@std/fs";

import { Command } from "@cliffy/command";

import * as github from "./github/mod.ts";
import * as dvc from "./dvc/mod.ts";
import { renderYaml, saveYaml } from "./yaml.ts";
import { dropUndefined } from "./cleanup.ts";

interface ModelSpec<T> {
  name: string;
  load(url: string): Promise<T>;
  modelData(model: T): Record<string, unknown>;
  defaultOutput?(url: string): string | null;
  glob?: string;
}

const command = new Command()
  .name("typeline")
  .version("0.1.0-beta3")
  .description("Write pipeline specifications in TypeScript.")
  .option("-o, --output <file>", "Render to <file>")
  .option("-c, --stdout", "Force rendering to stdout")
  .group("Model selection")
  .option("--dvc", "Render a DVC pipeline")
  .option("--github", "Render a GitHub Actions workflow")
  .arguments("[module...]");

/**
 * Run the Typeline program.
 * @param cliArgs The CLI arguments (usually pass `Deno.args`).
 */
export async function typeline(cliArgs: string[]) {
  let { options, args } = await command.parse(cliArgs);

  const model = findModel(options);

  if (args.length == 0) {
    if (model.glob) {
      args = (await Array.fromAsync(expandGlob(model.glob, { exclude: [".*"] }))).map((e) =>
        e.path
      );
    } else {
      console.error("no files specified");
      Deno.exit(2);
    }
  }

  for (let file of args) {
    console.info("loading %s model from %s", model.name, file);
    let url = toFileUrl(resolve(file));
    let mod = await model.load(url.toString());
    let data = model.modelData(mod);
    dropUndefined(data);
    let outfn: string | undefined | null = options.output;
    if (!outfn && model.defaultOutput) {
      outfn = model.defaultOutput(file);
    }
    if (options.stdout || outfn == null) {
      console.info("rendered result of %s:", file);
      console.log(renderYaml(data));
    } else {
      console.log("saving to %s", outfn);
      saveYaml(data, outfn, file);
    }
  }
}

function findModel(
  options: { github?: boolean; dvc?: boolean },
): ModelSpec<unknown> {
  if (options.github) {
    return github;
  } else if (options.dvc) {
    return dvc;
  } else {
    console.error("No pipeline model specified.");
  }
  Deno.exit(2);
}

if (Deno.mainModule == import.meta.url) {
  await typeline(Deno.args);
}
