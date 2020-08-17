
const { prompt } = require("enquirer");
const tymlogger = require("tymlogger");
const fs = require("fs");
const path = require("path");

const log = new tymlogger();

let projectJSONTemplate = require("./template/project.template");
const { stringify } = require("querystring");

let GAME_NAME = "";
let EMULATOR_PATH = "";

function InitElizabethProject () {
    let GAME_PATH = path.resolve(process.cwd(), GAME_NAME);

    let PROJECT_JSON_PATH = path.resolve(GAME_PATH, "Project.json");
    let CODE_DIRECTORY = path.resolve(GAME_PATH, "Code");
    let RESOURCES_DIRECTORY = path.resolve(GAME_PATH, "Resources");

    let JOYHANDLER_PATH = path.resolve(GAME_PATH, "Code", "JoyHandler.c");
    let SPLASH_PATH = path.resolve(GAME_PATH, "Resources", "SplashScreen.png");

    let JOYHANDLER_TEMPLATE = path.resolve(__dirname, "template", "joyhandler.template.c");
    let SPLASH_TEMPLATE = path.resolve(__dirname, "template", "splash.template.png");

    log.write("Create Directory...");
    fs.mkdirSync(GAME_PATH);

    log.write("Create Project.json...");

    projectJSONTemplate.name = GAME_NAME;
    projectJSONTemplate.emulator = EMULATOR_PATH;

    const rawData = JSON.stringify(projectJSONTemplate);

    fs.writeFileSync(PROJECT_JSON_PATH, rawData);

    log.write("Create Code/ Directory...");

    fs.mkdirSync(CODE_DIRECTORY);
    
    let codeFile = fs.readFileSync(JOYHANDLER_TEMPLATE);
    fs.writeFileSync(JOYHANDLER_PATH, codeFile);

    log.write("Create Resources/ Directory...");

    fs.mkdirSync(RESOURCES_DIRECTORY);

    let splashFile = fs.readFileSync(SPLASH_TEMPLATE);
    fs.writeFileSync(SPLASH_PATH, splashFile);

    log.success("Done!");
}

module.exports = function () {
    log.success("Elizabeth CLI v" + require("../package.json").version);
    log.write("===========================================");
    log.write("Init new project");

    prompt(
        {
            type: "input",
            name: "gameName",
            message: "Game name"
        }
    ).then(response => {
        GAME_NAME = response.gameName;

        prompt(
            {
                type: "input",
                name: "emulatorpath",
                message: "Emulator path"
            }
        ).then(response => {
            EMULATOR_PATH = response.emulatorpath;

            prompt(
                {
                    type: "confirm",
                    name: "confirmed",
                    message: "Done?"
                }
            ).then(response => {
                if (response.confirmed) {
                    InitElizabethProject();
                } else {
                    log.write("Quit...");
                    process.exit();
                }
            });
        });
    });
}
