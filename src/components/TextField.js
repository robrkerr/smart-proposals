import React, {Component} from 'react'

export default class TextArea extends Component {
  handleUpdate(e) {
    this.props.form.data[this.props.name] = e.target.value
    this.forceUpdate()
  }

  render() {
    const { name, label, form } = this.props
    const value = form.data[name]
    return <div>
      <div className="field-label">{ label }</div>
      <input type='text' className="field-text" value={value} onChange={this.handleUpdate.bind(this)}/>
    </div>
  }
}
