<template>
  <div
    class="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6"
  >
    <h1 class="text-3xl font-bold mb-6">Forgot Password</h1>
    <form class="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          class="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
      >
        Reset Password
      </button>
    </form>
  </div>
</template>

<script setup></script>

<style scoped></style>

