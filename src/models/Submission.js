const api = window.location.hostname.match(/localhost/) ? 'http://localhost:3000' : 'https://vsconf-cfp'

export default class Submission {
  constructor() {
    this.data = {
      title: '',
      description: '',
    }
  }

  submit() {
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
