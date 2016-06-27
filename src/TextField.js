import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {Editor, ContentState} from 'draft-js'
import styles from './TextField.css'

export default class TextField extends Component {

  constructor(props) {
    super(props);
    this.handleUpdate = (editorState) => props.onUpdate(editorState,props.index);
  }

  render() {
    const { label, state, indentiers } = this.props;
    const lines = (this.props.lines || 1)*2;
    const fieldStyles = {minHeight: lines + 'rem'};
    return (
      <div className={styles.container}>
        <div className={styles.label}>
          {label}
        </div>
        <div className={styles.field} style={fieldStyles}>
          <Editor contentEditable={false} editorState={state} onChange={this.handleUpdate} />
        </div>
      </div>
    );
  }

}

