
const tymlogger = require("tymlogger");

const help = require("./help");
const build = require("./build");
const clean = require("./clean");
const init = require("./init");

function main () {
    const log = new tymlogger();

    switch (process.argv[2]) {
        case "build":
            build();
        break;

        case "init":
            init();
        break;

        case "help":
            help();
        break;

        case "clean":
            clean();
        break;

        case "v":
            console.log(require("../package.json").version);
        break; 

        case "version":
            console.log(require("../package.json").version);
        break;

        default:
            log.error('Unknown command. Run "eliabeth-cli help"');
        break;
    }
}

module.exports.main = main;
