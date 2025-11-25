<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12"
  >
    <div
      class="bg-gray-50 p-8 rounded-2xl shadow-lg w-full max-w-4xl space-y-6"
    >
      <h2 class="text-2xl font-bold mb-2 mt-4 text-center">
        Sign Up as Service Provider
      </h2>

      <form
        @submit.prevent="handleSignup"
        enctype="multipart/form-data"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <!-- Name -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Full Name</label>
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
          <label class="block mb-1 font-medium text-gray-700">Email</label>
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
          <label class="block mb-1 font-medium text-gray-700">Phone</label>
          <input
            v-model="form.phone"
            type="tel"
            required
            placeholder="+254 700 000000"
            class="input"
          />
        </div>

        <!-- Profile Photo -->
        <div>
          <label class="block mb-1 font-medium text-gray-700"
            >Profile Photo</label
          >
          <input
            type="file"
            accept="image/*"
            @change="handlePhotoUpload"
            required
            class="input"
          />
        </div>

        <!-- Specialization -->
        <div>
          <label class="block mb-1 font-medium text-gray-700"
            >Specialization</label
          >
          <input
            v-model="form.specialization"
            type="text"
            placeholder="e.g., Data Science"
            class="input"
          />
        </div>

        <!-- Bio -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Bio</label>
          <textarea
            v-model="form.bio"
            rows="3"
            placeholder="Short professional bio"
            class="input"
          ></textarea>
        </div>

        <!-- Experience -->
        <div>
          <label class="block mb-1 font-medium text-gray-700"
            >Experience (years)</label
          >
          <input
            v-model.number="form.experience"
            type="number"
            min="0"
            placeholder="5"
            class="input"
          />
        </div>

        <!-- Education -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Education</label>
          <input
            v-model="form.education"
            type="text"
            placeholder="PhD in Computer Science"
            class="input"
          />
        </div>

        <!-- Certifications -->
        <div>
          <label class="block mb-1 font-medium text-gray-700"
            >Certifications</label
          >
          <input
            v-model="form.certifications"
            type="text"
            placeholder="Comma separated (e.g., AWS, PMP)"
            class="input"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Password</label>
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
          <label class="block mb-1 font-medium text-gray-700"
            >Confirm Password</label
          >
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="Confirm password"
            class="input"
          />
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="md:col-span-2 text-red-500 text-center text-sm"
        >
          {{ error }}
        </div>

        <!-- Login link above submit button -->
        <div class="md:col-span-2 text-center mb-2 text-sm">
          Already have an account?
          <router-link
            to="/login"
            class="text-blue-600 hover:underline font-semibold"
          >
            Login
          </router-link>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="md:col-span-2 w-full bg-green-600 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50 font-semibold"
        >
          <span v-if="loading">Signing up...</span>
          <span v-else>Sign Up</span>
        </button>
      </form>

      <!-- Back to Home link after signup button -->
      <div class="text-center mt-4 text-sm">
        <router-link to="/" class="text-gray-600 hover:underline">
          Back to Home
        </router-link>
      </div>
    </div>
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
  photo: null,
  specialization: '',
  bio: '',
  experience: 0,
  education: '',
  certifications: '',
  password: '',
  confirmPassword: '',
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
    !form.value.photo ||
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

  loading.value = true;

  try {
    const payload = new FormData();
    payload.append('name', form.value.name);
    payload.append('email', form.value.email);
    payload.append('phone', form.value.phone);
    payload.append('photo', form.value.photo);
    payload.append('specialization', form.value.specialization);
    payload.append('bio', form.value.bio);
    payload.append('experience', form.value.experience);
    payload.append('education', form.value.education);

    // Convert certifications to JSON array
    const certArray = form.value.certifications
      ? form.value.certifications.split(',').map((c) => c.trim())
      : [];
    payload.append('certifications', JSON.stringify(certArray));

    payload.append('password', form.value.password);

    const { data } = await axios.post(
      'http://localhost:4000/api/auth/experts/signup',
      payload,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    // Save token and user
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect to expert dashboard
    router.push('/expert');
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
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  outline: none;
  background-color: #f9fafb;
  transition: box-shadow 0.2s, border-color 0.2s, background-color 0.2s;
}
.input:focus {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
  background-color: #ffffff;
}
textarea {
  resize: vertical;
}
</style>
