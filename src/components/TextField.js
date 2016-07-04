import React, {Component} from 'react'

export default class TextArea extends Component {
  handleUpdate(e) {
    if (!this.props.form.example) {
      this.props.form.data[this.props.name] = e.target.value
      this.forceUpdate()
    }
  }

  render() {
    const { name, label, form, children, type = 'text', required = true } = this.props
    const value = form.data[name]
    return <div className="Field">
      <div className="Field_Label">{ label }</div>
      { children ? <div className="Field_Note">{children}</div> : null }
      <input required={required} type={type} className="Field_Text" value={value} onChange={this.handleUpdate.bind(this)}/>
    </div>
  }
}
