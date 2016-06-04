import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styles from './TextField.css'

export default class TextField extends Component {

  render() {
    const { label } = this.props;
    const lines = (this.props.lines || 1)*2;
    const fieldStyles = {height: lines + 'rem'};
    return (
      <div className={styles.container}>
        <div className={styles.label}>
          {label}
        </div>
        <div>
          <textarea className={styles.field} style={fieldStyles}></textarea>
        </div>
      </div>
    );
  }

}
