import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styles from './Identifier.css'

export default class Identifier extends Component {

  render() {
  	const { name } = this.props;
    return (
      <div className={styles.container}>
        <input type='text' className={styles.name} value={name} />
        <input type='text' className={styles.description} />
        <div className={styles.remove}>Remove</div>
      </div>
    );
  }

}
