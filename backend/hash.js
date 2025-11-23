const bcrypt = require('bcryptjs');

async function generateHash() {
  const hash = await bcrypt.hash('adminpassword', 10);
  console.log(hash);
}

// admin password = "1234"

generateHash();
