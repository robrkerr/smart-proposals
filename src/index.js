import ReactDOM from 'react-dom'
import React from 'react'
import App from './components/App'
import './style/style'

const conf = window.location.hostname.match(/css/) ? {
  title: 'CSSConf AU 2016',
  domain: '2016.cssconf.com.au'
} : {
  title: 'JSConf AU 2016',
  domain: '2016.jsconfau.com'
}

ReactDOM.render(
  <App conference={conf}/>,
  document.getElementById('app')
)
