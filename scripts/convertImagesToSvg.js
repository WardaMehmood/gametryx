import fs from "fs";
import path from "path";

function getPngDimensions(buffer) {
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

function convertPngToSvg(pngPath, svgPath, isBg = false) {
  if (!fs.existsSync(pngPath)) {
    console.error("File not found:", pngPath);
    return;
  }
  const buffer = fs.readFileSync(pngPath);
  const { width, height } = getPngDimensions(buffer);
  const base64 = buffer.toString("base64");
  const dataUri = `data:image/png;base64,${base64}`;

  const aspect = isBg ? 'preserveAspectRatio="xMidYMid slice"' : 'preserveAspectRatio="xMidYMid meet"';

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="100%" height="100%" ${aspect}>
  <image width="${width}" height="${height}" href="${dataUri}" xlink:href="${dataUri}"/>
</svg>`;

  fs.writeFileSync(svgPath, svgContent, "utf8");
  console.log(`Converted ${pngPath} -> ${svgPath} (${width}x${height})`);
}

const assetsDir = path.join(process.cwd(), "src", "assets");
convertPngToSvg(path.join(assetsDir, "logo.png"), path.join(assetsDir, "logo.svg"), false);
convertPngToSvg(path.join(assetsDir, "hero-bg.png"), path.join(assetsDir, "hero-bg.svg"), true);

const allFiles = fs.readdirSync(assetsDir);
allFiles.forEach((file) => {
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    const filePath = path.join(assetsDir, file);
    const svgPath = path.join(assetsDir, file.replace(/\.(jpg|jpeg)$/, ".svg"));
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString("base64");
    const dataUri = `data:image/jpeg;base64,${base64}`;
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 800" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
  <image width="1200" height="800" href="${dataUri}" xlink:href="${dataUri}"/>
</svg>`;
    fs.writeFileSync(svgPath, svgContent, "utf8");
    console.log(`Converted JPG ${file} -> SVG`);
  }
});
