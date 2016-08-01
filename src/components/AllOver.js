import React from 'react'

export default ({conference}) => (
  <main className={conference.id}>
    <div className="Form -submitted">
      <h1 className="Header">
        {conference.title} Call for Proposals
      </h1>
      <p className="Intro">The {conference.title} Call for Proposals is now closed.</p>
      <p className="Intro"><strong>Thanks to everyone for submitting!</strong></p>
      <p className="Intro">You should hear back from us about your proposal in the coming weeks.</p>
      <h1 className="Header">♥️💙💚💜</h1>
    </div>
  </main>
)
