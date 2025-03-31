export const webBundleDevDependencies = {
    "@babel/core": "^7.20.0",
    "@babel/plugin-proposal-class-properties": "^7.18.6",
    "@babel/plugin-proposal-export-namespace-from": "^7.18.9",
    "@babel/plugin-proposal-object-rest-spread": "^7.20.7",
    "@babel/plugin-transform-modules-commonjs": "^7.21.2",
    "@babel/preset-env": "^7.20.2",
    "@babel/preset-flow": "^7.18.6",
    "@babel/preset-react": "^7.18.6",
    "@babel/preset-typescript": "^7.21.0",
    "@babel/runtime": "^7.20.0",
    "@types/react": "^18.0.24",
    ajv: "^8.17.1",
    "babel-loader": "^9.1.2",
    "babel-plugin-react-native-web": "^0.19.13",
    "html-webpack-plugin": "^5.6.3",
    "ts-loader": "^9.5.1",
    typescript: "4.8.4",
    "url-loader": "^4.1.1",
    webpack: "^5.75.0",
    "webpack-cli": "^5.0.1",
    "webpack-dev-server": "^4.11.1"
};
// webpack.config.js if react-native-nano , rn-nano-sync are installed in node_modules
// export const webPackConfig = `
// const path = require('path');
// const {version} = require('./package.json');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const webpack = require('webpack');
// module.exports = {
//   mode: 'production',
//   // Path to the entry file, change it according to the path you have
//   entry: path.join(__dirname, 'index.web.js'),
//   plugins: [
//     new HtmlWebpackPlugin({
//       filename: 'index.html',
//       template: './web/index.html',
//     }),
//     new webpack.EnvironmentPlugin({JEST_WORKER_ID: null}),
//     new webpack.DefinePlugin({
//       __DEV__: process.env.NODE_ENV === 'development',
//     }),
//     new webpack.DefinePlugin({process: {env: {}}}),
//   ],
//   // Path for the output files
//   output: {
//     path: path.join(__dirname, './web/dist'),
//     filename: "app.bundle.js",
//   },
//   // Enable source map support
//   devtool: 'source-map',
//   // Loaders and resolver config
//   module: {
//     rules: [
//       {
//         test: /\\.js$/,
//         exclude: /node_modules\\/(@react-native-firebase)/,
//         use: {
//           loader: 'babel-loader',
//           // Other babel-loader options...
//         },
//       },
//       {
//         test: /\\.(js|jsx|ts|tsx)$/,
//         include: [
//           path.resolve(__dirname, 'src'), // Your source code
//           path.resolve(__dirname, 'node_modules/react-native-nano'), // Include react-native-nano
//         ],
//         exclude:
//           /node_modules\\/(?!react-native-nano|react-native-web|react-native-vector-icons)/, // Allow specific packages
//         use: {
//           loader: 'babel-loader',
//           options: {
//             babelrc: false,
//             configFile: false,
//             presets: [
//               ['@babel/preset-env', {useBuiltIns: 'usage', corejs: 2}],
//               '@babel/preset-react',
//               '@babel/preset-typescript', // Handle TypeScript
//             ],
//             plugins: [
//              ['@babel/plugin-proposal-class-properties', { loose: true }],
//           ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
//             ["@babel/plugin-transform-private-methods", { "loose": true }],
//   ["@babel/plugin-transform-class-properties", { "loose": true }],
//            ["@babel/plugin-transform-private-property-in-object", { "loose": true }]
//             ],
//           },
//         },
//       },
//       {
//         test: /\\.js$/,
//         exclude: /node_modules[/\\\\](?!react-native-vector-icons)/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             // Disable reading babel configurationresource
//             babelrc: false,
//             configFile: false,
//             // The configuration for compilation
//             presets: [
//               ['@babel/preset-env', {useBuiltIns: 'usage',corejs: 2}],
//               '@babel/preset-react',
//               '@babel/preset-flow',
//               '@babel/preset-typescript',
//             ],
//             plugins: [
//              ['@babel/plugin-proposal-class-properties', { loose: true }],
//           ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
//             ["@babel/plugin-transform-private-methods", { "loose": true }],
//   ["@babel/plugin-transform-class-properties", { "loose": true }],
//            ["@babel/plugin-transform-private-property-in-object", { "loose": true }]
//             ],
//           },
//         },
//       },
//       {
//         test: /\\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
//         type: 'asset/resource',
//       },
//       {
//         test: /\\.(png|jpg|gif)$/i,
//         use: [
//           {
//             loader: 'url-loader',
//             options: {
//               limit: 8192,
//             },
//           },
//         ],
//       },
//       {
//         test: /\\.jsx?$/,
//         exclude: /node_modules\\/(?!(react-native-animatable)\\/).*/,
//         loader: 'babel-loader',
//       },
//       {
//         test: /\\.(js|jsx)$/,
//         exclude: /node_modules\\/(?!react-native-reanimated)/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: [
//               '@babel/preset-react',
//               {plugins: [ ['@babel/plugin-proposal-class-properties', { loose: true }],]},
//             ],
//           },
//         },
//       },
//     ],
//   },
//   resolve: {
//     alias: {
//       'react-native$': require.resolve('react-native-web'),
//       'react-native-nano$': path.resolve(
//         __dirname,
//         'node_modules/react-native-nano',
//       ),
//     },
//     extensions: [
//       '.web.js',
//       '.js',
//       '.ts',
//       '.web.jsx',
//       '.jsx',
//       '.web.tsx',
//       '.tsx',
//     ],
//     modules: [path.resolve(__dirname), 'node_modules'], // Ensure local modules are resolved
//   },
//   // Development server config
//   devServer: {
//     // contentBase: [path.join(__dirname, 'public')],
//     static: {
//       directory: path.join(__dirname, 'web'),
//     },
//     historyApiFallback: true,
//   },
// };
// `;
// webpack.config.js if react-native-nano , rn-nano-sync are installed in src
export const webPackConfig = `

const path = require('path');
const {version} = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  mode: 'production',

  // Path to the entry file, change it according to the path you have
  entry: path.join(__dirname, 'index.web.js'),
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './web/index.html',
    }),
    new webpack.EnvironmentPlugin({JEST_WORKER_ID: null}),
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV === 'development',
    }),
    new webpack.DefinePlugin({process: {env: {}}}),
  ],
  // Path for the output files
  output: {
    path: path.join(__dirname, './web/dist'),
    filename: "app.bundle.js",
  },

  // Enable source map support
  devtool: 'source-map',

  // Loaders and resolver config
  module: {
    rules: [
      {
        test: /\\.js$/,
        exclude: /node_modules\\/(@react-native-firebase)/,
        use: {
          loader: 'babel-loader',
          // Other babel-loader options...
        },
      },
      {
        test: /\\.(js|jsx|ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'src'), // Your source code
        ],
        exclude:
          /node_modules\\/(?!react-native-web|react-native-vector-icons)/, // Allow specific packages
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: [
              ['@babel/preset-env', {useBuiltIns: 'usage', corejs: 2}],
              '@babel/preset-react',
              '@babel/preset-typescript', // Handle TypeScript
            ],
            plugins: [
             ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
            ["@babel/plugin-transform-private-methods", { "loose": true }],
  ["@babel/plugin-transform-class-properties", { "loose": true }],
           ["@babel/plugin-transform-private-property-in-object", { "loose": true }]
            ],
          },
        },
      },
      {
        test: /\\.js$/,
        exclude: /node_modules[/\\\\](?!react-native-vector-icons)/,
        use: {
          loader: 'babel-loader',
          options: {
            // Disable reading babel configurationresource
            babelrc: false,
            configFile: false,

            // The configuration for compilation
            presets: [
              ['@babel/preset-env', {useBuiltIns: 'usage',corejs: 2}],
              '@babel/preset-react',
              '@babel/preset-flow',
              '@babel/preset-typescript',
            ],
            plugins: [
             ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
            ["@babel/plugin-transform-private-methods", { "loose": true }],
  ["@babel/plugin-transform-class-properties", { "loose": true }],
           ["@babel/plugin-transform-private-property-in-object", { "loose": true }]
            ],
          },
        },
      },

      {
        test: /\\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
        type: 'asset/resource',
      },

      {
        test: /\\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\\.jsx?$/,
        exclude: /node_modules\\/(?!(react-native-animatable)\\/).*/,
        loader: 'babel-loader',
      },
      {
        test: /\\.(js|jsx)$/,
        exclude: /node_modules\\/(?!react-native-reanimated)/,

        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              {plugins: [ ['@babel/plugin-proposal-class-properties', { loose: true }],]},
            ],
          },
        },
      },
    ],
  },

  resolve: {
    alias: {
      'react-native$': require.resolve('react-native-web'),
  

    },
    extensions: [
      '.web.js',
      '.js',
      '.ts',
      '.web.jsx',
      '.jsx',
      '.web.tsx',
      '.tsx',
    ],
  },

  // Development server config
  devServer: {
    // contentBase: [path.join(__dirname, 'public')],
    static: {
      directory: path.join(__dirname, 'web'),
    },
    historyApiFallback: true,
  },
};
`;
export const tsConfigJson = `{
    "compilerOptions": {
      /* Basic Options */
      "target": "es6",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */
      "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
      // "lib": [],                             /* Specify library files to be included in the compilation. */
      "allowJs": true,                       /* Allow javascript files to be compiled. */
      // "checkJs": true,                       /* Report errors in .js files. */
      "jsx": "react",                           /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
      // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
      // "sourceMap": true,                     /* Generates corresponding '.map' file. */
      // "outFile": "./",                       /* Concatenate and emit output to single file. */
      // "outDir": "./",                        /* Redirect output structure to the directory. */
      // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
      // "removeComments": true,                /* Do not emit comments to output. */
      "noEmit": false,                           /* Do not emit outputs. */
      // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
      // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
      // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */
  
      /* Strict Type-Checking Options */
      "strict": false,                           /* Enable all strict type-checking options. */
      // "noImplicitAny": false,                 /* Raise error on expressions and declarations with an implied 'any' type. */
      // "strictNullChecks": false,              /* Enable strict null checks. */
      // "strictFunctionTypes": false,           /* Enable strict checking of function types. */
      // "strictPropertyInitialization": false,  /* Enable strict checking of property initialization in classes. */
      // "noImplicitThis": false,                /* Raise error on 'this' expressions with an implied 'any' type. */
      // "alwaysStrict": false,                  /* Parse in strict mode and emit "use strict" for each source file. */
  
      /* Additional Checks */
      // "noUnusedLocals": true,                /* Report errors on unused locals. */
      // "noUnusedParameters": true,            /* Report errors on unused parameters. */
      // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
      // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */
  
      /* Module Resolution Options */
      "moduleResolution": "node",               /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
      "baseUrl": "./",                          /* Base directory to resolve non-absolute module names. */
      // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
      // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
      // "typeRoots": [],                       /* List of folders to include type definitions from. */
      // "types": [],                           /* Type declaration files to be included in compilation. */
      "allowSyntheticDefaultImports": true,     /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
      "esModuleInterop": true                   /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
      // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
  
      /* Source Map Options */
      // "sourceRoot": "./",                    /* Specify the location where debugger should locate TypeScript files instead of source locations. */
      // "mapRoot": "./",                       /* Specify the location where debugger should locate map files instead of generated locations. */
      // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
      // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */
  
      /* Experimental Options */
      // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
      // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
    },
    "exclude": [
      "node_modules"
    ]
  }`;
