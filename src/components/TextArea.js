import React, { Component } from 'react'
import {Editor, ContentState} from 'draft-js'

export default class TextArea extends Component {

  render() {
    const handleUpdate = (editorState) => this.props.onUpdate(editorState);
    return (
      <div className="description-container">
        <div className="description-field">
          <Editor editorState={this.props.state} onChange={handleUpdate} />
        </div>
      </div>
    );
  }
}
