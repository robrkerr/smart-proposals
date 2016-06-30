export default class Submission {
  constructor() {
    this.data = {
      title: '',
      description: '',
      redactions: [],
      
    }
  }

  toJson() {
    return JSON.stringify(this.data)
  }
}
