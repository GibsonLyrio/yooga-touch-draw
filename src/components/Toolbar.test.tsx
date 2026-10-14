import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ELEMENTS } from "../editor/elements";
import { Toolbar } from "./Toolbar";

describe("biblioteca de elementos", () => {
  it("preserva a proporção de todos os ícones da lista", () => {
    const markup = renderToStaticMarkup(<Toolbar onAdd={() => undefined} />);
    const preservedIcons = markup.match(
      /preserveAspectRatio="xMidYMid meet"/g,
    );
    expect(preservedIcons).toHaveLength(Object.keys(ELEMENTS).length);
  });

  it("mantém cards com altura própria dentro da área rolável", () => {
    const cssPath = fileURLToPath(new URL("../index.css", import.meta.url));
    const css = readFileSync(cssPath, "utf8");
    const listRule = css.match(/\.element-buttons\s*\{([^}]*)\}/)?.[1] ?? "";
    const cardRule = css.match(/\.element-button\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(listRule).toMatch(/grid-auto-rows:\s*max-content/);
    expect(listRule).toMatch(/align-content:\s*start/);
    expect(listRule).toMatch(/overflow-y:\s*auto/);
    expect(cardRule).toMatch(/min-height:\s*122px/);
    expect(cardRule).toMatch(/flex-shrink:\s*0/);
  });
});
