import React, { Component } from 'react'
import {Editor, ContentState} from 'draft-js'

export default class TextArea extends Component {

  render() {
    const handleUpdate = (editorState) => {
      if (!this.props.readonly) {
        this.props.onUpdate(editorState);
      }
    };
    return (
      <div className="Description_Container">
        <div className="Description_Field">
          <Editor editorState={this.props.state} onChange={handleUpdate} />
        </div>
      </div>
    );
  }
}
