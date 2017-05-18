var test = require('tape')
var tarpit = require('../')

test('can', function (t) {
  var redis = require('redis')
  var client = redis.createClient(process.env.LOGIN_CACHE_REDIS || 'redis://127.0.0.1:6379')

  var name = 'user-requests'
  var max = 10000

  var pit = tarpit({
    get: function (key, cb) {
      console.log('get ', key)
      key = 'tarpit:' + name + ':' + key
      client.get(key, function (err, str) {
        t.ok(!err, 'no error')
        console.log('got ', key)

        var obj = json(str) || {}
        var count = (obj.count || 0) + 1

        client.setex(key, max / 1000, JSON.stringify({time: Date.now(), count: count}), function (err) {
          t.ok(!err, 'no error')
          console.log('did setex ', key, obj)
          cb(err, obj)
        })
      })
    },
    max: max
  })

  client.del('tarpit:' + name + ':fooo', function () {
    pit('fooo', function (err, wait) {
      t.ok(!err, 'no error')
      t.equals(wait, 1, 'wait should have been 1')

      pit('fooo', function (err, wait) {
        t.ok(!err, 'no error')
        t.equals(wait, 10, 'wait should have been 10')
        t.end()
        client.unref()
      })
    })
  })
})

function json (o) {
  try {
    return JSON.parse(o)
  } catch (e) {}
}
