import axios from 'axios';

const backendURL = 'http://localhost:4000';

// Replace with your client credentials
const email = 'tom@email.com';
const password = 'tom123';

async function testNotifications() {
  try {
    // 1️⃣ Log in to get a token
    const loginResp = await axios.post(`${backendURL}/api/auth/login`, {
      email,
      password,
    });

    const token = loginResp.data.token;
    console.log('✅ Login successful. JWT token:', token);

    // 2️⃣ Fetch notifications
    const notificationsResp = await axios.get(
      `${backendURL}/api/notifications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('📬 Notifications:', notificationsResp.data);
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.data);
    } else {
      console.error(err);
    }
  }
}

testNotifications();
