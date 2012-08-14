var schemaculate = require('../')

var db = schemaculate('/tmp/test.db',
    { lat: Number
    , lon: Number
    , mid: String
    , user: Number
    , text: String
    })

for (var i = 0; i < 7500; i++) {
  db.add(30,50,"741",478123,"Hello World")
  db.add(
      { lat: Math.random() * 180 - 90
      , lon: Math.random() * 360 - 180
      , text: "Here is an attempt to replicate the average length of a tweet. I'm probably not toooo far off, right? #tryingtoohard"
      , mid: "412346829301478139"
      , user: Math.floor(Math.random() * 10000000)
      })
}
