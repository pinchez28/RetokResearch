import bcrypt from 'bcryptjs';

const password = 'Admin@123'; // your admin password

const generateHash = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  console.log('Hashed password:', hashed);
};

generateHash();

// db.users.insertOne({
//   email: "admin@email.com",
//   password: " $2a$10$Bbll3s9Z2jcOgVdnnM.uJ.n8uvWR72NhjkEtKdrEGLZg/rhfZ4ZKC",
//   role: "Admin",
//   profile: null,
//   createdAt: new Date(),
//   updatedAt: new Date()
// })
