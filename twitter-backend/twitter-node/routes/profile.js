
var express = require('express');
var router = express.Router();
var passport = require("passport");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const kafka = require("../kafka/kafka/client");
// const redis = require('../Redis.js');
//Connection Without Pooling
var db = require('../Database');
var profileModel = db.Profile;

const saltRounds = 10;
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profileImages/')
    },
    filename: function (req, file, cb) {
       // console.log(req.body)
        cb(null,file.originalname);
    }
})
const upload = multer({ storage: storage });
router.post("/upload", upload.single('productImage'), (req, res, next) => {
    console.log(req.body);
    req.body.image = req.file.filename;
    kafka.make_request('uploadImage', req.body, function (error, results) {
        if (error) {
            console.log("error in results--------", results);
            throw error;
        }
        else {
            console.log("Updated Image ",results)
            res.status(202).send();
        }
    });
})

//Add Profile
router.post('/addProfile',  function (req, res, next) {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        req.body.hash = hash;
     kafka.make_request('add_profile',req.body, function(error,results){
        if (error) {
            console.log("error in results ");
            res.status(200).send(error)
        }
        else {
            res.cookie('section', results, { maxAge: 900000, httpOnly: false, path: '/' });
            res.status(200).send(results);
        };
    });
});
});

router.post('/signInProfile', function (req, res, next) {
    kafka.make_request('signInProfile', req.body, function (error, results) {
        if (error) {
            console.log("not compare working-------------------");
            data = {
                error: "Invalid login credentials"
            };
            output = "Invalid login credentials";
            res.status(200).send(JSON.parse(data));
           
        }
        else {
            console.log("COMPARE working-------------------")
            output = "SuccessFull Login";
            profile = results[0];

            const token = jwt.sign({ _id: results[0]._id }, "cmpe273");
            res.setHeader("Access-Control-Expose-Headers", "Authorization");
            res.header('Authorization', "token " + token)
            res.send(profile);
        }
    });
});

router.post('/updateProfile', upload.single('profileImage'), function (req, res, next) {
    //let data = {image:req.file!=undefined?req.data.userHandle:"",...req.body.data};
    let data = {name: req.body.name,email:req.body.email,birthDate:req.body.birthDate,userHandle: req.body.userHandle, bio: req.body.bio,image:req.body.image,_id:req.body._id,image:req.file!=undefined?req.file.filename:""};
    console.log('Profile going for updation!!',data)
    //res.status(200).send("results");
    kafka.make_request('update_profile',data, function(error,results){
       if (error) {
           console.log("error in results ");
           res.status(200).send(error)
       }
       else {
           res.status(200).send(results);
       };
   });
});

// Get User Home Tweet Data
router.get('/getAllTweets/:userId',  function (req, res, next) {
    let userId = req.params.userId;
    console.log("Inside getAllTweets User ID is: ",userId);
    kafka.make_request('get_all_tweets',userId, function(error,kafkaResult){
        if (error) {
            console.log("error in /getAllTweets results ");
            res.status(201).send(error)
        }
        else {
            // res.writeHead(200);
            res.send(kafkaResult);
        }
    });
});

//Profile with Redis
router.post('/getProfile',  function (req, res, next) {
    kafka.make_request('get_profile',req.body, function(error,results){
       if (error) {
           console.log("error in results ");
           res.status(200).send(error)
       }
       else {
           res.status(200).send(results);
       };
   });
});

//Profile with Kafka
router.post('/getProfileKafka',  function (req, res, next) {
    kafka.make_request('getProfileKafka',req.body, function(error,results){
       if (error) {
           console.log("error in results ");
           res.status(200).send(error)
       }
       else {
           res.status(200).send(results);
       };
   });
});

router.post('/deleteProfile',  function (req, res, next) {
    kafka.make_request('delete_profile',req.body, function(error,results){
       if (error) {
           console.log("error in results ");
           res.status(200).send(error)
       }
       else {
           res.status(200).send(results);
       };
   });
});

//Profile Base W/o redis/Kafka/MongoosePool
router.post('/getProfileDirect',  function (req, res, next) {
    console.log('inside get profile direct',req.body);
    profileModel.find({ email: req.body.email },
        function (error, results) {
            if (error) {
                console.log("error in results ",error);
                res.status(200).send(error);
            }
            else {
                console.log(" getProfileDirect result ",results);
                res.status(200).send(results);
            };
        });
});

// const client = redis.Client;

// //Profile Base W/o redis/Kafka/MongoosePool
// router.post('/getProfileRedis',  function (req, res, next) {
//     console.log('inside get profile redis',req.body);
//     const getProfile = 'user:profile';
//       // Try fetching the result from Redis first in case we have it cached
//       return client.get(getProfile, (err, profile) => {
    
//         // If that key exists in Redis store
//         if (profile) {
    
//             //return res.json({ source: 'cache', data: JSON.parse(photos) })
//                         console.log('Data Returned from Redis GetProfile@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',profile);
//                         res.status(200).send(profile);
//         } else {
//             console.log('Data Not found in  Redis GetProfile--------------------------------------------------------------------------------------');
//             profileModel.find({ email: req.body.email },
//                 function (error, results) {
//                     if (error) {
//                         console.log("error in results ",error);
//                         res.status(200).send(error);
//                     }
//                     else {
//                         client.setex(getProfile, 3600, results)
//                         console.log(" getProfileDirect result ",results);
//                         res.status(200).send(results);
//                     };
//                 });


//         }  })

  
// });

module.exports = router;
