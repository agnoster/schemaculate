var fs = require('fs')

function Schema(fields) {
  if (typeof fields != 'object') {
    throw new Error("Schema must be an Array or Object")
  }
  if (fields.constructor == Array) {
    this.fields = fields
  } else {
    // convert schema to ordered schema

    this.fields = []
    var field, value, def = null;

    for (field in fields) {
      if (!fields.hasOwnProperty(field)) continue
      value = fields[field]

      if (typeof value != 'function') {
        def = value
        value = def.constructor
      }
      this.fields.push({ name: field, type: types[value.name], def: def })
    }
  }
}

Schema.prototype.encode = function(obj) {
  if (typeof obj == 'object') {
    if (obj instanceof Array)
      return obj

    if (arguments.length == 1)
      return this.encodeObject(obj)
  }

  return this.encodeArray(arguments)
}

Schema.prototype.encodeArray = function(fields) {
  return Array.prototype.slice.apply(fields)
}

Schema.prototype.encodeObject = function(obj) {
  var i, field, value, data = []

  for (i = 0; i < this.fields.length; i++) {
    field = this.fields[i]
    value = obj[field.name] || field.type.make()
    data.push(value)
  }
  return data
}

Schema.prototype.stringify = function() {
  var data = this.encode.apply(this, arguments)
  var string = JSON.stringify(data)
  return string.slice(1, string.length - 1)
}

Schema.prototype.decode = function(arr) {
  if (arr.length != this.fields.length)
    throw new Error("Schema and data lengths do not match")

  var i, obj = {}

  for (i = 0; i < arr.length; i++) {
    obj[this.fields[i].name] = arr[i]
  }

  return obj
}

Schema.prototype.parse = function(string) {
  string = '[' + string + ']'
  return this.decode(JSON.parse(string))
}

Schema.parse = function(string) {
  var schema = JSON.parse(string)

  for (var key in schema.fields) {
    schema.fields[key].type = types[schema.fields[key].type]
  }

  schema.__proto__ = Schema.prototype

  return schema
}

function makeDestructuringCallback(func) {
  var argnames = /\((.*?)\)/.exec(func.toString())[1].split(/\s*,\s*/)
    , i, args = []

  for (i = 0; i < argnames.length; i++) {
    args.push('o.' + argnames[i])
  }

  return eval(
      '(function (o) { return func(' + args.join(', ') + '); })'
      )
}

function Type(constructor, check, make) {
  this.construct = constructor
  this.check = check

  if (typeof make != 'undefined') {
    if (typeof make == 'function') this.make = make
    else this.make = function () { return make }
  } else {
    this.make = function () { new constructor }
  }
}

Type.prototype.toJSON = function() {
  return this.construct.name
}

var types =
{ Number: new Type(Number, function(e) { return typeof e == 'number' }, 0)
, String: new Type(String, function(e) { return typeof e == 'string' }, '')
, Date: new Type(Date, function(e) { return e instanceof Date }, function(){ return new Date })
}

var schemaculate = function(file, fields) {
  var schema = new Schema(fields)
  var json = JSON.stringify(schema)

  var db = function() {
  }

  db.add = function(el) {
    if (arguments.length > 1) el = Array.prototype.slice.apply(arguments)

    if (!db.writer) db.writer = fs.createWriteStream(file, { flags: 'a' })
    db.writer.write(schema.stringify(el)+"\n")
  }

  db.each = function(cb) {
    var reader = fs.createReadStream(file)
    var buffer = ''
    if (cb.length > 1)
      cb = makeDestructuringCallback(cb)

    reader.on('data', function (data) {
      buffer += data
      var i, fields
      while ((i = buffer.indexOf("\n")) >= 0) {
        fields = schema.parse(buffer.slice(0, i))

        cb(fields)

        buffer = buffer.slice(i + 1)
      }
    })
  }

  return db;
}

module.exports = schemaculate
