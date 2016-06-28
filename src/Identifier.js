import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class Identifier extends Component {

	handleUpdate(event) {
    this.props.onUpdate(event.target.value,this.props.index);
  }

  handleUpdateName(event) {
  	this.props.onUpdateName(event.target.value,this.props.index);
  }

  render() {
  	const { type, name, description, index } = this.props;
  	const handleUpdate = this.handleUpdate.bind(this);
  	const handleUpdateName = this.handleUpdateName.bind(this);
    return (
      <div className="identifier-container">
      	<div className={"identifier-type underline underline-" + (index % 6)}>{type}</div>
      	<input type='text' className="identifier-name" value={name} onChange={handleUpdateName} />
        <input type='text' className="identifier-description" value={description} placeholder='Context...' onChange={handleUpdate} />
      </div>
    );
  }

}
