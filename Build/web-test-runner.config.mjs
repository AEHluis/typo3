/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

import { chromeLauncher } from '@web/test-runner';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { importMapsPlugin } from '@web/dev-server-import-maps';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { readdirSync, statSync, existsSync } from 'fs';

const mode = process.env.MODE || 'prod';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

const chromeSandboxRaw = process.env.CHROME_SANDBOX || 'true';
if (!['true', 'false', '1', '0'].includes(chromeSandboxRaw)) {
  throw new Error(`CHROME_SANDBOX must be "true" ("1") or "false" ("0"), was "${chromeSandboxRaw}"`);
}
const chromeSandbox = ['true', '1'].includes(chromeSandboxRaw);

const launchOptions = {
  headless: mode === 'prod',
  devtools: mode === 'dev'
};

const chromeLaunchOptions = { ...launchOptions, args: chromeSandbox ? [] : ['--no-sandbox'] };

const browsers = {
  // Locally installed chrome
  chrome: chromeLauncher({ launchOptions: chromeLaunchOptions }),

  // Browser testing via playwright browsers (requires `npx playwright install`)
  chromium: playwrightLauncher({ product: 'chromium', launchOptions: chromeLaunchOptions }),
  firefox: playwrightLauncher({ product: 'firefox', launchOptions }),
  webkit: playwrightLauncher({ product: 'webkit', launchOptions }),
};

const defaultBrowsers = [
  browsers.chrome
];

// Prepend BROWSERS=x,y to `npm run test` to run a defined set of browsers
// e.g. `BROWSERS=chromium,firefox npm run test`
const noBrowser = (b) => {
  throw new Error(`No browser configured named '${b}'; using defaults`);
};
let commandLineBrowsers;
try {
  commandLineBrowsers = process.env.BROWSERS?.split(',').map(
    (b) => browsers[b] ?? noBrowser(b)
  );
} catch (e) {
  console.warn(e);
}

const packages = readdirSync('Sources/TypeScript')
  .filter(dir =>
    statSync(`Sources/TypeScript/${dir}`).isDirectory() &&
    existsSync(`Sources/TypeScript/${dir}/tests`)
  );

