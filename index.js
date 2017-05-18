// tarpit
//
// The second change: tarpit on that endpoint.
// this is slightly more complex, but not so hard. use a redis to store IPs +  last access times + access counts, for this endpoint only. Do an exponential backoff on responding to an IP that's already hit the endpoint even once. Force them to change IPs way too often.  Redis data structure is: ip is key to a hash that has last access time & count.

module.exports = tarpit

function tarpit (opts) {
  opts.wait = opts.wait || 10
  opts.max = opts.max || 10000

  return function (key, cb) {
    opts.get(key, function (err, obj) {
      var now = Date.now()
      obj.time = obj.time || 0
      if (!obj.count || isNaN(obj.count)) {
        obj.count = 0
      }
      // it should take no requests for opts.max*2 to escape from the tarpit.
      if (obj.time < now - (opts.max * 2)) {
        obj.count = 0
      }

      var delay = Math.pow(opts.wait, obj.count)

      if (delay > opts.max) {
        delay = opts.max
      }

      setTimeout(function () {
        cb(err, delay)
      }, delay || 0)

      return delay
    })
  }
}

function json (o) {
  try {
    return JSON.parse(o)
  } catch (e) {}
}
