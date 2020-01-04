const database = require('../Database.js');
const Profile = database.Profile;
const mongoose=require('mongoose')


function handle_request(msg, callback) {
    console.log("**********************");
    console.log("Inside getBookmarkedTweets kafka backend, msg: ", msg);
    
    Profile.findById({_id:msg}, function(err, profile){
        if(err){
            console.log("Error in Kafka Backend -> getBookmarkedTweets");
            callback(err, null);
        }else{
            console.log("INSIDE getBookmarkedTweets KAFKA BACKEND",profile);
            let bookmarkedTweets = profile.bookmarkedTweets;
            console.log('Bookmarked twwed ----------->',bookmarkedTweets)
            //let bookmarkedTweetsIds = [];
            callback(null, bookmarkedTweets);
        }
    });

};
exports.handle_request = handle_request;