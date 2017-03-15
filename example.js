// tarpit
//
// The second change: tarpit on that endpoint.
// this is slightly more complex, but not so hard. use a redis to store IPs +  last access times + access counts, for this endpoint only. Do an exponential backoff on responding to an IP that's already hit the endpoint even once. Force them to change IPs way too often.  Redis data structure is: ip is key to a hash that has last access time & count.


var redis = require('redis')
var client = redis.createClient('redis://127.0.0.1:6379')



var tarpit = require('./')

var name = 'user-requests'
var max = 10000

var pit = tarpit({
  get:function(key,cb){
    console.log('get ',key)
    key = 'tarpit:'+name+':'+key
    client.get(key,function(err,str){

      console.log('got ',key)

      var obj = json(str)||{}
      var count = (obj.count||0)+1

      client.setex(key,max/1000,JSON.stringify({time:Date.now(),count:count}),function(err){
        cb(err,obj)
        console.log('did setex ',key,obj)
      })
    }) 
  },
  max:max
})

pit('fooo',function(err,wait){
  console.log('i had to wait ',wait,' in the tarpit')
  client.unref()
})


function json(o){
  try{
    return JSON.parse(o)
  } catch(e) {}
}



