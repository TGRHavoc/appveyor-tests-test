// https://github.com/MarkBorcherding/jest-appveyor	

/* eslint-disable @typescript-eslint/no-var-requires */	
/* eslint-disable @typescript-eslint/explicit-function-return-type */	

const http = require("http");
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
        testName: testResult.ancestorTitles.join(ancestorSeparator) + " | " + (testResult.title || "No title"),	
        testFramework: "Jest",	
        fileName: (fileName || "unknown file"),	
        outcome: (testResult.status || "NotFound"),	
        durationMilliseconds: testResult.duration/1000,	
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
        try{
            const results = testResult.testResults.map(toAppveyorTest(test.path, this._options.ancestorSeparator));	

            results.forEach(r => {
                const json = JSON.stringify(r);
                console.log("POSTING: ", json);
                const options = {	
                    method: "POST",	
                    headers: {	
                        "Content-Type": "application/json"
                    }
                };

                const req = http.request(APPVEYOR_API_URL + "api/tests", options);
                req.on("error", (error) => console.error("Unable to post test result", { error }));	
                req.write(json);
                req.end();
            });
        }catch(e){
            console.error("Couldn't send request");
            console.error(e);
        }
    }	
}	
module.exports = AppveyorReporter;	