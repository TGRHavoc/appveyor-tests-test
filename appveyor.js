// Based off https://github.com/MarkBorcherding/jest-appveyor

const axios = require("axios");
const stripAnsi = require("strip-ansi");

const APPVEYOR_API_URL = process.env.APPVEYOR_API_URL;
const ADD_TESTS_IN_BATCH = "api/tests/batch";

const isError = (r) => (r.failureMessages && r.failureMessages.length > 0);
const errorDetails = (testResult) => {
    if (!isError(testResult)) {
        return;
    }
    const [message, ...stack] = testResult.failureMessages[0].split("\n");
    return [message, stack.join("\n")];
};

const toAppveyorTest = (fileName, ancestorSeparator) => (testResult) => {
    const [errorMessage, errorStack] = errorDetails(testResult) || [undefined, undefined];
    return {
        testName: testResult.ancestorTitles.join(ancestorSeparator) + " | " + testResult.title,
        testFramework: "Jest",
        fileName: fileName,
        outcome: testResult.status,
        durationMilliseconds: testResult.duration,
        ErrorMessage: stripAnsi(errorMessage),
        ErrorStackTrace: stripAnsi(errorStack),
        StdOut: "",
        StdErr: ""
    };
};


class AppveyorReporter {
    constructor(globalConfig, options) {
        this._globalConfig = globalConfig;
        this._options = options;

        if(!this._options.ancestorSeparator){
            this._options.ancestorSeparator = ",";
        }
    }
    onTestResult(test, testResult) {
        if (!APPVEYOR_API_URL) {
            return;
        }
        const results = testResult.testResults.map(toAppveyorTest(testResult.testFilePath, this._options.ancestorSeparator || " "));
        const json = JSON.stringify(results);
        
        axios.post(APPVEYOR_API_URL +  ADD_TESTS_IN_BATCH, json)
            .then((res) => {
                console.log("Done!: ");
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
            });
    }
}
module.exports = AppveyorReporter;	