var expect = require("chai").expect;
var Lab = require("lab");
var lab = exports.lab = Lab.script();

var rules = require("../");

lab.describe('rules', ()=>{

  var validHeaderName = [
    'some^string',
    'some_string',
    'some`string',
    'some|string',
    'some0string',
    'some-string'
  ];
  var invalidHeaderName = [
    '',
    null,
    'some"string',
    'some(string',
    'some)string',
    'some string',
    ')somestring',
    'somestring(',
    'SomeString(',
    'Some^(String',
    'Some_(String',
    'Some`(String',
    'Some|(String',
    'Some0(String',
    'Some-(String',
    'Some (String'
  ];

  var validHeaderValue = [
    'some^string',
    'some_string',
    'some`string',
    'some|string',
    'some0string',
    'some-string',
    'some string',
    String.fromCharCode(9) + "some string"
  ];

  var invalidHeaderValue = [
    "железо", //Russian
    "железо" + String.fromCharCode(9), //Russian invalid but 9 is valid
    "some string" + String.fromCharCode(30)
  ];


  lab.it("should return true if rules.validHeaderName is called with VALID header name", done => {
    validHeaderName.forEach(name => {
      expect(rules.validHeaderName(name)).to.equal(true);
    });
    done();
  });

  lab.it("should return false if rules.validHeaderName is called with INVALID header name", done => {
    invalidHeaderName.forEach(name => {
      expect(rules.validHeaderName(name)).to.equal(false);
    });
    done();
  });

  lab.it("should remove invalid chars from INVALID header name", done => {
    invalidHeaderName.forEach(name => {
      if(!name){
        expect(()=>rules.cleanHeaderName(name)).to.throw("cleanHeaderName is called without a header name");
      } else {
        expect(rules.validHeaderName(name)).to.equal(false);
        var cleanName = rules.cleanHeaderName(name);
        expect(rules.validHeaderName(cleanName)).to.equal(true);
      }
    });
    done();
  });

  lab.it("should return true if rules.validHeaderValue is called with VALID header value", done => {
    validHeaderValue.forEach(value => {
      expect(rules.validHeaderValue(value)).to.equal(true);
    });
    done();
  });

  lab.it("should return false if rules.validHeaderValue is called with INVALID header value", done => {
    invalidHeaderValue.forEach(value => {
      expect(rules.validHeaderValue(value)).to.equal(false);
    });
    done();
  });

  lab.it("should remove invalid chars from INVALID header value", done => {
    invalidHeaderValue.forEach(value => {
      if(!value){
        expect(()=>rules.cleanHeaderValue(value)).to.throw("cleanHeadervalue is called without a header value");
      } else {
        expect(rules.validHeaderValue(value)).to.equal(false);
        var cleanValue = rules.cleanHeaderValue(value);
        expect(rules.validHeaderValue(cleanValue)).to.equal(true);
      }
    });
    done();
  });

});
