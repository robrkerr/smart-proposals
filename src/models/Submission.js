import examples from './examples'

const emptyData = {
  title: '',
  description: {
    text: '',
    context: {},
    redactions: {}
  }
}

const api = window.location.hostname.match(/localhost/) ? 'http://localhost:3000' : 'https://vsconf-cfp.herokuapp.com'
const exampleName = window.location.href.split('?')[1]

export default class Submission {
  constructor(conference) {
    this.conference = conference
    this.data = examples[exampleName] || emptyData
    this.example = examples[exampleName] !== undefined
  }

  submit() {
    return fetch(`${api}/proposals`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        proposal: {
          title: this.data.title,
          conference: this.conference.id,
          submission: this.data
        }
      })
    }).then(r => r.json())
  }
}
