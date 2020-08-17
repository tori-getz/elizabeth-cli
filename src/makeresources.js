
const imageSize = require("image-size");
const path = require("path");

function spritesGenerate (sprites) {
    let code = "";

    for (let sprite of sprites) {
        const dimensions = imageSize(path.resolve(process.cwd(), "Build", "res", sprite.path));

        code += `SPRITE ${sprite.name} ${sprite.path} ${dimensions.width / 8} ${dimensions.height / 8} FAST 1\n`;
    }

    return code;
}

module.exports = function (project) {
    return `
SPRITE SplashScreen ${project.resources.splash} 16 8 FAST 1

${spritesGenerate(project.resources.sprites)}
    `;
}
