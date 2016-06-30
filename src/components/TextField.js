import React, {Component} from 'react'

export default class TextArea extends Component {
  handleUpdate(e) {
    if (!this.props.form.example) {
      this.props.form.data[this.props.name] = e.target.value
      this.forceUpdate()  
    }
  }

  render() {
    const { name, label, form } = this.props
    const value = form.data[name]
    if (label) {
      return <div className="Field">
        <div className="Field_Label">{ label }</div>
        <input type='text' className="Field_Text" value={value} onChange={this.handleUpdate.bind(this)}/>
      </div>
    } else {
      return <input type='text' className="field-text" value={value} onChange={this.handleUpdate.bind(this)}/>
    }
  }
}
