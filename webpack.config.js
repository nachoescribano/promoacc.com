const { merge } = require("lodash");
const path = require("path");
// const filewatcherPlugin = require("filewatcher-webpack-plugin");
const HandlebarsPlugin = require("handlebars-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WatchFileAndRunCallbackWebpackPlugin = require("watch-file-change-and-run-callback-webpack-plugin");
const languanges = ["de", "en", "es", "fr", "pt"];

// let langEs = require("./src/languages/es.json");
// let langEn = require("./src/languages/en.json");

// let commonsInfo = require("./src/commons.json");

// langEn = merge(commonsInfo, langEn);
// console.log(JSON.stringify(langEs));
function generateHandlerbarsPlugin(language) {
  return new HandlebarsPlugin({
    // path to hbs entry file(s). Also supports nested directories if write path.join(process.cwd(), "app", "src", "**", "*.hbs"),
    // entry: path.join(process.cwd(), "app", "src", "*.hbs"),
    entry: path.join(process.cwd(), "src", "templates", "*.hbs"),

    // output path and filename(s). This should lie within the webpacks output-folder
    // if ommited, the input filepath stripped of its extension will be used
    output: path.join(process.cwd(), "dist", `[name]-${language}.html`),
    // you can also add a [path] variable, which will emit the files with their relative path, like
    // output: path.join(process.cwd(), "build", [path], "[name].html"),

    // data passed to main hbs template: `main-template(data)`
    // data: require("./src/languages/es.json"),
    // or add it as filepath to rebuild data on change using webpack-dev-server
    data: path.join(__dirname, `src/languages/${language}.json`),
    // data: merge(commonsInfo, langEs),
    // globbed path to partials, where folder/filename is unique
    partials: [
      path.join(process.cwd(), "src", "partial-templates", "*", "*.hbs"),
    ],

    // register custom helpers. May be either a function or a glob-pattern
    // helpers: {
    //   nameOfHbsHelper: Function.prototype,
    //   projectHelpers: path.join(
    //     process.cwd(),
    //     "app",
    //     "helpers",
    //     "*.helper.js"
    //   ),
    // },
    helpers: {
      math: function (lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue,
        }[operator];
      },
      ifEven: function (value) {
        return value % 2 === 0;
      },
    },

    // hooks
    // getTargetFilepath: function (filepath, outputTemplate) {},
    // getPartialId: function (filePath) {}
    // onBeforeSetup: function (Handlebars) {},
    // onBeforeAddPartials: function (Handlebars, partialsMap) {},
    // onBeforeCompile: function (Handlebars, templateContent) {},
    // onBeforeRender: function (Handlebars, data, filename) {},
    // onBeforeSave: function (Handlebars, resultHtml, filename) {},
    // onDone: function (Handlebars, filename) {}
  });
}
const languangesPlugins = languanges.map((languange) =>
  generateHandlerbarsPlugin(languange)
);
console.log({ languangesPlugins });
new WatchFileAndRunCallbackWebpackPlugin({
  matchs: [
    {
      filePath: `./src/languages/es.json`,
      callback: () => console.log("LANG ES CHANGE"),
    },
    // {
    //   filePath: `${SRC_DIR}/styles/2.less`,
    //   callback: () => console.log("2"),
    // },
  ],
});

module.exports = {
  // mode: "development",
  // module: {
  //   rules: [
  //     {
  //       test: /\.html$/i,
  //       loader: "html-loader",
  //       options: {
  //         attributes: false,
  //       },
  //     },
  //   ],
  // },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    // compress: true,
    port: 9000,
  },
  watchOptions: {
    ignored: /node_modules/,
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(process.cwd(), "assets"),
          to: path.join(process.cwd(), "dist", "assets"),
        },
      ],
    }),
    ...languangesPlugins,
    // new filewatcherPlugin({
    //   watchFileRegex: ["/src/languages/es.json"],
    //   onReadyCallback: () => console.log("Yo Im ready"),
    //   usePolling: false,
    //   ignored: "/node_modules/",
    // }),
  ],
};
