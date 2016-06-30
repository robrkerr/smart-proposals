import React, { Component } from 'react'

import Submission from '../models/Submission'
import SanitisingDescription from './SanitisingDescription'
import TextField from './TextField'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.handleUpdateTitle = this.handleUpdateTitle.bind(this);
    this.state = {submission: new Submission()};
  }

  handleUpdateTitle(event) {
    this.setState({title: event.target.value});
  }

  onSubmit(e) {
    e.preventDefault()
    this.state.submission.submit().then(response => console.log(response))
  }

  render() {
    const { submission } = this.state;
    return (
      <form onSubmit={this.onSubmit.bind(this)} className="main-container">
        <TextField name="title" label="Title" form={submission}/>
        <div className="field-label">
          Description
        </div>
        <div className="field-note">
          Please self-sanitise these when referring to things such as companies, projects and people with generic identifiers, such as COMPANY_A. Stick to the following prefixes: COMPANY, PROJECT, PERSON and OTHER.
        </div>
        <SanitisingDescription name="description" label="Description" form={submission}/>
        <button type="submit">Go</button>
      </form>
    );
  }
}
