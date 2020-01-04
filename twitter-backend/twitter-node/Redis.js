const redis = require('redis')

//Initialize Redis
// create and connect redis client to local instance.
const client = redis.createClient(6379,'twitterredis.fjudnu.ng.0001.use2.cache.amazonaws.com', {no_ready_check: true})
 
// echo redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err)
});

client.setex('user:profile', 3600, {"name":"twitteruser0","email":"twitter@1230"});

module.exports = {
    Client:client
  
  }