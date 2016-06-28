import utils from './utils'

function extractIdentifiers(text,prefixes) {
  const str = prefixes.map(prefix => "\\b" + prefix + "_\\w+").join("|");
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

function replaceIdentifiers(texts,currId,newId) {
  return texts.map(text => {
    return text.replace(new RegExp("\\b" + currId + "\\b","g"), newId);
  });
}

function collectIdentifiers(identifiersBySection) {
  const flattenIdentifiers = [].concat.apply([], identifiersBySection);
  return utils.group(flattenIdentifiers, x => x.full).map(x => ({
    full: x.name, 
    type: x.items[0].type,
    name: x.items[0].name,
    startPositions: x.items.map(x => x.positionStart),
    endPositions: x.items.map(x => x.positionEnd),
    count: x.items.length
  }));
}

export default {
  extractIdentifiers: extractIdentifiers,
  replaceIdentifiers: replaceIdentifiers,
  collectIdentifiers: collectIdentifiers
};
