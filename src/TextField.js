import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styles from './TextField.css'

export default class TextField extends Component {

  handleUpdate(event) {
    this.props.onUpdate(event.target.value,this.props.index);
  }

  render() {
    const { label } = this.props;
    const handleUpdate = this.handleUpdate.bind(this);
    const lines = (this.props.lines || 1)*2;
    const fieldStyles = {height: lines + 'rem'};
    return (
      <div className={styles.container}>
        <div className={styles.label}>
          {label}
        </div>
        <div>
          <textarea className={styles.field} style={fieldStyles} onChange={handleUpdate}></textarea>
        </div>
      </div>
    );
  }

}
