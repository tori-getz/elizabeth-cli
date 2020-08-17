
const path = require("path");
const fs = require("fs");

let mainSceneIndex = "NONE";

function userSpritesVariables(sprites) {
    let code = '';

    for (let sprite of sprites) {
        code += `Sprite* ${sprite.name}_SPRITE;\n`;
    }

    return code;
}

function userScenesVariables (scenes, mainScene) {
    let code = ""; 

    for (let i = 0; i < scenes.length; i++) {
        if (scenes[i].name === mainScene) {
            mainSceneIndex = i;
        }

        code += `int ${scenes[i].name} = ${i};\n`;
    }

    return code;
}

function userScenesLoad (scenes) {
    let code = "";

    for (let i = 0; i < scenes.length; i++) {
        code += `
    // ${scenes[i].name}
    if (activeScene == ${i}) {
        ${scenes[i].name}_SCENE();
    }

        `;
    }

    return code;
}

function userScenesMethods (project) {
    const CODE_DIRECTORY = path.resolve(process.cwd(), "Code")
    let code = '';
    let entities = [];

    let entitIesInit = function () {
        let entitiesCode = "";

        for (let entitiy of entities) {
            entitiesCode += `${entitiy.name}_INIT(); `;
        }

        return entitiesCode;
    }

    let entitiesRun = function () {
        let entitiesCode = "";
        for (let entitie of entities) {
            entitiesCode += `${entitie.name}_ENTITY(); `
        }
        return entitiesCode;
    }

    code += "// ###### ENTITY VARIABLES ###### //\n\n"
    for (let scene of project.scenes) {
        for (let entity of scene.entities) {
            code += `
int ${entity.name}_Velocity_X = 0;
int ${entity.name}_Velocity_Y = 0;
int ${entity.name}_X = ${entity.pos.x};
int ${entity.name}_Y = ${entity.pos.y};
            `;
        }
    }
    code += "\n// ###### ENTITY VARIABLES END ###### //\n\n"

    code += "// ###### USER CODE ###### //\n"
    
    for (let codeResource of project.resources.code) {
        let codeFile = fs.readFileSync(path.resolve(CODE_DIRECTORY, codeResource.path), 'utf-8');
        
        if (codeResource.type === "code") {
            code += `
void ${codeResource.name}_CODE () {
    ${codeFile}
}
                    `;
        }

        if (codeResource.type === "joyhandler") {
            code += `
void ${codeResource.name}_JOYHANDLER (u16 joy, u16 changed, u16 state) {
    ${codeFile}
}
                    `;
        }
    }

    code += "\n// ###### USER CODE END ###### //\n\n"

    for (let scene of project.scenes) {
        code += `// # ${scene.name} entities # //\n\n`;

        for (let entitie of scene.entities) {
            entities.push(entitie);

            code += `

void ${entitie.name}_INIT () {
    ${entitie.sprite}_SPRITE = SPR_addSprite(&${entitie.sprite}, ${entitie.name}_X, ${entitie.name}_Y, TILE_ATTR(PAL${entitie.pal}, TRUE, FALSE, FALSE));
}

void ${entitie.name}_ENTITY () {
    ${entitie.code}_CODE();
    SPR_setPosition(${entitie.name}_SPRITE, ${entitie.name}_X + ${entitie.name}_Velocity_X, ${entitie.name}_Y + ${entitie.name}_Velocity_Y);
}
            `;
        }

        code += `\n\n// # ${scene.name} entities end # //`;
        
        code += `

void ${scene.name}_SCENE () {
    VDP_setPaletteColor(63, RGB24_TO_VDPCOLOR(0x${scene.background}));
    VDP_setBackgroundColor(63);

    JOY_init();
    JOY_setEventHandler(&${scene.joyhandler}_JOYHANDLER);

    SPR_init(0, 0, 0);

    ${entitIesInit()}

    while (TRUE) {
        ${entitiesRun()}

        SPR_update();
        VDP_waitVSync();
    }
}
        `;
    }

    return code;
}

function userVariables (variables) {
    let code = "";

    for (let variable of variables) {
        if (variable.type === "string") {
            code += `char ${variable.key}_VARIABLE[] = "${variable.value}";\n`
        }
        
        if (variable.type === "int") {
            code += `int ${variable.key}_VARIABLE = ${variable.value};\n`; 
        }

        if (variable.type === "bool") {
            code += `bool ${variable.key}_VARIABLE = ${variable.value ? "TRUE" : "FALSE"};\n`;
        }
    }

    return code;
}

module.exports = function (project) {
    return `

// BUILD WITH ELIZABETH CLI V${require("../package.json").version}

#include <genesis.h>
#include <resources.h>

// SCREEN RESOLUTION
const int SCREEN_WIDTH = 320;
const int SCREEN_HEIGHT = 240;

Sprite* SplashScreen_SPRITE; // Splash Screen Sprite

// ### USER VARIABLES ### //

${userVariables(project.variables)}

// ### USER VARIABLES END ### //

// ### USER SPRITES ### //

${userSpritesVariables(project.resources.sprites)}

// ### USER SPRITES END ### //

// ### USER SCENES INDEXES ### //

${userScenesVariables(project.scenes, project.mainScene)}

// ### USER SCENES INDEXES END ### //

// ### USER SCENES ### //

${userScenesMethods(project)}

// ### USERS SCENES END ### //

int MAINSCENE = ${mainSceneIndex};

int activeScene = 1001;

void SplashScreen_START () {
    SPR_init(0, 0, 0);
    VDP_setPalette(PAL1, SplashScreen.palette->data);
    SplashScreen_SPRITE = SPR_addSprite(&SplashScreen, 96, 60, TILE_ATTR(PAL1, TRUE, FALSE, FALSE));
    SPR_update();
    waitTick(500);
    SetScene(MAINSCENE);
}

void SetScene (int sceneIndex) {
    activeScene = sceneIndex;
    VDP_init(); 
    main();
}

int main () {
    // Splash Screen
    if (activeScene == 1001) {
        SplashScreen_START();
    }

    ${userScenesLoad(project.scenes)}

    return(0);
}

    `;
}
