var test = require('tape')

test('can', function (t) {
  var tarpit = require('../')
  var opts = {
    name: 'test-pit',
    maxWait: 10000
  }

  var testpit = tarpit(opts, target);
  testpit('')

  function target(request) {
    console.log('request ', request)
  }

  for (var i=0; i<100; i++) {
    var req = {
      id: 'itme',
      attempt: i
    }
    target(req)
  }

})
