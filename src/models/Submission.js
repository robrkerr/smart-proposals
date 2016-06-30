const api = window.location.hostname.match(/localhost/) ? 'http://localhost:3000' : 'https://vsconf-cfp'

export default class Submission {
  constructor() {
    this.data = {
      title: '',
      description: {
        text: '',
        context: {},
        redactions: {}
      }
    }
    // this.data = {
    //   title: '',
    //   description: {
    //     text: 'As part of my work for COMPANY_A, I am developing PROJECT_A and we are doing some amazing things with Threejs. Building on what PERSON_A built, we show that it is possible to...',
    //     context: { 
    //       COMPANY_A: 'Recent startup that will only be familar to a few people.',
    //       PROJECT_A: 'New project that would not have been spoken about in a conference talk.',
    //       PERSON_A: 'Well known and respected Javascript developer.'
    //     },
    //     redactions: {
    //       COMPANY_A: 'FireBoat',
    //       PROJECT_A: 'lol.js',
    //       PERSON_A: 'Smithy'
    //     }
    //   }
    // }
  }

  submit() {
    // console.log(JSON.stringify(this.data));
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
