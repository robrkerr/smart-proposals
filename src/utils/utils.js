
function group(list, func) {
  const f = (func == undefined) ? (x => x) : func;
  let unique = [];
  let groups = [];
  for (let i = 0; i < list.length; i++) {
    const x = f(list[i]);
    if (groups[x] !== undefined) {
      groups[x].push(list[i]);
    } else {
      unique.push(x);
      groups[x] = [list[i]];
    }
  }
  return unique.map(x => ({
    name: x,
    items: groups[x]
  }));
}

function findWithRegex(regex, contentBlock, callback) {
  let text = contentBlock.getText();
  let matchArr, start = 0;
  while ((matchArr = regex.exec(text)) !== null) {
    callback(start + matchArr.index, start + matchArr.index + matchArr[0].length);
    start += matchArr.index + matchArr[0].length;
    text = text.slice(matchArr.index + matchArr[0].length);
  }
}

export default {
  group: group,
  findWithRegex: findWithRegex
};