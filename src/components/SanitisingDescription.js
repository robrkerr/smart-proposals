import React, { Component } from 'react'
import TextArea from './TextArea'
import Identifier from './Identifier'
import {CompositeDecorator, EditorState, ContentState} from 'draft-js'
import parser from '../utils/parser'
import utils from '../utils/utils'

const contentBlockDelimiter = '\n';
const identifierPrefixes = ['COMPANY','PROJECT','PERSON','OTHER'];

function haveIdentifiersChanged(oldList,newList) {
  if (oldList.length != newList.length) return true;
  for (var i in oldList) { if (oldList[i].full != newList[i].full) { return true; }}
  return false;
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
    this.handleUpdateIdentifierContext = this.handleUpdateIdentifierContext.bind(this);
    this.handleUpdateIdentifierRedacted = this.handleUpdateIdentifierRedacted.bind(this);
    this.handleUpdateIdentifierName = this.handleUpdateIdentifierName.bind(this);
    this.state = { 
      identifiers: [],
      identifierDetails: {},
      fieldState: EditorState.createEmpty()
    };
    props.form.data[props.name] = { 
      text: '',
      context: {},
      redactions: {}
    };
    this.setFormText = (myProps,text) => {
      myProps.form.data[myProps.name].text = text;
    }
    this.setFormDetails = (myProps,details,identifiers) => {
      let context = {}; let redactions = {};
      identifiers.map(identifier => {
        context[identifier.full] = (details[identifier.full] || {}).context || '';
        redactions[identifier.full] = (details[identifier.full] || {}).redacted || '';
      })
      myProps.form.data[myProps.name].context = context;
      myProps.form.data[myProps.name].redactions = redactions;
    }
  }

  handleUpdateField(newFieldState) {
    const text = newFieldState.getCurrentContent().getPlainText(contentBlockDelimiter);
    const newIdentifiers = parser.extractIdentifiers(text, identifierPrefixes);
    const oldIdentifiers = this.state.identifiers;
    const identifiersChanged = haveIdentifiersChanged(oldIdentifiers,newIdentifiers);
    if (identifiersChanged) {
      let newIdentifierDetails = {...this.state.identifierDetails};
      if (newIdentifiers.length == oldIdentifiers.length) {
        for (let i = 0; i < newIdentifiers.length; i++) {
          if (newIdentifiers[i].full != oldIdentifiers[i].full) {
            if (newIdentifiers[i].type == oldIdentifiers[i].type) {
              const text = newIdentifierDetails[oldIdentifiers[i].full];
              if (!newIdentifierDetails[newIdentifiers[i].full]) {
                newIdentifierDetails[newIdentifiers[i].full] = text;  
              }
            }
          }
        }
      }  
      this.setState({
        identifiers: newIdentifiers,
        identifierDetails: newIdentifierDetails,
        fieldState: newFieldState
      });
      this.setFormText(this.props, text);
      this.setFormDetails(this.props, newIdentifierDetails, newIdentifiers);
      requestAnimationFrame(() => {
        this.setState({fieldState: updateDecorations(newFieldState,newIdentifiers)});
      });
    } else {
      this.setState({fieldState: newFieldState});
      this.setFormText(this.props, text);
    }
  }

  handleUpdateIdentifierName(text,identifierIndex) {
    const { identifiers, fieldState } = this.state;
    const currIdentifier = identifiers[identifierIndex].full;
    const newIdentifier = identifiers[identifierIndex].type + '_' + text;
    const fieldText = fieldState.getCurrentContent().getPlainText(' ')
    const newFieldText = parser.replaceIdentifiers(fieldText, currIdentifier, newIdentifier);
    const newFieldState = EditorState.createWithContent(ContentState.createFromText(newFieldText, contentBlockDelimiter));
    this.handleUpdateField(newFieldState);
    let newIdentifierDetails = {...this.state.identifierDetails};
    newIdentifierDetails[newIdentifier] = this.state.identifierDetails[currIdentifier];
    this.setState({identifierDetails: newIdentifierDetails});

  }

  handleUpdateIdentifierContext(text,identifierIndex) {
    let newIdentifierDetails = {...this.state.identifierDetails};
    const identifier = this.state.identifiers[identifierIndex].full;
    newIdentifierDetails[identifier] = {...newIdentifierDetails[identifier], 
      context: text
    };
    this.setState({identifierDetails: newIdentifierDetails});
    this.setFormDetails(this.props, newIdentifierDetails, this.state.identifiers);
  }

  handleUpdateIdentifierRedacted(text,identifierIndex) {
    let newIdentifierDetails = {...this.state.identifierDetails};
    const identifier = this.state.identifiers[identifierIndex].full;
    newIdentifierDetails[identifier] = {...newIdentifierDetails[identifier], 
      redacted: text
    };
    this.setState({identifierDetails: newIdentifierDetails});
    this.setFormDetails(this.props, newIdentifierDetails, this.state.identifiers);
  }
  
  render() {
    const { identifiers, identifierDetails, fieldState } = this.state;
    const { handleUpdateField, handleUpdateIdentifierContext, handleUpdateIdentifierRedacted, handleUpdateIdentifierName } = this;
    return (
      <div>
        <TextArea state={fieldState} onUpdate={handleUpdateField}></TextArea>
        {
          identifiers.map((identifier,i) => 
            <Identifier key={i} index={i} {...identifier} details={identifierDetails[identifier.full]} onUpdateContext={handleUpdateIdentifierContext} onUpdateName={handleUpdateIdentifierName} onUpdateRedacted={handleUpdateIdentifierRedacted}></Identifier>    
          )
        }
      </div>
    );
  }

}