export const babelRc = `
  {
    "plugins": [["react-native-web", {"commonjs": true}]]
  }
  `;
export const metroConfigJson = `
  module.exports = {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  };
  `;
export const babelConfigJs = `module.exports = {
    presets: [ '@babel/preset-react'],
    plugins: [
      '@babel/plugin-transform-modules-commonjs',
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
    ],
    env: {
      production: {
        plugins: [
          'react-native-paper/babel',
          '@babel/plugin-syntax-jsx ',
          '@babel/plugin-transform-modules-commonjs',
        ],
      },
    },
  };
  `;
export const webIndexHtml = `
  <!DOCTYPE html>

<head>
  <meta charset="utf-8" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />

  <title>Index in Web</title>
  <style>
    @font-face {
      src: url('../node_modules/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf') format('truetype');
      font-family: 'MaterialCommunityIcons';
      font-display: 'swap';
      font-weight: 'normal';
      font-style: 'normal';
    }

    @font-face {
      src: url('../node_modules/react-native-vector-icons/Fonts/FontAwesome.ttf') format('truetype');
      font-family: 'FontAwesome';
      font-display: 'swap';
      font-weight: 'normal';
      font-style: 'normal';
    }
  </style>
  <style>
    html,
    body,
    #root {
      height: 100%;
    }

    #root {
      display: flex;
      flex-direction: column;
    }
  </style>
</head>

<body>
  <div id="root"></div>

  <script src='app.bundle.js' ></script>
</body>
  `;
