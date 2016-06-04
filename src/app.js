import React, { Component } from 'react'
import TextField from './TextField'
import Identifier from './Identifier'
import styles from './app.css'

function extractWords(text,prefixes) {
  const str = prefixes.map(prefix => "\\b" + prefix + "_\\w+").join("|");
  return text.match(new RegExp(str,"g"));
}

function getIdentifiers(identifiersBySection) {
  const flattenIdentifiers = [].concat.apply([], identifiersBySection);
  return [...new Set(flattenIdentifiers)];
}

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { identifiersBySection: [[],[]] };
  }

  handleUpdate(text,fieldIndex) {
    const identifierPrefixes = ['COMPANY','PROJECT','PERSON','OTHER'];
    const sectionIdentifiers = extractWords(text, identifierPrefixes);
    console.log(sectionIdentifiers);
    const { identifiersBySection } = this.state;
    this.setState({
      identifiersBySection: identifiersBySection.map((identifiers,i) => {
        return (i == fieldIndex) ? 
          ((sectionIdentifiers == null) ? [] : sectionIdentifiers) : 
          identifiers;
      })
    });
  }
  
  render() {
    const identifiers = getIdentifiers(this.state.identifiersBySection);
    const handleUpdate = this.handleUpdate.bind(this);
    return (
      <div className={styles.main}>
        <div className={styles.label}>
          Tell us the title and description of the awesome talk you'd like to give. 
        </div>
        <div className={styles.label}>
          Please self-sanitise these when referring to things stuff as companies, projects and people with generic identifiers, such as COMPANY_A. Stick to the following prefixes: COMPANY, PROJECT, PERSON and OTHER.
        </div>
        <TextField index={0} label='Title' onUpdate={handleUpdate}></TextField>
        <TextField index={1} label='Description' lines='5' onUpdate={handleUpdate}></TextField>
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
            <Identifier key={i} name={identifier} description=''></Identifier>    
          )
        }
      </div>
    );
  }

}
