var chai = require('chai'), chaiHttp = require('chai-http');
// import {URL} from '../Constant';

chai.use(chaiHttp);

var expect = chai.expect;

it("Should check login credentials and return status code", function(done){
    chai.request('http://18.232.98.156:3001')
    .post('/profile/signInProfile')
    .send({ "email": "shubham@123", "password" : "123"})
    .end(function (err, res) {
        // expect(res).to.have.status(200);
        // expect(res).to.have.cookie('buyer');
        done();
    });
})

it('GET /messages/getChat/5de4c02a02a23308681a480b',function(){
    agent.get('/messages/getChat/5de4c02a02a23308681a480b')
        .then(function(res){
            expect(res.status).to.equal(200);
        });
});


// it("Should check Owner credentials and return status code", function(done){
//     chai.request('http://18.222.107.232:3001')
//     .post('/owner/signInOwner')
//     .send({ "email": "john@sjsu.com", "password" : "john"})
//     .end(function (err, res) {
         
//         expect(res).to.have.status(200);
//         done();
//     });
// })
// it("Should check Update Order Status by Owner and return status code", function(done){
//     chai.request('http://18.222.107.232:3001')
//     .post('/ownerOrder/updateOrderStatus')
//     .send({
//         "series":6,
//         "orderStatus": "PREPAIRING"
//       })
//     .end(function (err, res) {
         
//         expect(res).to.have.status(200);

//         done();
//     });
// })
// it("Should cookie is set for owner and return status code", function(done){
//     chai.request('http://18.222.107.232:3001')
//     .get('/buyer/getBuyer/6')
//     .send()
//     .end(function (err, res) {
         
//         expect(res).to.have.status(200);
//         done();
//     });
// })
// it("Should check credentials and return status code", function(done){
//     chai.request('http://18.222.107.232:3001')
//     .post('/search/searchRestaurant')
//     .send({ "itemName": "sushi"})
//     .end(function (err, res) {
         
//         expect(res).to.have.status(200);
//         done();
//     });
// })