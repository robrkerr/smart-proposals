import React, { Component } from 'react'
import TextField from './TextField'
import Identifier from './Identifier'
import styles from './app.css'

export default class App extends Component {

  render() {
    return (
      <div className={styles.main}>
        <TextField label='Title'></TextField>
        <TextField label='Description' lines='5'></TextField>
        <div className={styles.label}>Did you mention any identifying names (e.g. companies or project names)? List them here:</div>
        <Identifier name='COMPANY_A' description=''></Identifier>
        <div className={styles.add}>Add</div>
      </div>
    );
  }

}
