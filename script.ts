import { assert } from "@std/assert/assert";

/**
 * Assemble a script from one or more lines, with appropriate trimming and
 * re-indentation when called with a multi-line string.
 *
 * @param lines The lines of the script.
 * @returns The assembled script string.
 */
export function script(...lines: string[]): string {
  let script = "";
  for (let line of lines) {
    // strip leading newlines
    line = line.replace(/^(\s*?\n)+/, "");
    // look at first line indent
    const m = line.match(/^ */);
    assert(m != null);
    const lead = m[0];
    if (lead.length) {
      line = line.replaceAll(new RegExp(`^ {${lead.length}}`, "gm"), "");
    }
    line = line.trimEnd();
    line += "\n";
    script += line;
  }
  return script;
}
