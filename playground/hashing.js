const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc123!';
// bcrypt.genSalt(10, (err, salt)=> {
//     bcrypt.hash(password, salt, (err, hashedPassword)=> {
//         console.log(hashedPassword);
//     });
// });

var hashedPassword = '$2a$10$yaLn9pUTEpTHQ46lv3kQGOaAPXcsRlO0xTE1WCV4md821F9OO7/9K';
bcrypt.compare(password, hashedPassword, (err, result)=>{
    console.log(result);
});

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, "123abc");
// console.log(token);
// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

