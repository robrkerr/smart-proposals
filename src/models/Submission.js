const api = window.location.hostname.match(/localhost/) ? 'http://localhost:3000' : 'https://vsconf-cfp'

export default class Submission {
  constructor() {
    this.data = {
      title: '',
      description: '',
      redactions: [],

    }
  }

  submit() {
    return fetch(`${api}/submissions`, {method: 'POST', body: this.data}).then(r => r.json())
  }
}
