
module.exports = {
    name: "",
    emulator: "",
    resources: {
        splash: "SplashScreen.png",
        sprites: [],
        code: [
            {
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
            name: "MainScene",
            joyhandler: "JoyHandler",
            entities: []
        }
    ]
};