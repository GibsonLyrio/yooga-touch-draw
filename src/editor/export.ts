import { SCENE_HEIGHT, SCENE_WIDTH } from "./elements";

export function serializeDrawing(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.querySelectorAll("[data-editor-only]").forEach((node) => node.remove());
  clone
    .querySelectorAll("[tabindex]")
    .forEach((node) => node.removeAttribute("tabindex"));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(SCENE_WIDTH));
  clone.setAttribute("height", String(SCENE_HEIGHT));
  return new XMLSerializer().serializeToString(clone);
}

export async function exportPng(svg: SVGSVGElement): Promise<void> {
  const url = URL.createObjectURL(
    new Blob([serializeDrawing(svg)], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error("Não foi possível preparar o desenho."));
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = SCENE_WIDTH * 2;
    canvas.height = SCENE_HEIGHT * 2;
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("Este navegador não disponibilizou a exportação.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result
            ? resolve(result)
            : reject(new Error("Não foi possível gerar o PNG.")),
        "image/png",
      );
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "yooga-touch-draw.png";
    document.body.append(link);
    link.click();
    link.remove();
    // Dá tempo ao navegador de iniciar o download antes de liberar o recurso.
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 60_000);
  } finally {
    URL.revokeObjectURL(url);
  }
}
