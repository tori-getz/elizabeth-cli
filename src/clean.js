
const rimraf = require("rimraf");
const path = require("path");
const fs = require("fs");
const tymlogger = require("tymlogger");

const log = new tymlogger();

const BUILD_DIRECTORY = path.resolve(process.cwd(), "Build");
const BUILD_LOG = path.resolve(process.cwd(), "Build.log");
const PROJECT_FILE = path.resolve(process.cwd(), "Project.json");

module.exports = function () {
    if (fs.existsSync(PROJECT_FILE)) {
        log.write("Clean...");
    
        rimraf.sync(BUILD_DIRECTORY);
        rimraf.sync(BUILD_LOG);
    } else {
        log.error("No Elizabeth project!");
    }
}
