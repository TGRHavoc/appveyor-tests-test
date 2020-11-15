describe("Test", function(){
    for(var i = 0; i < 10; i++){
        it("test " + i, () => expect(true).toBe(true));
    }
});

describe("Test 2", function(){
    it("fails", () => expect(true).toBe(false));
});