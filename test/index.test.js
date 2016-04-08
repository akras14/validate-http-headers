var expect = require("chai").expect;
var Lab = require("lab");
var lab = exports.lab = Lab.script();

var cleanHeaders = require("../");

var invalidHeaders = {
  "some(name": "жsome value",
  "some other name": "some other valueж"
};

lab.describe('cleanHeaders', ()=>{

  lab.it('should remove invalid characters', done=>{
    var clean = cleanHeaders(invalidHeaders);
    expect(clean["somename"]).to.equal("some value");
    expect(clean["someothername"]).to.equal("some other value");
    done();
  });

});
