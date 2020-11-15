module.exports = {
    testEnvironment: "node",
    reporters: [
        "default",
        ["./appveyor2.js", {
            ancestorSeparator: " › "
        }]
    ]
};