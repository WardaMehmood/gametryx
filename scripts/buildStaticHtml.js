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

// Sort by size descending — largest JS file is the main React app bundle
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

const cssLink = mainCss ? `<link rel="stylesheet" href="./assets/${mainCss}" />` : "";

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Game Tryx — Discover. Download. Play.</title>
    <meta name="description" content="Neon-lit indie game showcase. Discover, download and play games crafted by developers and students." />
    <link rel="icon" type="image/png" href="./favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet" />
    ${cssLink}
  </head>
  <body>
    <div id="root"></div>
    <!-- TanStack Start SSR shim: prevents "Invariant failed" on static hosts -->
    <script>window.__TSR_DEHYDRATED__ = window.__TSR_DEHYDRATED__ || { dehydrated: { router: null, ctx: {} } };</script>
    <script type="module" src="./assets/${mainJs}"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(clientDir, "index.html"), html);
fs.writeFileSync(path.join(clientDir, "404.html"), html);

console.log(`✅ Generated index.html & 404.html`);
console.log(`   JS bundle: ${mainJs}`);
console.log(`   CSS file:  ${mainCss || "(embedded in JS)"}`);
