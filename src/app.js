import React, { Component } from 'react'
import TextField from './TextField'
import Identifier from './Identifier'
import styles from './app.css'

const identifierPrefixes = ['COMPANY','PROJECT','PERSON','OTHER'];
const fields = [{
  name: 'Title'
}, {
  name: 'Description',
  lines: 5
}];

function extractWords(text,prefixes) {
  const str = prefixes.map(prefix => "\\b" + prefix + "_\\w+").join("|");
  return text.match(new RegExp(str,"g"));
}

function replaceIdentifiers(texts,currId,newId) {
  return texts.map(text => {
    return text.replace(new RegExp("\\b" + currId + "\\b","g"), newId);
  });
}

function getElementCounts(list) {
  let unique = [];
  let counts = [];
  for (let i = 0; i < list.length; i++) {
    const x = list[i];
    if (counts[x] !== undefined) {
      counts[x] += 1;
    } else {
      unique.push(x);
      counts[x] = 1;
    }
  }
  return unique.map(element => ({
    value: element,
    count: counts[element]
  }));
}

function getIdentifiers(identifiersBySection) {
  const flattenIdentifiers = [].concat.apply([], identifiersBySection);
  return getElementCounts(flattenIdentifiers).map(x => ({
    name: x.value, 
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
      identifierContexts: {},
      fieldTexts: fields.map(field => '')
    };
  }

  handleUpdateField(text,fieldIndex) {
    const sectionIdentifiers = extractWords(text, identifierPrefixes);
    const { identifiersBySection } = this.state;
    const newIdentifiersBySection = identifiersBySection.map((identifiers,i) => {
      return (i == fieldIndex) ? 
        ((sectionIdentifiers == null) ? [] : sectionIdentifiers) : 
        identifiers;
    });
    const newFieldTexts = this.state.fieldTexts.map((fieldText,i) => (
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
      const sectionIdentifiers = extractWords(text, identifierPrefixes);
      return (sectionIdentifiers == null) ? [] : sectionIdentifiers;
    });
    this.setState({
      identifiersBySection: newIdentifiersBySection,
      identifiers: getIdentifiers(newIdentifiersBySection),
      fieldTexts: newFieldTexts
    });
  }

  handleUpdateIdentifier(text,identifierIndex) {
    let newIdentifierContexts = {...this.state.identifierContexts};
    newIdentifierContexts[this.state.identifiers[identifierIndex]] = text;
    this.setState({
      identifierContexts: newIdentifierContexts
    });
  }

  handleUpdateIdentifierName(text,identifierIndex) {
    const { identifiers, fieldTexts } = this.state;
    const currIdentifier = identifiers[identifierIndex].name;
    const newFieldTexts = replaceIdentifiers(fieldTexts, currIdentifier, text);
    this.handleUpdateAllFields(newFieldTexts);
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
          Please self-sanitise these when referring to things stuff as companies, projects and people with generic identifiers, such as COMPANY_A. Stick to the following prefixes: COMPANY, PROJECT, PERSON and OTHER.
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
            <Identifier key={i} index={i} name={identifier.name} description={identifierContexts[identifier.name]} onUpdate={handleUpdateIdentifier} onUpdateName={handleUpdateIdentifierName}></Identifier>    
          )
        }
      </div>
    );
  }

}
