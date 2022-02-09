type MediaType = "image/jpeg" | "image/png" | "image/webp";
interface Options {
  width: number;
  height: number;
  type: MediaType;
}

const createBase64 = (source: CanvasImageSource, { width, height, type } : Options) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext('2d');

  canvas.width = (width / 1) ^ 0;
  canvas.height = (height / 1) ^ 0;

  ctx.drawImage(source, 0, 0);

  return canvas.toDataURL(type).slice(23);
}

// createBase64('', { width: 12, height: 12, type: 'image/jpeg' })