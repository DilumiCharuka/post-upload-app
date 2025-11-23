// hashPassword.js
const bcrypt = require('bcrypt');

const password = '1234'; // your admin password

bcrypt.hash(password, 10, (err, hash) => {
  if(err) throw err;
  console.log('Hashed password:', hash);
});
