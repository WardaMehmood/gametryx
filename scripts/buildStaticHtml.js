import fs from "fs";
import path from "path";

const clientDir = path.join(process.cwd(), "dist", "client");
const assetsDir = path.join(clientDir, "assets");

if (!fs.existsSync(assetsDir)) {
  console.error("Assets directory does not exist:", assetsDir);
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const cssFiles = files.filter((f) => f.endsWith(".css"));
const jsFiles = files.filter((f) => f.endsWith(".js"));

const jsFilesSorted = jsFiles
  .map((f) => {
    const stat = fs.statSync(path.join(assetsDir, f));
    return { name: f, size: stat.size };
  })
  .sort((a, b) => b.size - a.size);

console.log("Found JS files:", jsFilesSorted);
console.log("Found CSS files:", cssFiles);

const mainJs = jsFilesSorted.length > 0 ? jsFilesSorted[0].name : "";
const mainCss = cssFiles.length > 0 ? cssFiles[0] : "";

if (!mainJs) {
  console.error("No JS bundle found in dist/client/assets!");
  process.exit(1);
}

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gametryx - Indie Game Showcase</title>
    <link rel="icon" type="image/png" href="./favicon.png" />
    ${mainCss ? `<link rel="stylesheet" href="./assets/${mainCss}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./assets/${mainJs}"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(clientDir, "index.html"), html);
fs.writeFileSync(path.join(clientDir, "404.html"), html);

console.log(`Successfully generated index.html & 404.html using JS: ${mainJs}, CSS: ${mainCss}`);
