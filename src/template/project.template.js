
const uniqid = require("uniqid");

module.exports = {
    name: "",
    emulator: "",
    resources: {
        splash: "SplashScreen.png",
        sprites: [],
        code: [
            {
                id: uniqid(),
                name: "JoyHandler",
                path: "JoyHandler.c",
                type: "joyhandler"
            }
        ]
    },
    variables: {},
    mainScene: "MainScene",
    scenes: [
        {
            id: uniqid(),
            name: "MainScene",
            background: "000000",
            joyhandler: "JoyHandler",
            entities: []
        }
    ]
};
