import * as yaml from "@std/yaml";

export function renderYaml(content: Record<string, unknown>): string {
  return yaml.stringify(content, {
    useAnchors: false,
    lineWidth: 1024,
    schema: "core",
  });
}

export async function saveYaml(
  content: Record<string, unknown>,
  path: string | URL,
  source?: string,
): Promise<void> {
  if (typeof path == "string" && path.startsWith("file://")) {
    path = new URL(path);
  }
  let file = await Deno.open(path, { write: true, create: true, truncate: true });
  let encoder = new TextEncoderStream();
  let outP = encoder.readable.pipeTo(file.writable);
  let write = encoder.writable.getWriter();
  await write.write("# GENERATED FILE, do not edit\n");
  await write.write("# This file was generated with Typeline\n");
  if (source) {
    await write.write(`# generated from: ${source}\n`);
  }
  await write.write(renderYaml(content));
  await write.write("\n");

  await write.close();

  await outP;
}