export const webpackScriptsObject = {
    web: "webpack-dev-server --open",
    build: "webpack --config webpack.config.js",
};
export const resolutionsObject = {
    ajv: "^8.17.1",
};
export const indexWebJs = `import React from 'react';
import {createRoot} from 'react-dom/client';

import {Provider as PaperProvider} from 'react-native-paper';
import App from './App.web';

export default function Main() {


  return (
    <PaperProvider>
      <React.Fragment>
        <App />
      </React.Fragment>
    </PaperProvider>
  );
}
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Main />);`;
export const appWebJs = `import React, {useEffect, useState} from 'react';
import {NanoApp} from 'react-native-nano';
import cloneDeep from 'lodash/cloneDeep';

const loadingIndicator = {
  name: 'Loading',
  component: 'activity_indicator',
  props: {size: 25, color: 'blue'},
};
const screen = {
  name: 'Loading',
  screen: {
    v1: [loadingIndicator],
  },
  props: {
    screenProps: {
      options: {
        headerShown: false,
      },
    },
    style: {flex: 1, justifyContent: 'center', backgroundColor: 'white'},
  },
};

const screens = [screen];
const App = () => {
  let iframeScreens = null;
  const [allScreen, setAllScreen] = useState(screens);
  const callBack = db => {
    // console.log('useeffect callback', db);
  };

  useEffect(() => {

    window.addEventListener('message', function (event) {
      if (event) {
        if (typeof event.data == 'string') {
          if (event.data != null) {
            try {
              iframeScreens = JSON.parse(event.data);

              const cloned = cloneDeep(iframeScreens);
              setAllScreen(cloned);
            } catch (error) {
              console.log('event data parse failed', error);

              iframeScreens = null;
            }
          }
        }
      }
    });
  }, []);


  return <NanoApp screens={allScreen} packages={[]} />;
};

export default App;`;
//# sourceMappingURL=constants.js.map