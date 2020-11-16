describe("Test", function(){
    for(var i = 0; i < 100; i++){
        it("test " + i, () => expect(true).toBe(true));
    }
});

describe("Naming Length", function(){
    let str = "";
    for(var i = 0; i < 99; i++){
        str += "A";
    }

    it("test " + str, () => expect(true).toBe(true));
});

describe("Test 2", function(){
    it("fails", () => expect(true).toBe(false));
});