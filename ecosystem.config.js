module.exports = {
    apps: [
        {
            name: "app-name",
            port: 8033,
            script: "./.output/server/index.mjs",
            instance: "max",
            exec_mode: "cluster",
        },
    ],
};
