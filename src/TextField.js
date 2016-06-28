import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {Editor, ContentState} from 'draft-js'

export default class TextField extends Component {

  constructor(props) {
    super(props);
    this.handleUpdate = (editorState) => props.onUpdate(editorState,props.index);
  }

  render() {
    const { label, state, indentiers } = this.props;
    return (
      <div className="description-container">
        <div className="description-field">
          <Editor editorState={state} onChange={this.handleUpdate} />
        </div>
      </div>
    );
  }

}

