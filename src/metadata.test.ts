import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("metadados de compartilhamento", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

  it("declara favicon e imagem Open Graph públicas", () => {
    expect(html).toContain('rel="icon" type="image/png" href="%BASE_URL%favicon.png"');
    expect(html).toContain('property="og:image" content="https://tests.gibsonlyrio.dev/yooga-touch-draw/og-preview.png"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
  });

  it("usa uma imagem social PNG de 1200 por 630 pixels", () => {
    const png = readFileSync(new URL("../public/og-preview.png", import.meta.url));
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
    expect(html).toContain('property="og:image:width" content="1200"');
    expect(html).toContain('property="og:image:height" content="630"');
  });
});
