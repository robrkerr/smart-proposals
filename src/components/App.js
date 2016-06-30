import React, {Component} from 'react'

import Submission from '../models/Submission'
import SanitisingDescription from './SanitisingDescription'
import TextField from './TextField'
import RadioButton from './RadioButton'

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
    const newnessValues = [
      "Yes! I've given this talk several times and the version I bring to CONFERENCE will be all the better for it!",
      "Sort of! I've given a version of this talk at a conference before but there'll be a decent chunk of new stuff for CONFERENCE.", 
      "Yes but at a meetup/at a conference which wasn't filmed. This will be the first time it's recorded and made available online.",
      "No! I'm hoping CONFERENCE will be the first time I am able to!"
    ];
    const locationValues = [
      "Australia, New Zealand & Oceania",
      "San Francisco Bay Area",
      "Rest of North America",
      "Central & South America",
      "Western Europe",
      "Eastern Europe, Middle East & Central Asia",
      "Africa",
      "East & South-East Asia"
    ];
    const techExperienceValues = [
      "Senior/Leader. I feel fairly knowledgable about a good breadth of topics.",
      "Area expert. Wouldn't describe myself as a \"senior\" but I feel confident in my knowledge of the subject matter of my talk/the conference at large.",
      "Mid level. Not an expert, not a junior, but excited to learn & excited to help other people learn.",
      "Junior. New to the industry but keen to share my perspective & knowledge.",
      "Not in Tech. I'm employed in another industry and therefore I'll be able to give a different perspective to my topic.",
      "Student. I'm still learning, but enthusiastic to share what I know.",
      "Other"
    ];
    const speakingExperienceValues = [
      "Plenty. You tell me what time I'm on, I'll do the rest.",
      "Some. I've spoken at more than 3 conferences, but I still don't think I'm an old hand.",
      "A little. I've spoken at 1-3 conferences already, and keen to do more.",
      "Not at conferences (yet). This would be my first major conference, but I've spoken at meetups or done other presenting first.",
      "None whatsoever. I'm excited to start!",
      "Other"
    ];
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
          <div className="Field">
            <div className="Field_Label">
              Description
            </div>
            <div className="Field_Note">
              <strong>NOTE</strong> please replace anything personally-identifiable in your talk submission with a string like COMPANY_A, PROJECT_B, PERSON_C, or OTHER_D.
            </div>
            <SanitisingDescription name="description" label="Description" form={submission}/>
          </div>
          <RadioButton name="newness" label="Newness of talk" values={newnessValues} form={submission}/>
          <div className="Field">
            <div className="Field_Label">
              Gender
            </div>
            <div className="Field_Note">
              Feel free to put "Prefer not to say".
            </div>
            <TextField name="gender" form={submission}/>
          </div>
          <RadioButton name="location" label="Location" values={locationValues} form={submission}/>
          <RadioButton name="techExperience" label="Tech industry experience" values={techExperienceValues} form={submission}/>
          <RadioButton name="speakingExperience" label="Speaking experience" values={speakingExperienceValues} form={submission}/>
          <RadioButton name="flights" label="Can your company pay for flights" values={["Yes","No"]} form={submission}/>
          <TextField name="twitter" label="Twitter Handle" form={submission}/>
          <TextField name="photo" label="Photo Url" form={submission}/>
          <TextField name="email" label="Email Address" form={submission}/>
          <div className="Form_Buttons">
            <div className="Intro">Once you're happy with your submission, send it to us!</div>
          <button type="submit" className="Button">Submit</button>
          </div>
        </form>
      </main>
    );
  }
}
