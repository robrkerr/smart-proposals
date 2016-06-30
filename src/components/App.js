import React, {Component} from 'react'

import Submission from '../models/Submission'
import SanitisingDescription from './SanitisingDescription'
import TextField from './TextField'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.handleUpdateTitle = this.handleUpdateTitle.bind(this);
    this.state = { submission: new Submission() };
  }

  handleUpdateTitle(event) {
    this.setState({ title: event.target.value });
  }

  onSubmit(e) {
    e.preventDefault()
    this.state.submission.submit().then(response => console.log(response))
  }

  render() {
    const { submission } = this.state;
    const { conference } = this.props;
    return (
      <main className={conference.id}>
        <form onSubmit={this.onSubmit.bind(this)} className="Form">
          <h1 className="Header">
            {conference.title} call for proposals
          </h1>
          <p className="Intro">
            This year we're doing things a little differently, you should have
            a <a href={conference.url} className="Link">read about why</a>.
          </p>
          <hr/>
          <TextField name="title" label="Title" form={submission}>

          </TextField>
          <div className="Field -readonly">
            <div className="Field_Label">
              Description
            </div>
            <div className="Field_Note">
              <strong>NOTE</strong> please replace anything personally-identifiable in your talk submission with a string like COMPANY_A, PROJECT_B, PERSON_C, or OTHER_D.
            </div>
            <SanitisingDescription name="description" label="Description" form={submission}/>
          </div>
          <div className="Form_Buttons">
            <div className="Intro">Once you're happy with your submission, send it to us!</div>
          <button type="submit" className="Button">Submit</button>
          </div>
        </form>
      </main>
    );
  }
}
