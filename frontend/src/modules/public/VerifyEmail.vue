<template>
  <div
    class="min-h-screen flex items-center justify-center bg-primary-900 text-primary-200"
  >
    <div class="bg-primary-800 p-10 rounded-2xl text-center space-y-4 max-w-md">
      <h1 class="text-3xl font-bold text-accent-400">Verify Your Email</h1>

      <p class="text-primary-300">
        We have sent a verification link to your email address. Please check
        your inbox and click the link to activate your account.
      </p>

      <router-link
        to="/login"
        class="inline-block mt-4 text-accent-400 font-semibold hover:underline"
      >
        Back to Login
      </router-link>
    </div>
  </div>
</template>
