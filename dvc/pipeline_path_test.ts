import { assertEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

import { DVCPipeline } from "./pipeline.ts";

describe("Pipeline.resolvePath", () => {
  const rootPipeline = new DVCPipeline("");

  it("should return a basic path unchanged at root", () => {
    assertEquals(rootPipeline.resolvePath("out.csv"), "out.csv");
  });

  it("should combine working dir with basic path", () => {
    assertEquals(rootPipeline.resolvePath("out.csv", "outputs"), "outputs/out.csv");
  });

  it("should combine pipeline dir with basic path", () => {
    const pipe = new DVCPipeline("tuning");
    assertEquals(pipe.resolvePath("out.csv"), "tuning/out.csv");
  });

  it("should combine pipeline dir with wdir and basic path", () => {
    const pipe = new DVCPipeline("tuning");
    assertEquals(pipe.resolvePath("out.csv", "readme"), "tuning/readme/out.csv");
  });

  it("should combine pipeline dir parent path", () => {
    const pipe = new DVCPipeline("tuning");
    assertEquals(pipe.resolvePath("../out.csv"), "out.csv");
  });

  it("should combine pipeline dir and parent wdir", () => {
    const pipe = new DVCPipeline("tuning");
    assertEquals(pipe.resolvePath("outputs/out.csv", ".."), "outputs/out.csv");
  });

  it("should fail on too many ..", () => {
    const pipe = new DVCPipeline("tuning");
    assertThrows(() => pipe.resolvePath("../out.csv", ".."));
  });
});

describe("Pipeline.relativize", () => {
  const rootPipeline = new DVCPipeline("");

  it("should return a basic path unchanged at root", () => {
    assertEquals(rootPipeline.relativize("out.csv"), "out.csv");
  });

  it("should combine working dir with basic path", () => {
    assertEquals(rootPipeline.relativize("out.csv", "outputs"), "../out.csv");
  });

  it("should strip its own path", () => {
    const pipe = new DVCPipeline("tuning");
    assertEquals(pipe.relativize("tuning/out.csv"), "out.csv");
  });

  it("should look up when needed", () => {
    const pipe = new DVCPipeline("tuning");
    assertEquals(pipe.relativize("out.csv"), "../out.csv");
  });

  it("should look beside with parent wdir", () => {
    const pipe = new DVCPipeline("tuning");
    assertEquals(pipe.relativize("out.csv", ".."), "out.csv");
  });

  it("should look up once with nested wdir", () => {
    const pipe = new DVCPipeline("tuning");
    assertEquals(pipe.relativize("tuning/out.csv", "model"), "../out.csv");
    assertEquals(pipe.relativize("out.csv", "model"), "../../out.csv");
    assertEquals(pipe.relativize("metrics/out.csv", "model"), "../../metrics/out.csv");
    assertEquals(pipe.relativize("tuning/metrics/out.csv", "model"), "../metrics/out.csv");
  });
});
