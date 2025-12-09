<template>
  <div class="bg-white p-8 rounded-3xl shadow-2xl">
    <h2 class="text-3xl font-bold text-[#001bb7] mb-4">Your Profile</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <p class="font-semibold text-gray-700 mb-1">Full Name</p>
        <p class="text-gray-600">{{ user.name }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-700 mb-1">Email</p>
        <p class="text-gray-600">{{ user.email }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-700 mb-1">Phone</p>
        <p class="text-gray-600">{{ user.phone }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-700 mb-1">Specialization</p>
        <p class="text-gray-600">{{ user.specialization }}</p>
      </div>
      <div class="md:col-span-2">
        <p class="font-semibold text-gray-700 mb-1">Bio</p>
        <p class="text-gray-600">{{ user.bio }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'));
</script>

