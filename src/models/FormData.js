export default conference => ({
  newnessOptions: [
    {
      value: "Yes",
      text: "Yes! I've given this talk several times and the version I bring to " + conference.title + " will be all the better for it!"
    }, {
      value: "Sort of",
      text: "Sort of! I've given a version of this talk at a conference before but there'll be a decent chunk of new stuff for " + conference.title + "."
    }, {
      value: "Not filmed",
      text: "Yes but at a meetup/at a conference which wasn't filmed. This will be the first time it's recorded and made available online."
    }, {
      value: "No",
      text: "No! I'm hoping " + conference.title + " will be the first time I am able to!"
    }
  ],
  locationOptions: [
    "Australia, New Zealand & Oceania",
    "North America",
    "Central & South America",
    "Western Europe",
    "Eastern Europe, Middle East & Central Asia",
    "Africa",
    "East & South-East Asia"
  ],
  techExperienceOptions: [
    {
      value: 'Senior',
      text: "Senior/Leader. I feel fairly knowledgable about a good breadth of topics."
    }, {
      value: 'Expert',
      text: "Area expert. Wouldn't describe myself as a \"senior\" but I feel confident in my knowledge of the subject matter of my talk/the conference at large."
    }, {
      value: "Mid level",
      text: "Mid level. Not an expert, not a junior, but excited to learn & excited to help other people learn."
    }, {
      value: "Junior",
      text: "Junior. New to the industry but keen to share my perspective & knowledge."
    }, {
      value: "Outside tech",
      text: "Not in Tech. I'm employed in another industry and therefore I'll be able to give a different perspective to my topic."
    }, {
      value: "Student",
      text: "Student. I'm still learning, but enthusiastic to share what I know."
    }, {
      value: "Other",
      text: "Other"
    }
  ],
  speakingExperienceOptions: [
    {
      value: "Plenty",
      text: "Plenty. You tell me what time I'm on, I'll do the rest."
    }, {
      value: "Some",
      text: "Some. I've spoken at more than 3 conferences, but I still don't think I'm an old hand."
    }, {
      value: "A little",
      text: "A little. I've spoken at 1-3 conferences already, and keen to do more."
    }, {
      value: "No conferences",
      text: "Not at conferences (yet). This would be my first major conference, but I've spoken at meetups or done other presenting first."
    }, {
      value: "None",
      text: "None whatsoever. I'm excited to start!"
    }, {
      value: "Other",
      text: "Other"
    }
  ]
})

