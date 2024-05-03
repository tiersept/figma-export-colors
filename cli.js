#!/usr/bin/env node

const defaults = require("./src/defaults");
const figma = require("./src/figma-client");
const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");
const ui = require("cliui")({ width: 80 });
const prompts = require("prompts");
const promptsList = require("./src/prompts");
const mkdirp = require("mkdirp");
const argv = require("minimist")(process.argv.slice(2));
let config = {};
let figmaClient;
const spinner = ora();

function deleteConfig() {
  const configFile = path.resolve(defaults.configFileName);
  if (fs.existsSync(configFile)) {
    fs.unlinkSync(configFile);
    console.info(chalk.cyan.bold("Deleted previous config"));
  }
}

function updateGitIgnore() {
  const ignorePath = ".gitignore";
  const configPath = argv.config || defaults.configFileName;
  const ignoreCompletePath = path.resolve(ignorePath);
  if (fs.existsSync(configPath)) {
    const ignoreContent = `\n#figma-export-config\n${configPath}`;
    const ignore = fs.existsSync(ignoreCompletePath)
      ? fs.readFileSync(ignoreCompletePath, "utf-8")
      : "";
    if (!ignore.includes(ignoreContent)) {
      fs.writeFileSync(ignoreCompletePath, ignore + ignoreContent);
      console.info(`Updated ${ignorePath} : ${ignoreContent}`);
    }
  }
}

function getConfig() {
  return new Promise((resolve) => {
    const configFile = path.resolve(argv.config || defaults.configFileName);
    if (fs.existsSync(configFile)) {
      config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
      const missingConfig = promptsList.filter((q) => !config[q.name]);
      if (missingConfig.length > 0)
        getPromptData(missingConfig).then(() => resolve());
      else resolve();
    } else {
      getPromptData().then(() => resolve());
    }
  });
}

async function getPromptData(list = promptsList) {
  const onCancel = () => {
    process.exit(1);
  };

  const response = await prompts(list, { onCancel });
  config = Object.assign(config, response);
  fs.writeFileSync(defaults.configFileName, JSON.stringify(config, null, 2));
}

function createOutputDirectory() {
  return new Promise((resolve) => {
    const directory = path.resolve(config.colorsExportDirectory);

    if (!fs.existsSync(directory)) {
      console.error(`Directory ${config.colorsExportDirectory} does not exist`);
      if (mkdirp.sync(directory)) {
        console.info(`Created directory ${config.colorsExportDirectory}`);
        resolve();
      }
    } else {
      resolve();
    }
  });
}

function createColorsFile(colorsObject) {
  return new Promise((resolve) => {
    const content = `export const colors = ${JSON.stringify(
      colorsObject,
      null,
      2
    )};\n`;

    fs.writeFile(
      `${config.colorsExportDirectory}/${config.colorsExportFileName}.${
        config.typescript ? "ts" : "js"
      }`,
      content,
      (err) => {
        if (err) throw err;
      }
    );

    resolve();
  });
}

function deleteFile(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        throw err;
      }
      // if no error, file has been deleted successfully
      resolve();
    });
  });
}

function deletePreviousFile() {
  return new Promise((resolve) => {
    const directory = path.resolve(config.colorsExportDirectory);

    const filePath = path.join(
      directory,
      `${config.colorsExportFileName}.${config.typescript ? "ts" : "js"}`
    );

    if (!fs.existsSync(filePath)) {
      console.info(chalk.cyan.bold("No colors file found."));

      resolve();

      return;
    }

    spinner.start("Deleting previous color file.");

    deleteFile(filePath).then(() => {
      spinner.succeed();
      resolve();
    });
  });
}

function getPathToFrame(root, current) {
  if (!current.length) return root;

  const path = [...current];
  const name = path.shift();
  const foundChild = root.children.find((c) => c.name === name);

  if (!foundChild) return root;

  return getPathToFrame(foundChild, path);
}

function getFigmaFile() {
  return new Promise((resolve) => {
    spinner.start(
      "Fetching Figma file (this might take a while depending on the figma file size)"
    );
    figmaClient
      .get(`/files/${config.fileId}`)
      .then((res) => {
        const endTime = new Date().getTime();
        spinner.succeed();
        console.info(
          chalk.cyan.bold(
            `Finished in ${(endTime - res.config.startTime) / 1000}s\n`
          )
        );

        const page = res.data.document.children.find(
          (c) => c.name === config.colorsPage
        );

        if (!page) {
          console.info(
            chalk.red.bold("Cannot find Colors page, check your settings")
          );
          return;
        }

        const shouldGetFrame =
          isNaN(config.colorsFrame) && parseInt(config.colorsFrame) !== -1;

        let pageChildren = page.children;

        if (shouldGetFrame) {
          const frameNameArr = config.colorsFrame.split("/").filter(Boolean);
          const frameName = frameNameArr.pop();
          const frameRoot = getPathToFrame(page, frameNameArr);

          if (!frameRoot.children.find((c) => c.name === frameName)) {
            console.info(
              chalk.red.bold(
                "Cannot find",
                chalk.white.bgRed(frameName),
                "Frame in this Page, check your settings"
              )
            );
            return;
          }

          pageChildren = frameRoot.children.find(
            (c) => c.name === frameName
          ).children;
        }

        resolve(pageChildren);
      })
      .catch((err) => {
        spinner.fail();
        if (err.response) {
          console.info(
            chalk.red.bold(
              `Cannot get Figma file: ${err.response.data.status} ${err.response.data.err}`
            )
          );
        } else {
          console.info(err);
        }
        process.exit(1);
      });
  });
}

function makeRow(key, value) {
  return `${chalk.cyan.bold(key)}\t    ${chalk.green(value)}\t`;
}

function makeResultsTable(colorsObject) {
  const entries = Object.entries(colorsObject)
    .map(([key, values]) => {
      if (typeof values !== "object") {
        return makeRow(key, values);
      }

      return Object.entries(values)
        .map(([subKey, color]) => {
          return makeRow(`${key} - ${subKey}`, color);
        })
        .join(`\n`);
    })
    .join(`\n`);

  ui.div(makeRow(`\n\n` + "Name - Key", "Value") + `\n\n` + entries);

  console.info(ui.toString());
}

function exportColors() {
  getFigmaFile().then((res) => {
    const colorsObject = res.reduce((finalObject, colorGroup) => {
      const groupKey = colorGroup.name.toLowerCase();
      const groupValues = colorGroup.children.reduce((groupObj, child) => {
        const color = child.children.find(
          (childColor) =>
            childColor.type === "TEXT" && childColor.name.startsWith("#")
        )?.name;
        const key = child.children.find(
          (childColor) =>
            childColor.type === "TEXT" && !childColor.name.startsWith("#")
        )?.name;

        /**
         * For nested colors
         */
        if (key) {
          const numericalKey = Number(key);
          groupObj[isNaN(numericalKey) ? key : numericalKey] = color;
          return groupObj;
        }

        /**
         * For not nested colors
         */
        return color;
      }, {});

      finalObject[groupKey] = groupValues;
      return finalObject;
    }, {});

    createOutputDirectory().then(() => {
      deletePreviousFile().then(() => {
        spinner.start("Creating colors file");
        createColorsFile(colorsObject).then(() => {
          makeResultsTable(colorsObject);
          spinner.succeed(chalk.cyan.bold("Export colors done!\n"));
        });
      });
    });
  });
}

function run() {
  updateGitIgnore();
  if (argv.c) {
    deleteConfig();
  }
  getConfig().then(() => {
    figmaClient = figma(config.figmaPersonalToken);
    exportColors();
  });
}

run();
