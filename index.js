var tar = require('./lib/tar')
var json = require('./util/json')

var redis = require('redis')
var client = redis.createClient('redis://127.0.0.1:6379')

module.exports = tarpit

function tarpit(key, opts, target) {
  var name = opts.name
  var maxWait = opts.maxWait
    
  var pit = tar({
    get: function (key, target) {
      key = 'tarpit:' + name + ':' + key
      client.get(key, function(err, str) {
        if (err) throw err

        var obj = json(str) || {}
        var count = (obj.count || 0) + 1
        var data = JSON.stringify({time: Date.now(), count: count})

        client.setex(key, maxWait / 1000, data, function(err) {
          target(err, obj)
        })
      })
    },
    maxWait: maxWait
  })
}