// https://modern-web.dev/docs/test-runner/cli-and-configuration/
export default {
  rootDir: '../',
  groups: packages.map(pkg => ({
    name: pkg,
    files: `Sources/TypeScript/${pkg}/tests/**/*.ts`,
  })),
  nodeResolve: false,
  preserveSymlinks: true,
  browsers: commandLineBrowsers ?? defaultBrowsers,
  plugins: [
    esbuildPlugin({ ts: true }),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            '@open-wc/testing': './Build/node_modules/@open-wc/testing/index.js',
            '@open-wc/testing-helpers': './Build/node_modules/@open-wc/testing-helpers/index.js',
            '@open-wc/semantic-dom-diff': './Build/node_modules/@open-wc/semantic-dom-diff/index.js',
            '@open-wc/scoped-elements': '/Build/node_modules/@open-wc/scoped-elements/index.js',
            '@open-wc/dedupe-mixin': '/Build/node_modules/@open-wc/dedupe-mixin/index.js',
            '@web/test-runner-commands':  './Build/node_modules/@web/test-runner-commands/browser/commands.mjs',
            '@web/test-runner-commands/plugins':  './Build/node_modules/@web/test-runner-commands/plugins.mjs',
            '@esm-bundle/chai': './Build/node_modules/@esm-bundle/chai/esm/chai.js',
            'chai-a11y-axe': './Build/node_modules/chai-a11y-axe/index.js',
            'axe-core/': '/Build/node_modules/axe-core/',
            'sinon': '/Build/node_modules/sinon/pkg/sinon-esm.js',

            '@typo3/core/': './typo3/sysext/core/Resources/Public/JavaScript/',
            'autosize': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/autosize.js',
            'bootstrap': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/bootstrap.js',
            'cropperjs': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/cropperjs.js',
            'css-tree': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/css-tree.js',
            'd3-dispatch': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/d3-dispatch.js',
            'd3-drag': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/d3-drag.js',
            'd3-selection': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/d3-selection.js',
            'flatpickr/': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/flatpickr/',
            'interactjs': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/interact.js',
            'jquery': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/jquery.js',
            'jquery/': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/jquery/',
            'jquery/autocomplete.js': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/jquery.autocomplete.js',
            'jquery-ui/': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/jquery-ui/',
            '@lit/reactive-element': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/@lit/reactive-element/reactive-element.js',
            '@lit/reactive-element/': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/@lit/reactive-element/',
            'lit': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/lit/index.js',
            'lit/': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/lit/',
            'lit-element': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/lit-element/index.js',
            'lit-element/': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/lit-element/',
            'lit-html': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/lit-html/lit-html.js',
            'lit-html/': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/lit-html/',
            'luxon': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/luxon.js',
            'nprogress': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/nprogress.js',
            'sortablejs': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/sortablejs.js',
            'tablesort.dotsep.js': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/tablesort.dotsep.js',
            'tablesort.number.js': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/tablesort.number.js',
            'tablesort': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/tablesort.js',
            'taboverride': './typo3/sysext/core/Resources/Public/JavaScript/Contrib/taboverride.js',

            '@typo3/scheduler/': './typo3/sysext/scheduler/Resources/Public/JavaScript/',
            '@typo3/filelist/': './typo3/sysext/filelist/Resources/Public/JavaScript/',
            '@typo3/impexp/': './typo3/sysext/impexp/Resources/Public/JavaScript/',
            '@typo3/form/backend/': './typo3/sysext/form/Resources/Public/JavaScript/backend/',
            '@typo3/install/': './typo3/sysext/install/Resources/Public/JavaScript/',
            '@typo3/info/': './typo3/sysext/info/Resources/Public/JavaScript/',
            '@typo3/linkvalidator/': './typo3/sysext/linkvalidator/Resources/Public/JavaScript/',
            '@typo3/redirects/': './typo3/sysext/redirects/Resources/Public/JavaScript/',
            '@typo3/recycler/': './typo3/sysext/recycler/Resources/Public/JavaScript/',
            '@typo3/setup/': './typo3/sysext/setup/Resources/Public/JavaScript/',
            '@typo3/rte-ckeditor/': './typo3/sysext/rte_ckeditor/Resources/Public/JavaScript/',
            '@typo3/ckeditor5-bundle.js': './typo3/sysext/rte_ckeditor/Resources/Public/Contrib/ckeditor5-bundle.js',
            '@typo3/ckeditor5-inspector.js': './typo3/sysext/rte_ckeditor/Resources/Public/Contrib/ckeditor5-inspector.js',
            '@typo3/ckeditor5/translations/': './typo3/sysext/rte_ckeditor/Resources/Public/Contrib/translations/',
            '@typo3/adminpanel/': './typo3/sysext/adminpanel/Resources/Public/JavaScript/',
            '@typo3/backend/': './typo3/sysext/backend/Resources/Public/JavaScript/',
            '@typo3/backend/contrib/mark.js': './typo3/sysext/backend/Resources/Public/JavaScript/Contrib/mark.js',
            'alwan': './typo3/sysext/backend/Resources/Public/JavaScript/Contrib/alwan.js',
            'select-pure': './typo3/sysext/backend/Resources/Public/JavaScript/Contrib/select-pure.js',

            '@typo3/belog/': './typo3/sysext/belog/Resources/Public/JavaScript/',
            '@typo3/beuser/': './typo3/sysext/beuser/Resources/Public/JavaScript/',

            '@typo3/dashboard/': './typo3/sysext/dashboard/Resources/Public/JavaScript/',
            '@typo3/dashboard/contrib/chartjs.js': './typo3/sysext/dashboard/Resources/Public/JavaScript/Contrib/chartjs.js',
            'muuri': './typo3/sysext/dashboard/Resources/Public/JavaScript/Contrib/muuri.js',

            '@typo3/extensionmanager/': './typo3/sysext/extensionmanager/Resources/Public/JavaScript/',
            '@typo3/lowlevel/': './typo3/sysext/lowlevel/Resources/Public/JavaScript/',
            '@typo3/opendocs/': './typo3/sysext/opendocs/Resources/Public/JavaScript/',

            '@typo3/t3editor/': './typo3/sysext/t3editor/Resources/Public/JavaScript/',
            'crelt': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/crelt.js',
            'style-mod': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/style-mod.js',
            'w3c-keyname': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/w3c-keyname.js',
            '@lezer/common': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@lezer/common.js',
            '@lezer/css': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@lezer/css.js',
            '@lezer/html': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@lezer/html.js',
            '@lezer/javascript': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@lezer/javascript.js',
            '@lezer/json': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@lezer/json.js',
            '@lezer/php': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@lezer/php.js',
            '@lezer/xml': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@lezer/xml.js',
            '@lezer/lr': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@lezer/lr.js',
            '@lezer/highlight': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@lezer/highlight.js',
            '@codemirror/autocomplete': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/autocomplete.js',
            '@codemirror/closebrackets': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/closebrackets.js',
            '@codemirror/commands': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/commands.js',
            '@codemirror/comment': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/comment.js',
            '@codemirror/fold': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/fold.js',
            '@codemirror/gutter': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/gutter.js',
            '@codemirror/highlight': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/highlight.js',
            '@codemirror/history': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/history.js',
            '@codemirror/language': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/language.js',
            '@codemirror/lang-css': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/lang-css.js',
            '@codemirror/lang-html': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/lang-html.js',
            '@codemirror/lang-javascript': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/lang-javascript.js',
            '@codemirror/lang-json': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/lang-json.js',
            '@codemirror/lang-php': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/lang-php.js',
            '@codemirror/lang-sql': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/lang-sql.js',
            '@codemirror/lang-xml': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/lang-xml.js',
            '@codemirror/lint': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/lint.js',
            '@codemirror/matchbrackets': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/matchbrackets.js',
            '@codemirror/panel': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/panel.js',
            '@codemirror/rangeset': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/rangeset.js',
            '@codemirror/rectangular-selection': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/rectangular-selection.js',
            '@codemirror/search': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/search.js',
            '@codemirror/state': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/state.js',
            '@codemirror/text': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/text.js',
            '@codemirror/tooltip': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/tooltip.js',
            '@codemirror/theme-one-dark': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/theme-one-dark.js',
            '@codemirror/view': './typo3/sysext/t3editor/Resources/Public/JavaScript/Contrib/@codemirror/view.js',

            '@typo3/tstemplate/': './typo3/sysext/tstemplate/Resources/Public/JavaScript/',
            '@typo3/viewpage/': './typo3/sysext/viewpage/Resources/Public/JavaScript/',
            '@typo3/workspaces/': './typo3/sysext/workspaces/Resources/Public/JavaScript/',
          }
        }
      }
    })
  ],
  testFramework: {
    // https://mochajs.org/api/mocha
    config: {
      ui: 'bdd',
      timeout: '60000'
    },
  },
};
