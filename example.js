/**
 * Node has began enforcing http header standards since:
 * https://github.com/nodejs/node/commit/58db386a1be17499a444df6a78743c9dfb3cf
 *
 * Which began rejecting some of the uploads, that previously used to work.
 *
 * This module checks all characters in the upload headers, and removes any
 * invalid ones.
 *
 * More explanation and links to spec can be found here:
 * http://stackoverflow.com/questions/19028068/illegal-characters-in-http-headers
 *
 * The actual logic, however was set to mimic Node native implementation as close as possible,
 * as can be seen in the ./rules module
 */
var rules = require('./rules');

function cleanName(name){

  if(rules.validHeaderName(name)){
    return name;
  } else {
    return rules.cleanHeaderName(name);
  }
}

function cleanValue(value){
  if(rules.validHeaderValue(value)){
    return value;
  } else {
    return rules.cleanHeaderValue(value);
  }
}

function cleanHeaders(headers) {
  var cleanHeaders = {};
  if(!headers) {
    return cleanHeaders;
  }
  Object.keys(headers).forEach(function(name){
    var value = headers[name];
    name = cleanName(name);
    value = cleanValue(value);
    cleanHeaders[name] = value;
  });
  return cleanHeaders;
}


module.exports = exports = cleanHeaders;
