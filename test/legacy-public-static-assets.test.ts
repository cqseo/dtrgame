import { describe, it, expect } from "vitest";
import { createHostFunctions } from "../src/legacy/php/host-environment";
import { PhpArray } from "../src/legacy/template/values";
import { LEGACY_PUBLIC_STATIC_FILES } from "../src/generated/legacy-public-static-files";
import { LEGACY_PUBLIC_IMAGE_SIZES } from "../src/generated/legacy-public-image-sizes";

describe("original PHP static asset metadata", () => {
  const host = createHostFunctions();
  it("reports real original NPC portraits and rejects arbitrary host paths", () => {
    expect(LEGACY_PUBLIC_STATIC_FILES.has("img/n_150.gif")).toBe(true);
    expect(host.get("file_exists")?.(["img/n_150.gif"])).toBe(true);
    expect(host.get("file_exists")?.(["./img/n_150.gif"])).toBe(true);
    expect(host.get("file_exists")?.(["img/does-not-exist.gif"])).toBe(false);
    expect(host.get("file_exists")?.(["../config.php"])).toBe(false);
    expect(host.get("file_exists")?.(["/etc/passwd"])).toBe(false);
    expect(host.get("file_exists")?.(["../img/n_150.gif"])).toBe(false);
  });
  it("reads actual captured image dimensions without filesystem access", () => {
    const expected=LEGACY_PUBLIC_IMAGE_SIZES.get("img/n_150.gif");
    expect(expected).toEqual([140,80]);
    const result=host.get("getimagesize")?.(["img/n_150.gif"]);
    expect(result).toBeInstanceOf(PhpArray);
    expect((result as PhpArray).get(0)).toBe(140);
    expect((result as PhpArray).get(1)).toBe(80);
    expect(host.get("getimagesize")?.(["img/missing.gif"])).toBe(false);
  });
});
