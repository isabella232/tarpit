var tar = require('./lib/tar')
var client = require('./lib/pit')

var json = require('./util/json')

module.exports = tarpit

function tarpit(opts, target) {
  var name = opts.name
  var maxWait = opts.maxWait
    
  var pit = tar({
    get: function (key, target) {
      console.log('get ', key)
      key = 'tarpit:' + name + ':' + key
      client.get(key, function(err, str) {
        if (err) throw err
        console.log('got ', key)

        var obj = json(str) || {}
        var count = (obj.count || 0) + 1
        var data = JSON.stringify({time: Date.now(), count: count})

        client.setex(key, maxWait / 1000, data, function(err) {
          target(err, obj)
          console.log('did setex', key, obj)
        })
      })
    },
    maxWait: maxWait
  })
  return pit
}
