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
  constructor() {
    this.data = examples[exampleName] || emptyData
    this.example = examples[exampleName] !== undefined
  }

  submit() {
    console.log(JSON.stringify(this.data))
    return fetch(`${api}/proposals`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({proposal: {title: this.data.title, submission: this.data}})
    }).then(r => r.json())
  }
}
