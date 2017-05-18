var test = require('tape')
var tarpit = require('../')

test('can', function (t) {
  var opts = {
    name: 'user-requests',
    maxWait: 10000
  }

  client.del('tarpit:' + name + ':fooo', function () {
    tarpit('fooo', function (err, wait) {
      t.ok(!err, 'no error')
      t.equals(wait, 1, 'wait should have been 1')

      tarpit('fooo', function (err, wait) {
        t.ok(!err, 'no error')
        t.equals(wait, 10, 'wait should have been 10')
        t.end()
        client.unref()
      })
    })
  })
})
