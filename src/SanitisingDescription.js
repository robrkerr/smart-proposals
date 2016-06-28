import React, { Component } from 'react'
import TextField from './TextField'
import Identifier from './Identifier'
import {CompositeDecorator, EditorState, ContentState} from 'draft-js'
import parser from './parser'
import utils from './utils'

const contentBlockDelimiter = '\n';
const identifierPrefixes = ['COMPANY','PROJECT','PERSON','OTHER'];

let fields = [{
  label: 'Description',
  lines: 5
}];

let initialDetails = {};

const url = window.location.href;
if (url.split('?')[1] == 'test') {
  fields[0]['text'] = 'As part of my work for COMPANY_A, I am developing PROJECT_A and we are doing some amazing things with Threejs. Building on what PERSON_A built, we show that it is possible to...';
  initialDetails['COMPANY_A'] = {
    context: 'Recent startup that will only be familar to a few people.',
    redacted: 'Uber'
  };
  initialDetails['PROJECT_A'] = {
    context: 'New project that would not have been spoken about in a conference talk.',
    redacted: 'Uber Eats'
  };
  initialDetails['PERSON_A']  = {
    context: 'Well known and respected Javascript developer.',
    redacted: 'Smithy'
  };
}

function updateDecorations(editorState,identifiers) {
  const newCompositeDecorator = new CompositeDecorator(identifiers.map((identifier,i) => {
    const re = new RegExp("\\b" + identifier.full + "\\b");
    const className = "underline underline-" + (i % 6);
    return {
      strategy: (contentBlock, callback) => utils.findWithRegex(re, contentBlock, callback),
      component: (props) => <span {...props} className={className}>{props.children}</span>,
    }
  }));
  return EditorState.set(editorState, {decorator: newCompositeDecorator});
}

export default class SanitisingDescription extends Component {

  constructor(props) {
    super(props);
    this.handleUpdateField = this.handleUpdateField.bind(this);
    this.handleUpdateAllFields = this.handleUpdateAllFields.bind(this);
    this.handleUpdateIdentifierContext = this.handleUpdateIdentifierContext.bind(this);
    this.handleUpdateIdentifierRedacted = this.handleUpdateIdentifierRedacted.bind(this);
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
      identifierDetails: initialDetails,
      fieldStates: initialFieldStates
    };
  }

  componentWillMount() {
    this.handleUpdateAllFields(this.state.fieldStates);
  }

  handleUpdateField(newFieldState,fieldIndex) {
    const text = newFieldState.getCurrentContent().getPlainText(contentBlockDelimiter);
    const sectionIdentifiers = parser.extractIdentifiers(text, identifierPrefixes);
    const { identifiersBySection, fieldTexts } = this.state;
    const newIdentifiersBySection = identifiersBySection.map((identifiers,i) => (
      (i == fieldIndex) ? sectionIdentifiers : identifiers
    ));
    const newIdentifiers = parser.collectIdentifiers(newIdentifiersBySection);
    const oldIdentifiers = this.state.identifiers;
    let newIdentifierDetails = {...this.state.identifierDetails};
    if (newIdentifiers.length == oldIdentifiers.length) {
      for (let i = 0; i < newIdentifiers.length; i++) {
        if (newIdentifiers[i].full != oldIdentifiers[i].full) {
          if (newIdentifiers[i].type == oldIdentifiers[i].type) {
            if (newIdentifiers[i].count == 1) {
              // we just modified the name of an identifier  
              const text = newIdentifierDetails[oldIdentifiers[i].full];
              if (!newIdentifierDetails[newIdentifiers[i].full]) {
                newIdentifierDetails[newIdentifiers[i].full] = text;  
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
      identifierDetails: newIdentifierDetails,
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
      return parser.extractIdentifiers(text, identifierPrefixes);
    });
    const newIdentifiers = parser.collectIdentifiers(newIdentifiersBySection);
    this.setState({
      identifiersBySection: newIdentifiersBySection,
      identifiers: newIdentifiers,
      fieldStates: newFieldStates.map(state => updateDecorations(state,newIdentifiers))
    });
  }

  handleUpdateIdentifierName(text,identifierIndex) {
    const { identifiers, fieldStates } = this.state;
    const currIdentifier = identifiers[identifierIndex].full;
    const newIdentifier = identifiers[identifierIndex].type + '_' + text;
    const fieldTexts = fieldStates.map(state => (
      state.getCurrentContent().getPlainText(' ')
    ));
    const newFieldTexts = parser.replaceIdentifiers(fieldTexts, currIdentifier, newIdentifier);
    const newFieldStates = newFieldTexts.map(text => {
      return EditorState.createWithContent(ContentState.createFromText(text, contentBlockDelimiter));
    });
    this.handleUpdateAllFields(newFieldStates);
    let newIdentifierDetails = {...this.state.identifierDetails};
    newIdentifierDetails[newIdentifier] = this.state.identifierDetails[currIdentifier];
    this.setState({
      identifierDetails: newIdentifierDetails
    });
  }

  handleUpdateIdentifierContext(text,identifierIndex) {
    let newIdentifierDetails = {...this.state.identifierDetails};
    newIdentifierDetails[this.state.identifiers[identifierIndex].full].context = text;
    this.setState({
      identifierDetails: newIdentifierDetails
    });
  }

  handleUpdateIdentifierRedacted(text,identifierIndex) {
    let newIdentifierDetails = {...this.state.identifierDetails};
    newIdentifierDetails[this.state.identifiers[identifierIndex].full].redacted = text;
    this.setState({
      identifierDetails: newIdentifierDetails
    });
  }
  
  render() {
    const { identifiers, identifierDetails, fieldStates } = this.state;
    const { handleUpdateField, handleUpdateIdentifierContext, handleUpdateIdentifierRedacted, handleUpdateIdentifierName } = this;
    return (
      <div>
        <TextField index={0} {...fields[0]} state={fieldStates[0]} onUpdate={handleUpdateField}></TextField>
        {
          identifiers.map((identifier,i) => 
            <Identifier key={i} index={i} {...identifier} details={identifierDetails[identifier.full]} onUpdateContext={handleUpdateIdentifierContext} onUpdateName={handleUpdateIdentifierName} onUpdateRedacted={handleUpdateIdentifierRedacted}></Identifier>    
          )
        }
      </div>
    );
  }

}
