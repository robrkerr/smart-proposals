import React, { Component } from 'react'
import TextField from './TextField'
import Identifier from './Identifier'
import styles from './app.css'

const identifierPrefixes = ['COMPANY','PROJECT','PERSON','OTHER'];

let fields = [{
  name: 'Title'
}, {
  name: 'Description',
  lines: 5
}];

let initialContexts = {};

const url = window.location.href;
if (url.split('?')[1] == 'test') {
  fields[0]['text'] = 'Doing cool things with Threejs';
  fields[1]['text'] = 'As part of my work for COMPANY_A, I am developing PROJECT_A and we are doing some amazing things with Threejs. Building on what PERSON_A built, we show that it is possible to...';
  initialContexts['COMPANY_A'] = 'Recent startup that will only be familar to a few people.';
  initialContexts['PROJECT_A'] = 'New project that would not have been spoken about in a conference talk.';
  initialContexts['PERSON_A']  = 'Well known and respected Javascript developer.';
}

function extractIdentifiers(text,prefixes) {
  const str = prefixes.map(prefix => "\\b" + prefix + "_\\w+").join("|");
  const matches = text.match(new RegExp(str,"g"));
  return (matches == null) ? [] : matches.map(match => ({
    full: match,
    type: match.split('_')[0], 
    name: match.split('_')[1]
  }));
}

function replaceIdentifiers(texts,currId,newId) {
  return texts.map(text => {
    return text.replace(new RegExp("\\b" + currId + "\\b","g"), newId);
  });
}

function getElementCounts(list, func) {
  const f = (func == undefined) ? (x => x) : func;
  let unique = [];
  let counts = [];
  for (let i = 0; i < list.length; i++) {
    const x = f(list[i]);
    if (counts[x] !== undefined) {
      counts[x] += 1;
    } else {
      unique.push(list[i]);
      counts[x] = 1;
    }
  }
  return unique.map(element => ({
    value: element,
    count: counts[f(element)]
  }));
}

function getIdentifiers(identifiersBySection) {
  const flattenIdentifiers = [].concat.apply([], identifiersBySection);
  return getElementCounts(flattenIdentifiers, x => x.full).map(x => ({
    ...x.value, 
    count: x.count
  }));
}

export default class App extends Component {

  constructor(props) {
    super(props);
    this.handleUpdateField = this.handleUpdateField.bind(this);
    this.handleUpdateAllFields = this.handleUpdateAllFields.bind(this);
    this.handleUpdateIdentifier = this.handleUpdateIdentifier.bind(this);
    this.handleUpdateIdentifierName = this.handleUpdateIdentifierName.bind(this);
    this.state = { 
      identifiersBySection: fields.map(field => []),
      identifiers: [],
      identifierContexts: initialContexts,
      fieldTexts: fields.map(field => field.text || '')
    };
  }

  componentWillMount() {
    this.handleUpdateAllFields(this.state.fieldTexts);
  }

  handleUpdateField(text,fieldIndex) {
    const sectionIdentifiers = extractIdentifiers(text, identifierPrefixes);
    const { identifiersBySection, fieldTexts } = this.state;
    const newIdentifiersBySection = identifiersBySection.map((identifiers,i) => (
      (i == fieldIndex) ? sectionIdentifiers : identifiers
    ));
    const newFieldTexts = fieldTexts.map((fieldText,i) => (
      (i == fieldIndex) ? text : fieldText
    ));
    this.setState({
      identifiersBySection: newIdentifiersBySection,
      identifiers: getIdentifiers(newIdentifiersBySection),
      fieldTexts: newFieldTexts
    });
  }

  handleUpdateAllFields(newFieldTexts) {
    const newIdentifiersBySection = newFieldTexts.map((text,i) => {
      return extractIdentifiers(text, identifierPrefixes);
    });
    this.setState({
      identifiersBySection: newIdentifiersBySection,
      identifiers: getIdentifiers(newIdentifiersBySection),
      fieldTexts: newFieldTexts
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
    const { identifiers, fieldTexts } = this.state;
    const currIdentifier = identifiers[identifierIndex].full;
    const newIdentifier = identifiers[identifierIndex].type + '_' + text;
    const newFieldTexts = replaceIdentifiers(fieldTexts, currIdentifier, newIdentifier);
    this.handleUpdateAllFields(newFieldTexts);
    let newIdentifierContexts = {...this.state.identifierContexts};
    newIdentifierContexts[newIdentifier] = this.state.identifierContexts[currIdentifier];
    this.setState({
      identifierContexts: newIdentifierContexts
    });

  }
  
  render() {
    const { identifiers, identifierContexts, fieldTexts } = this.state;
    const { handleUpdateField, handleUpdateIdentifier, handleUpdateIdentifierName } = this;
    return (
      <div className={styles.main}>
        <div className={styles.label}>
          Tell us the title and description of the awesome talk you'd like to give. 
        </div>
        <div className={styles.label}>
          Please self-sanitise these when referring to things such as companies, projects and people with generic identifiers, such as COMPANY_A. Stick to the following prefixes: COMPANY, PROJECT, PERSON and OTHER.
        </div>
        {
          fields.map((fieldDetails,i) => (
            <TextField key={i} index={i} {...fieldDetails} value={fieldTexts[i]} onUpdate={handleUpdateField}></TextField>
          ))
        }
        {
          identifiers.length > 0 ? (
            <div className={styles.label}>
              Are all the generic identifiers (e.g. companies, projects and people) you used listed here? Give us some context for them:
            </div>
          ) : (
            <div className={styles.label}>
              Not mentioning things like companies, people, or projects? That's cool. But if you meant to, please reread the instructions above. 
            </div>
          )
        }
        {
          identifiers.map((identifier,i) => 
            <Identifier key={i} index={i} {...identifier} description={identifierContexts[identifier.full]} onUpdate={handleUpdateIdentifier} onUpdateName={handleUpdateIdentifierName}></Identifier>    
          )
        }
      </div>
    );
  }

}
