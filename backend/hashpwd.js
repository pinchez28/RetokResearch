// hashpwd.js
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter admin password: ', async (password) => {
  try {
    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters.');
      rl.close();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log('\n✅ Password hash generated:\n');
    console.log(hash);
  } catch (err) {
    console.error(err);
  } finally {
    rl.close();
  }
});
