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
    const { conference } = this.props;
    return (
      <form onSubmit={this.onSubmit.bind(this)} className="Form">
        <h1 className="Header">
          {conference.title} call for proposals
        </h1>
        We're doing things a little differently, you should have a <a href=""></a>read about why.
        <hr/>
        <TextField name="title" label="Title" form={submission}/>
        <div className="Field">
        <div className="Field_Label">
          Description
        </div>
        <div className="Field_Note">
          Please self-sanitise these when referring to things such as companies, projects and people with generic identifiers, such as COMPANY_A. Stick to the following prefixes: COMPANY, PROJECT, PERSON and OTHER.
        </div>
        <SanitisingDescription name="description" label="Description" form={submission}/>
        </div>
        <button type="submit" className="Button">Submit</button>
      </form>
    );
  }
}
