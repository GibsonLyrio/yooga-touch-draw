import { readFile, writeFile } from "node:fs/promises";

// Keep the documented design system as the source of truth. No runtime dependency.
const source = new URL("../docs/design-system/tokens.json", import.meta.url);
const destination = new URL("../src/styles/tokens.css", import.meta.url);
const document = JSON.parse(await readFile(source, "utf8"));
const tokens = new Map();
function collect(value, path = "") {
  if (
    value &&
    typeof value === "object" &&
    "type" in value &&
    "value" in value
  ) {
    tokens.set(path, value.value);
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (key !== "meta") collect(child, path ? `${path}.${key}` : key);
    }
  }
}
collect(document);
function resolve(value, seen = []) {
  if (typeof value === "string") {
    const reference = /^\{(.+)\}$/.exec(value)?.[1];
    if (reference) {
      if (!tokens.has(reference) || seen.includes(reference)) {
        throw new Error(`Invalid token reference: ${reference}`);
      }
      return resolve(tokens.get(reference), [...seen, reference]);
    }
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, resolve(v, seen)]),
    );
  }
  return value;
}
const kebab = (value) =>
  value
    .replaceAll(".", "-")
    .replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
const declarations = [];
function emit(path, value) {
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value))
      emit(`${path}.${key}`, child);
  } else {
    declarations.push(`  --y-${kebab(path)}: ${value};`);
  }
}
for (const [path, value] of tokens) {
  // Restaurant table statuses are an optional domain extension, not editor UI.
  if (!path.startsWith("domain.")) emit(path, resolve(value, [path]));
}
await writeFile(
  destination,
  `/* Generated from docs/design-system/tokens.json. Run npm run tokens. */\n:root {\n${declarations.join("\n")}\n}\n`,
);
