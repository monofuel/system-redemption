import fs from 'fs';
import { html } from 'lit-html';

function getHeadBlock() {
  return html`
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="/index.css" />
      <title>SR</title>

      <!--    
        <script src="/scripts/static/three/three.min.js"></script>
        <script src="/scripts/static/lodash.min.js"></script>
        <script src="http://livejs.com/live.js"></script>
    -->
      <script src="/scripts/static/three/three.js"></script>
      <script src="/scripts/static/lodash.js"></script>
      <script src="/scripts/static/OrbitControls.js"></script>
      <script src="/scripts/static/ziploader.min.js"></script>
      <script src="/scripts/static/GLTFLoader.js"></script>
      <script src="/scripts/static/SPE.js"></script>
      <link rel="stylesheet" href="/scripts/static/fontawesome-free/css/all.css" />

      <link rel="stylesheet" href="/scripts/bulma.css" />
      <link rel="stylesheet" href="/scripts/bulmaswatch.min.css" />

      <link rel="stylesheet" href="/scripts/bootstrap.css" />

      <script src="/scripts/static/dat.gui.min.js"></script>

      <script src="/scripts/static/webcomponentsjs/webcomponents-loader.js"></script>
      <script type="module" src="/scripts/bundle.js"></script>
    </head>
  `;
}

export function generateStaticTestFiles() {
  const test = html`
    <!DOCTYPE html>
    <html>
      ${getHeadBlock()},
      <body>
        <h1>This is an html lit element</h1>
      </body>
    </html>
  `;
  fs.writeFileSync('public/gen/index.html', test.getHTML());
}
