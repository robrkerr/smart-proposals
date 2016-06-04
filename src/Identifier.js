import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styles from './Identifier.css'

export default class Identifier extends Component {

  render() {
  	const { name } = this.props;
    return (
      <div className={styles.container}>
      	<div className={styles.name}>{name}</div>
        <input type='text' className={styles.description} />
      </div>
    );
  }

}
