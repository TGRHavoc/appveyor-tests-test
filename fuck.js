module.exports = {
    testEnvironment: "node",
    reporters: [
        "default",
        ["./appveyor.js", {
            ancestorSeparator: " › "
        }]
    ]
};