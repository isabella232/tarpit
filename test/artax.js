const test = require('tape')

test('aaaaarrrrtttaaxxx', function (t) {
  const tarpit = require('../')
  tarpit('testpit', function (err, wait) {
    t.ok(!err, 'no error')
    console.log(wait)
    t.equals(wait, 1, 'after one request wait should be 1')
    tarpit('testpit', function (err, wait) {
      t.ok(!err, 'no error')
      t.equals(wait, 10, 'after two requests wait should be 10')
      t.end()
    })
  })
})
