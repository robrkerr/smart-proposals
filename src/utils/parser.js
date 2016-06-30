import utils from './utils'

function extractIdentifiers(text,prefixes) {
  const str = prefixes.map(prefix => "\\b" + prefix + "_\\w*").join("|");
  const re = new RegExp(str);
  let remainingText = text;
  let match = re.exec(remainingText);
  let identifiers = [];
  while (match) {
    identifiers.push({
      full: match[0],
      type: match[0].split('_')[0], 
      name: match[0].split('_')[1],
      positionStart: match.index,
      positionEnd: match.index + match[0].length - 1
    });
    remainingText = remainingText.slice(match.index + match[0].length);
    match = re.exec(remainingText);
  }
  return identifiers;
}

function replaceIdentifiers(text,currId,newId) {
  return text.replace(new RegExp("\\b" + currId + "\\b","g"), newId);
}

export default {
  extractIdentifiers: extractIdentifiers,
  replaceIdentifiers: replaceIdentifiers
};
