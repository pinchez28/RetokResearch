import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askPassword = () => {
  return new Promise((resolve) => {
    rl.question('Enter admin password: ', (password) => {
      resolve(password);
    });
  });
};

const generateHash = async () => {
  try {
    const password = await askPassword();
    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);

    console.log('\nGenerated Admin Password Hash:\n');
    console.log(hash);
    console.log('\nUse this hash in mongosh when creating the admin user.\n');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
};

generateHash();

// db.users.insertOne({
//   name: "Platform Admin",
//   email: "admin@retok.com",
//   password: "$2a$10$FNLz4z06uRTHro3U7YW8SOiPt23k07p3ZfAv8E1UGs6bdrzYUr2g2",Admin@Supper_2000!
//   role: "Admin",
//   isEmailVerified: true,
//   createdAt: new Date(),
//   updatedAt: new Date()
// });
