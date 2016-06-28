import React, { Component } from 'react'
import SanitisingDescription from './SanitisingDescription'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.handleUpdateTitle = this.handleUpdateTitle.bind(this);
    this.state = {title: ''};
  }

  handleUpdateTitle(event) {
    this.setState({title: event.target.value});
  }
  
  render() {
    const { title } = this.state;
    return (
      <div className="main-container">
        <div className="field-label">
          Title
        </div>
        <input type='text' className="field-text" value={title} onChange={this.handleUpdateTitle} />
        <div className="field-label">
          Description
        </div>
        <div className="field-note">
          Please self-sanitise these when referring to things such as companies, projects and people with generic identifiers, such as COMPANY_A. Stick to the following prefixes: COMPANY, PROJECT, PERSON and OTHER.
        </div>
        <SanitisingDescription/>
      </div>
    );
  }
}
