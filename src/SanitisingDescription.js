import React, { Component } from 'react'
import TextField from './TextField'
import Identifier from './Identifier'
import {CompositeDecorator, EditorState, ContentState} from 'draft-js'

const contentBlockDelimiter = '\n';
const identifierPrefixes = ['COMPANY','PROJECT','PERSON','OTHER'];

function findWithRegex(regex, contentBlock, callback) {
  let text = contentBlock.getText();
  let matchArr, start = 0;
  while ((matchArr = regex.exec(text)) !== null) {
    callback(start + matchArr.index, start + matchArr.index + matchArr[0].length);
    start += matchArr.index + matchArr[0].length;
    text = text.slice(matchArr.index + matchArr[0].length);
  }
}

function updateDecorations(editorState,identifiers) {
  const newCompositeDecorator = new CompositeDecorator(identifiers.map((identifier,i) => {
    const re = new RegExp("\\b" + identifier.full + "\\b");
    const className = "underline underline-" + (i % 6);
    return {
      strategy: (contentBlock, callback) => findWithRegex(re, contentBlock, callback),
      component: (props) => <span {...props} className={className}>{props.children}</span>,
    }
  }));
  return EditorState.set(editorState, {decorator: newCompositeDecorator});
}

let fields = [{
  label: 'Description',
  lines: 5
}];

let initialContexts = {};

const url = window.location.href;
if (url.split('?')[1] == 'test') {
  // fields[0]['text'] = 'Doing cool things with Threejs';
  fields[0]['text'] = 'As part of my work for COMPANY_A, I am developing PROJECT_A and we are doing some amazing things with Threejs. Building on what PERSON_A built, we show that it is possible to...';
  initialContexts['COMPANY_A'] = 'Recent startup that will only be familar to a few people.';
  initialContexts['PROJECT_A'] = 'New project that would not have been spoken about in a conference talk.';
  initialContexts['PERSON_A']  = 'Well known and respected Javascript developer.';
}

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

function getIdentifiers(identifiersBySection) {
  const flattenIdentifiers = [].concat.apply([], identifiersBySection);
  return group(flattenIdentifiers, x => x.full).map(x => ({
    full: x.name, 
    type: x.items[0].type,
    name: x.items[0].name,
    startPositions: x.items.map(x => x.positionStart),
    endPositions: x.items.map(x => x.positionEnd),
    count: x.items.length
  }));
}

export default class SanitisingDescription extends Component {

  constructor(props) {
    super(props);
    this.handleUpdateField = this.handleUpdateField.bind(this);
    this.handleUpdateAllFields = this.handleUpdateAllFields.bind(this);
    this.handleUpdateIdentifier = this.handleUpdateIdentifier.bind(this);
    this.handleUpdateIdentifierName = this.handleUpdateIdentifierName.bind(this);
    const initialFieldStates = fields.map(field => {
      if (field.text) {
        const contentState = ContentState.createFromText(field.text,contentBlockDelimiter);
        return EditorState.createWithContent(contentState);

      } else {
        return EditorState.createEmpty();
      }
    });
    this.state = { 
      identifiersBySection: fields.map(field => []),
      identifiers: [],
      identifierContexts: initialContexts,
      fieldStates: initialFieldStates
    };
  }

  componentWillMount() {
    this.handleUpdateAllFields(this.state.fieldStates);
  }

  handleUpdateField(newFieldState,fieldIndex) {
    const text = newFieldState.getCurrentContent().getPlainText(contentBlockDelimiter);
    const sectionIdentifiers = extractIdentifiers(text, identifierPrefixes);
    const { identifiersBySection, fieldTexts } = this.state;
    const newIdentifiersBySection = identifiersBySection.map((identifiers,i) => (
      (i == fieldIndex) ? sectionIdentifiers : identifiers
    ));
    const newIdentifiers = getIdentifiers(newIdentifiersBySection);
    const oldIdentifiers = this.state.identifiers;
    let newIdentifierContexts = {...this.state.identifierContexts};
    if (newIdentifiers.length == oldIdentifiers.length) {
      for (let i = 0; i < newIdentifiers.length; i++) {
        if (newIdentifiers[i].full != oldIdentifiers[i].full) {
          if (newIdentifiers[i].type == oldIdentifiers[i].type) {
            if (newIdentifiers[i].count == 1) {
              // we just modified the name of an identifier  
              const text = newIdentifierContexts[oldIdentifiers[i].full];
              if (!newIdentifierContexts[newIdentifiers[i].full]) {
                newIdentifierContexts[newIdentifiers[i].full] = text;  
              }
            }
          }
        }
      }
    }
    const newFieldStates = this.state.fieldStates.map((state,i) => (
      (i == fieldIndex) ? newFieldState : state
    ));
    this.setState({
      identifiersBySection: newIdentifiersBySection,
      identifiers: newIdentifiers,
      identifierContexts: newIdentifierContexts,
      fieldStates: newFieldStates
    });
    requestAnimationFrame(() => {
      this.setState({
        fieldStates: newFieldStates.map(state => updateDecorations(state,newIdentifiers))
      });
    });
  }

  handleUpdateAllFields(newFieldStates) {
    const newFieldTexts = newFieldStates.map(state => {
      return state.getCurrentContent().getPlainText(' ');
    });
    const newIdentifiersBySection = newFieldTexts.map((text,i) => {
      return extractIdentifiers(text, identifierPrefixes);
    });
    const newIdentifiers = getIdentifiers(newIdentifiersBySection);
    this.setState({
      identifiersBySection: newIdentifiersBySection,
      identifiers: newIdentifiers,
      fieldStates: newFieldStates.map(state => updateDecorations(state,newIdentifiers))
    });
  }

  handleUpdateIdentifier(text,identifierIndex) {
    let newIdentifierContexts = {...this.state.identifierContexts};
    newIdentifierContexts[this.state.identifiers[identifierIndex].full] = text;
    this.setState({
      identifierContexts: newIdentifierContexts
    });
  }

  handleUpdateIdentifierName(text,identifierIndex) {
    const { identifiers, fieldStates } = this.state;
    const currIdentifier = identifiers[identifierIndex].full;
    const newIdentifier = identifiers[identifierIndex].type + '_' + text;
    const fieldTexts = fieldStates.map(state => (
      state.getCurrentContent().getPlainText(' ')
    ));
    const newFieldTexts = replaceIdentifiers(fieldTexts, currIdentifier, newIdentifier);
    const newFieldStates = newFieldTexts.map(text => {
      return EditorState.createWithContent(ContentState.createFromText(text, contentBlockDelimiter));
    });
    this.handleUpdateAllFields(newFieldStates);
    let newIdentifierContexts = {...this.state.identifierContexts};
    newIdentifierContexts[newIdentifier] = this.state.identifierContexts[currIdentifier];
    this.setState({
      identifierContexts: newIdentifierContexts
    });
  }
  
  render() {
    const { identifiers, identifierContexts, fieldStates } = this.state;
    const { handleUpdateField, handleUpdateIdentifier, handleUpdateIdentifierName } = this;
    return (
      <div>
        <TextField index={0} {...fields[0]} state={fieldStates[0]} onUpdate={handleUpdateField}></TextField>
        {
          identifiers.map((identifier,i) => 
            <Identifier key={i} index={i} {...identifier} description={identifierContexts[identifier.full]} onUpdate={handleUpdateIdentifier} onUpdateName={handleUpdateIdentifierName}></Identifier>    
          )
        }
      </div>
    );
  }

}
