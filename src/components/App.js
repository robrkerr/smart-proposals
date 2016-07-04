import React, {Component} from 'react'

import Submission from '../models/Submission'
import SanitisingDescription from './SanitisingDescription'
import TextField from './TextField'
import RadioButton from './RadioButton'
import FormData from '../models/FormData'

export default class App extends Component {
  constructor(props) {
    super(props)
    const { prefill, conference } = props
    this.state = { submission: new Submission(conference, prefill), inProgress: false, submitted: false }
  }

  onSubmit(e) {
    e.preventDefault()
    this.setState({ inProgress: true })
    this.state.submission.submit()
      .then(response => this.setState({
        submitted: `${window.location.href.replace(/\?\w+$/,'')}?${response.sekret}`
      }))
  }

  render() {
    const { submission, inProgress, submitted } = this.state
    const { conference } = this.props
    const { newnessOptions, locationOptions, techExperienceOptions, speakingExperienceOptions } = FormData(conference)
    const blogPostUrl = '/2016/07/01/cfp.html'

    return (
      <main className={conference.id}>
        { submitted ?
          <div className="Form -submitted">
            <h1 className="Header">
              You're Awesome 😍
            </h1>
            <p className="Intro">You can come back and edit your submission any time at
              <br/>
              <a target="_blank" href={submitted} className="Link">{submitted}</a>
            </p>
          </div>
          :
          <form onSubmit={this.onSubmit.bind(this)} className={"Form" + (inProgress ? ' -in-progress' : '')}>
            <h1 className="Header">
              {conference.title} call for proposals
            </h1>
            { submission.example
              ? <p className="Intro">This is an example proposal that was accepted in a previous year.</p>
              :
              <p className="Intro">
                This year we're doing things a little differently, you should have
                a <a target="_blank" href={blogPostUrl} className="Link">read about why</a>. <strong>Submissions are open until July 31st.</strong>
              </p>
            }
            <hr/>
            <TextField name="title" label="Title" form={submission}>
            </TextField>
            <div className="Field">
              <div className="Field_Label">
                Talk Description
              </div>
              <div className="Field_Note">
                <strong>NOTE</strong> please replace anything personally-identifiable in your talk submission with a
                string like COMPANY_A, PROJECT_B, PERSON_C, or OTHER_D.
                <br/>
                Confused about why? See the
                a <a target="_blank" href={blogPostUrl + "#anonymised-description-field"} className="Link">relevant section</a> of
                the CFP blog post.
              </div>
              <SanitisingDescription name="description" label="Description" form={submission}/>
            </div>
            <RadioButton name="newness" label="Have you given this talk before?" options={newnessOptions} form={submission}/>
            <TextField name="gender" label="Gender" form={submission}>
              Feel free to put "Prefer not to say".
            </TextField>
            <RadioButton name="location" label="Location" options={locationOptions} form={submission}/>
            <RadioButton name="techExperience" label="Tech industry experience" options={techExperienceOptions}
                         form={submission}/>
            <RadioButton name="speakingExperience" label="Speaking experience" options={speakingExperienceOptions}
                         form={submission}/>
            <RadioButton name="flights" label="Can your company pay for flights" options={["Yes","No"]}
                         form={submission}/>
            <TextField type="text" name="name" label="Your Name" form={submission}/>
            <TextField name="twitter" label="Twitter Handle or Website" form={submission} required={false}/>
            <TextField type="email" name="email" label="Email Address" form={submission}/>
            <TextField type="text" name="anythingElse" label="Anything else you need to tell us?" form={submission} required={false}/>
            { submission.example ? null :
              <div className="Form_Buttons">
                <div className="Intro"><p>Once you're happy with your submission, send it to us. You will receive a link to access your proposals afterwards.</p></div>
                <button type="submit" className="Button">{submission.inProgress ? 'Saving...' : submission.sekret ? 'Save' : 'Submit' }</button>
              </div>
            }
          </form>
        }
      </main>
    );
  }
}
