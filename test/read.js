var schemaculate = require('../')

var db = schemaculate('/tmp/test.db',
    { lat: Number
    , long: Number
    , mid: String
    , user: Number
    , text: String
    })

var ll = 0

db.each(function(lat, long, text) {
  ll += lat + long
})

console.log(ll)
