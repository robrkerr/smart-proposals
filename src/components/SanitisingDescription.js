import React, { Component } from 'react'
import TextArea from './TextArea'
import Identifier from './Identifier'
import {CompositeDecorator, EditorState, ContentState} from 'draft-js'
import parser from '../utils/parser'
import utils from '../utils/utils'

const contentBlockDelimiter = '\n';
const identifierPrefixes = ['COMPANY','PROJECT','PERSON','OTHER'];

let fields = [{
  label: 'Description',
  lines: 5
}];

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
    const { name, form } = props;
    form.data[name] = { 
      identifiersBySection: fields.map(field => []),
      identifiers: [],
      identifierDetails: {},
      fieldStates: fields.map(field => EditorState.createEmpty())
    };
    this.getMyState = (myProps) => myProps.form.data[myProps.name];
    this.setMyState = (myProps,value) => {
      myProps.form.data[myProps.name] = {...myProps.form.data[myProps.name],...value};
      this.forceUpdate();
    }
  }

  handleUpdateField(newFieldState,fieldIndex) {
    const text = newFieldState.getCurrentContent().getPlainText(contentBlockDelimiter);
    const sectionIdentifiers = parser.extractIdentifiers(text, identifierPrefixes);
    const { identifiersBySection, fieldTexts } = this.getMyState(this.props);
    const newIdentifiersBySection = identifiersBySection.map((identifiers,i) => (
      (i == fieldIndex) ? sectionIdentifiers : identifiers
    ));
    const newIdentifiers = parser.collectIdentifiers(newIdentifiersBySection);
    const oldIdentifiers = this.getMyState(this.props).identifiers;
    let newIdentifierDetails = {...this.getMyState(this.props).identifierDetails};
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
    const newFieldStates = this.getMyState(this.props).fieldStates.map((state,i) => (
      (i == fieldIndex) ? newFieldState : state
    ));
    this.setMyState(this.props, {
      identifiersBySection: newIdentifiersBySection,
      identifiers: newIdentifiers,
      identifierDetails: newIdentifierDetails,
      fieldStates: newFieldStates
    });
    requestAnimationFrame(() => {
      this.setMyState(this.props, {
        identifiersBySection: newIdentifiersBySection,
        identifiers: newIdentifiers,
        identifierDetails: newIdentifierDetails,
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
    this.setMyState(this.props, {
      identifiersBySection: newIdentifiersBySection,
      identifiers: newIdentifiers,
      fieldStates: newFieldStates.map(state => updateDecorations(state,newIdentifiers))
    });
  }

  handleUpdateIdentifierName(text,identifierIndex) {
    const { identifiers, fieldStates } = this.getMyState(this.props);
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
    let newIdentifierDetails = {...this.getMyState(this.props).identifierDetails};
    newIdentifierDetails[newIdentifier] = this.getMyState(this.props).identifierDetails[currIdentifier];
    this.setMyState(this.props, {
      identifierDetails: newIdentifierDetails
    });
  }

  handleUpdateIdentifierContext(text,identifierIndex) {
    let newIdentifierDetails = {...this.getMyState(this.props).identifierDetails};
    const identifier = this.getMyState(this.props).identifiers[identifierIndex].full;
    newIdentifierDetails[identifier] = {...newIdentifierDetails[identifier], 
      context: text
    };
    this.setMyState(this.props, {
      identifierDetails: newIdentifierDetails
    });
  }

  handleUpdateIdentifierRedacted(text,identifierIndex) {
    let newIdentifierDetails = {...this.getMyState(this.props).identifierDetails};
    const identifier = this.getMyState(this.props).identifiers[identifierIndex].full;
    newIdentifierDetails[identifier] = {...newIdentifierDetails[identifier], 
      redacted: text
    };
    this.setMyState(this.props, {
      identifierDetails: newIdentifierDetails
    });
  }
  
  render() {
    const { identifiers, identifierDetails, fieldStates } = this.getMyState(this.props);
    const { handleUpdateField, handleUpdateIdentifierContext, handleUpdateIdentifierRedacted, handleUpdateIdentifierName } = this;
    return (
      <div>
        <TextArea index={0} {...fields[0]} state={fieldStates[0]} onUpdate={handleUpdateField}></TextArea>
        {
          identifiers.map((identifier,i) => 
            <Identifier key={i} index={i} {...identifier} details={identifierDetails[identifier.full]} onUpdateContext={handleUpdateIdentifierContext} onUpdateName={handleUpdateIdentifierName} onUpdateRedacted={handleUpdateIdentifierRedacted}></Identifier>    
          )
        }
      </div>
    );
  }

}
