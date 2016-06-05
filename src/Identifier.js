import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styles from './Identifier.css'

export default class Identifier extends Component {

	handleUpdate(event) {
    this.props.onUpdate(event.target.value,this.props.index);
  }

  handleUpdateName(event) {
  	this.props.onUpdateName(event.target.value,this.props.index);
  }

  render() {
  	const { name, description } = this.props;
  	const handleUpdate = this.handleUpdate.bind(this);
  	const handleUpdateName = this.handleUpdateName.bind(this);
    return (
      <div className={styles.container}>
      	<input type='text' className={styles.name} value={name} onChange={handleUpdateName} />
        <input type='text' className={styles.description} value={description} onChange={handleUpdate} />
      </div>
    );
  }

}
