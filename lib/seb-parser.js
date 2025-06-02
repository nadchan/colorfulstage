const FixedJson = require("./json-repair.min").jsonrepair

function seb_parser(sebxmlstring) {
  if(typeof sebxmlstring !== "string") {
    return { error: "Can't parse xml string!" }
  }
  const removeUnusageAtrib = String(sebxmlstring)
    .split("<plist")[1]
    ?.replace(/<\?xml.*?\?>/g, '')    // Remove XML
    .replace(/<!DOCTYPE.*?>/g, '')   // Remove Doctype
    .replace(/<plist.*?>/g, '')      // Remove Plist On iOS
    .replace(/<plist>/g, '')         // Remove Plist On iOS
    .replace(/<\/plist>/g, '')       // Remove Plist On iOS
    .replace(/<plist>/g, '')         // Remove Plist On iOS
    .replace(/<!--[\s\S]*?-->/g, '') // Remove Comment XML
    .replace(/<!-- -->/g, '')        // Remove Comment XML
    .replace(/\s+/g, ' ')            // Remove Spaces & Attribute More
    .trim()
    .split("<dict>").slice(1).join("<dict>")
  
  const parserToJson = String("<dict>"+removeUnusageAtrib)
    .replace(/<dict>/g, '{')                      // Open Object
    .replace(/<\/dict>/g, '},')                   // Close Object
    .replace(/<array>/g, '[')                     // Open Array
    .replace(/<\/array>/g, '],')                  // Close array
    .replace(/<key>(.*?)<\/key>/g, '"$1":')       // To key object
    // ------ Components
    .replace(/<string>(.*?)<\/string>/g, '"$1",') // To string value
    .replace(/<string \/>/g, '"",') // To string value
    .replace(/<integer>(.*?)<\/integer>/g, '$1,') // To number parseInt
    .replace(/<real>(.*?)<\/real>/g, '$1,')       // To floating point
    .replace(/<true\s*\/>/g, 'true,')             // To true
    .replace(/<false\s*\/>/g, 'false,')           // To false
    .replace(/<date>(.*?)<\/date>/g, '"$1",')     // To string ISO 8601
    .replace(/<data>(.*?)<\/data>/g, '"$1",')     // To string base64
  return {
    xml: removeUnusageAtrib,
    // json: parserToJson,
    json: JSON.parse(FixedJson(parserToJson))
  }
}

module.exports = seb_parser