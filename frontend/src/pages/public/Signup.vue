<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      ```
      <form
        @submit.prevent="handleSignup"
        enctype="multipart/form-data"
        class="space-y-4"
      >
        <!-- Name -->
        <div>
          <label class="block mb-1 font-medium">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="John Doe"
            class="input"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block mb-1 font-medium">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="you@example.com"
            class="input"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block mb-1 font-medium">Phone</label>
          <input
            v-model="form.phone"
            type="tel"
            required
            placeholder="+254 700 000000"
            class="input"
          />
        </div>

        <!-- Role -->
        <div>
          <label class="block mb-1 font-medium">I am a</label>
          <select v-model="form.role" required class="input">
            <option disabled value="">Select role</option>
            <option value="client">Client</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <!-- Expert-specific fields -->
        <div v-if="form.role === 'expert'" class="space-y-4">
          <div>
            <label class="block mb-1 font-medium">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              @change="handlePhotoUpload"
              required
              class="input"
            />
          </div>

          <div>
            <label class="block mb-1 font-medium">Specialization</label>
            <input
              v-model="form.specialization"
              type="text"
              placeholder="e.g., Data Science"
              class="input"
            />
          </div>

          <div>
            <label class="block mb-1 font-medium">Bio</label>
            <textarea
              v-model="form.bio"
              rows="3"
              placeholder="Short professional bio"
              class="input"
            ></textarea>
          </div>

          <div>
            <label class="block mb-1 font-medium">Experience (years)</label>
            <input
              v-model.number="form.experience"
              type="number"
              placeholder="5"
              class="input"
            />
          </div>

          <div>
            <label class="block mb-1 font-medium">Education</label>
            <input
              v-model="form.education"
              type="text"
              placeholder="PhD in Computer Science"
              class="input"
            />
          </div>

          <div>
            <label class="block mb-1 font-medium">Certifications</label>
            <input
              v-model="form.certifications"
              type="text"
              placeholder="Comma separated (e.g., AWS, PMP)"
              class="input"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 font-medium">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="Enter password"
            class="input"
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block mb-1 font-medium">Confirm Password</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="Confirm password"
            class="input"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="text-red-500 text-center text-sm">
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          <span v-if="loading">Signing up...</span>
          <span v-else>Sign Up</span>
        </button>
      </form>
    </div>
    ```
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  name: '',
  email: '',
  phone: '',
  role: '',
  password: '',
  confirmPassword: '',
  photo: null,
  specialization: '',
  bio: '',
  experience: 0,
  education: '',
  certifications: '',
});

const loading = ref(false);
const error = ref('');

const handlePhotoUpload = (e) => {
  const file = e.target.files[0];
  if (file) form.value.photo = file;
};

const handleSignup = async () => {
  error.value = '';

  if (
    !form.value.name ||
    !form.value.email ||
    !form.value.phone ||
    !form.value.role ||
    !form.value.password ||
    !form.value.confirmPassword
  ) {
    error.value = 'Please fill all required fields.';
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match.';
    return;
  }

  if (form.value.role === 'expert' && !form.value.photo) {
    error.value = 'Expert profile photo is required.';
    return;
  }

  loading.value = true;

  try {
    let url = '';
    let payload;
    let config;

    if (form.value.role === 'client') {
      url = 'http://localhost:4000/api/auth/clients/signup';
      payload = {
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
        password: form.value.password,
      };
      config = { headers: { 'Content-Type': 'application/json' } };
    } else {
      url = 'http://localhost:4000/api/auth/experts/signup';
      payload = new FormData();
      payload.append('name', form.value.name);
      payload.append('email', form.value.email);
      payload.append('phone', form.value.phone);
      payload.append('password', form.value.password);
      payload.append('photo', form.value.photo);
      payload.append('specialization', form.value.specialization);
      payload.append('bio', form.value.bio);
      payload.append('experience', form.value.experience);
      payload.append('education', form.value.education);
      payload.append('certifications', form.value.certifications); // backend splits CSV
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }

    const { data } = await axios.post(url, payload, config);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    router.push(form.value.role === 'client' ? '/client' : '/expert');
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || 'Signup failed. Try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  outline: none;
  transition: box-shadow 0.2s;
}
.input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
textarea {
  resize: vertical;
}
</style>
