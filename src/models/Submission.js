import api from '../utils/api'

const emptyData = {
  title: '',
  description: {
    text: '',
    context: {},
    redactions: {}
  }
}

export default class Submission {
  constructor(conference, prefill = {}) {
    this.conference = conference
    this.data = prefill.data || emptyData
    this.sekret = prefill.sekret
    this.example = prefill.type === 'example'
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
          sekret: this.sekret,
          title: this.data.title,
          conference: this.conference.id,
          submission: this.data
        }
      })
    }).then(r => r.json())
  }
}
