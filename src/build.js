
const tymlogger = require("tymlogger");
const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const copydir = require("copy-dir");
const { exec } = require("child_process");

const log = new tymlogger();

const makeSourceFile = require("./makesource");
const makeResourcesFile = require("./makeresources");
const Logger = require("tymlogger");

function checkSGDKinstalled (success, error) {
    process.env.GDK && process.env.GDK_WIN ? success() : error();
}

function MakeSGDKProject (project) {
    const BUILD_DIRECTORY = path.resolve(process.cwd(), "Build");
    const SOURCE_FILE = path.resolve(process.cwd(), "Build", "main.c");
    const RESOURCES_DIRECTORY = path.resolve(process.cwd(), "Resources");
    const BUILD_RESOURCES_DIRECTORY = path.resolve(process.cwd(), "Build", "res");
    const RES_FILE = path.resolve(process.cwd(), "Build", "res", "resources.res");

    if (fs.existsSync(BUILD_DIRECTORY)) {
        rimraf.sync(BUILD_DIRECTORY);
    }

    log.write("Create Build/ directory");

    fs.mkdir(BUILD_DIRECTORY, () => null);

    log.write("Generate main.c file...");
    const sourceFile = makeSourceFile(project);

    fs.writeFileSync(SOURCE_FILE, sourceFile);

    log.write("Copy resources...");

    copydir.sync(RESOURCES_DIRECTORY, BUILD_RESOURCES_DIRECTORY);

    log.write("Generate resources.res file...");
    const resourcesFile = makeResourcesFile(project);

    fs.writeFileSync(RES_FILE, resourcesFile);

    CompileProject(project, BUILD_DIRECTORY, "%GDK%/bin/make -f %GDK%/makefile.gen");
}

function CompileProject (project, BUILD_DIRECTORY, BUILD_COMMAND) {
    log.write("Start compiling...");
    log.write("Build Directory: " + BUILD_DIRECTORY);
    log.write("Build command: " + BUILD_COMMAND);

    log.write("Compile...");
    exec(`cd ${BUILD_DIRECTORY} && ${BUILD_COMMAND}`, (err, stdout, stderr) => {
        if (err) {
            log.error("Error: " + err);
        }
        if (stdout) {
            log.success("Compiled Successfully!");
            log.write("Log: " + path.resolve(process.cwd(), "Build.log"));

            if (fs.existsSync(path.resolve(process.cwd(), "Build.log"))) {
                fs.unlinkSync(path.resolve(process.cwd(), "Build.log"));
            }

            fs.writeFileSync(path.resolve(process.cwd(), "Build.log"), stdout + "\n\nSTD ERROR:\n\n" + stderr);
        
            if (project.emulator !== "") {
                log.write("Run emulator...");
                exec(`${project.emulator} ./Build/out/rom.bin`, (err, stdout, stderr) => {
                    process.exit();
                })
            }
        }
    });
}

function SGDKInstalled () {
    const projectFilePath = path.resolve(process.cwd(), "Project.json")

    log.write("Searching Project.json");
    log.write(`File: ${projectFilePath}`);

    try {
        if (fs.existsSync(projectFilePath)) {
            log.success("File founded!");
            log.write("Read Project.json...");
            const rawData = fs.readFileSync(projectFilePath, "utf-8");
            const project = JSON.parse(rawData);

            log.success("Read Project.json successful!");

            log.write("Make SGDK project...");

            MakeSGDKProject(project);
        } else {
            log.error("Project.json not found!");
        }
    } catch (e) {
        log.error("Build Error!");
        log.error("");
        log.error(e);
    }
}

function SGDKNoInstalled () {
    log.error("%GDK_WIN% or %GDK% not found. Please, set in envroiment variables.");
}

module.exports = function build () {
    log.success("Elizabeth CLI v" + require("../package.json").version);
    log.write("===========================================");
    log.write("Start build...");
    checkSGDKinstalled(SGDKInstalled, SGDKNoInstalled);
}
