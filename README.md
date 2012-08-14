# Schemaculate

Basically read and write CSV-like data. Designed to be fast, small, and convenient.

## Example

```js
var schemaculate = require('schemaculate')

var db = schemaculate('/tmp/test.db',
    { lat: Number
    , long: Number
    , text: String
    })

// Add a standard object to the database
db.add({ lat: 54.2, long: 23.43, text: "Hello World" })

// Add an object with ordered parameters
db.add(10.3, -43.1, "This is a test")

// Iterate over every item in the database
db.each(function(item) {
    console.log(item.text + " @ " + item.lat + "/" + item.long)
})

// Destructure items based on argument names
db.each(function(lat, long, text) {
    console.log(text + " @ " + lat + "/" + long)
})
```

## Todo

* Create real tests

## MIT License

Copyright (C) 2011 by Isaac Wolkerstorfer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
