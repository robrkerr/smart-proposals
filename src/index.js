import ReactDOM from 'react-dom'
import React from 'react'
import App from './components/App'
import AllOver from './components/AllOver'
import './style/style'
import examples from './models/examples'
import api from './utils/api'

const conference = window.location.hostname.match(/css/) ? {
  id: 'css',
  title: 'CSSConf AU 2016',
  url: 'http://2016.cssconf.com.au'
} : {
  id: 'js',
  title: 'JSConf AU 2016',
  url: 'http://2016.jsconfau.com'
}

ReactDOM.render(
  <AllOver conference={conference}/>,
  document.getElementById('app')
)
/*

const lookup = window.location.search.match(/^\?(example(\d+)|([0-9a-f]{24}))$/)
const fetchExisting = new Promise((resolve, reject) => {
  if (lookup) {
    const [_,__,exampleId,existingId] = lookup
    if (exampleId) {
      resolve({ type: 'example', data: examples[exampleId] })
    } else {
      document.getElementById('app').innerHTML = `<main class="${conference.id}"><div class="Form">Loading...</div></main>`
      fetch(`${api}/proposals/${existingId}`)
        .then(r => r.json())
        .then(response => resolve({ type: 'existing', sekret: response.sekret, data: response.submission }))
        .catch(() => resolve())
    }
  } else {
    resolve()
  }
})

fetchExisting.then(prefill => ReactDOM.render(
  <App conference={conference} prefill={prefill}/>,
  document.getElementById('app')
))
*/
