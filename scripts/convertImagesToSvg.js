import fs from "fs";
import path from "path";

function getPngDimensions(buffer) {
  // PNG IHDR chunk is at byte 8; width is at 16..20, height at 20..24
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

function convertPngToSvg(pngPath, svgPath) {
  if (!fs.existsSync(pngPath)) {
    console.error("File not found:", pngPath);
    return;
  }
  const buffer = fs.readFileSync(pngPath);
  const { width, height } = getPngDimensions(buffer);
  const base64 = buffer.toString("base64");
  const dataUri = `data:image/png;base64,${base64}`;

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <image width="${width}" height="${height}" href="${dataUri}"/>
</svg>`;

  fs.writeFileSync(svgPath, svgContent, "utf8");
  console.log(`Converted ${pngPath} -> ${svgPath} (${width}x${height})`);
}

const assetsDir = path.join(process.cwd(), "src", "assets");
convertPngToSvg(path.join(assetsDir, "logo.png"), path.join(assetsDir, "logo.svg"));
convertPngToSvg(path.join(assetsDir, "hero-bg.png"), path.join(assetsDir, "hero-bg.svg"));

// Also convert any other png/jpg in assets just in case
const allFiles = fs.readdirSync(assetsDir);
allFiles.forEach((file) => {
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    const filePath = path.join(assetsDir, file);
    const svgPath = path.join(assetsDir, file.replace(/\.(jpg|jpeg)$/, ".svg"));
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString("base64");
    const dataUri = `data:image/jpeg;base64,${base64}`;
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <image width="1200" height="800" href="${dataUri}"/>
</svg>`;
    fs.writeFileSync(svgPath, svgContent, "utf8");
    console.log(`Converted JPG ${file} -> SVG`);
  }
});
