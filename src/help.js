
const tymlogger = require("tymlogger");

function help () {
    const log = new tymlogger();

    log.write("");
    log.success(" Elizabeth CLI v" + require("../package.json").version);
    log.write("");
    log.write("  Run: elizabeth-cli [COMMAND]");
    log.write("");
    log.write(" Commands:");
    log.write("");
    log.write(" init - Init new Elizabeth project.");
    log.write(" build - Build Elizabeth project.");
    log.write(" clean - clean Build directory and log.");
    log.write(" v, version - get CLI version.");
    log.write(" help - get CLI help information.");
    log.write("");
}

module.exports = help;
