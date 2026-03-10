<template>
  <div
    class="min-h-screen flex items-center justify-center bg-primary-900 text-primary-200"
  >
    <div class="bg-primary-800 p-10 rounded-2xl text-center space-y-4 max-w-md">
      <h1 class="text-3xl font-bold text-green-400">Email Verified</h1>

      <p class="text-primary-300">
        Your email has been successfully verified. You can now log in.
      </p>

      <router-link
        to="/login"
        class="btn-primary mt-4 inline-block text-accent-400"
      >
        Go to Login
      </router-link>
    </div>
  </div>
</template>
