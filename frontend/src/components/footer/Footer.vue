<template>
  <footer class="bg-[#001BB7] text-white">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex flex-col lg:flex-row justify-between gap-10">
        <!-- Branding with logo -->
        <div class="flex flex-col items-start space-y-4">
          <div class="flex items-center space-x-3">
            <img
              src="@/assets/images/logo.jpg"
              alt="Logo"
              class="h-12 w-12 rounded-full"
            />
            <h1 class="text-4xl font-extrabold text-[#FFD700]">Retok</h1>
          </div>
          <p class="text-gray-200 max-w-sm">
            Connecting researchers and experts to deliver top-notch insights and
            guidance.
          </p>
        </div>

        <!-- Footer links -->
        <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          <div v-for="(section, index) in links" :key="index">
            <h4 class="font-semibold mb-3 text-[#FFD700]">
              {{ section.title }}
            </h4>
            <ul class="space-y-2 text-gray-200">
              <li
                v-for="(link, lIndex) in section.items"
                :key="lIndex"
                class="hover:text-[#FF8040] transition-colors cursor-pointer"
              >
                {{ link }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div
        class="border-t border-blue-500 mt-8 pt-6 text-center text-gray-300 text-sm"
      >
        &copy; 2025 Academin Research. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer links data
const links = [
  {
    title: 'Company',
    items: ['About Us', 'Careers', 'Blog', 'Contact'],
  },
  {
    title: 'Services',
    items: [
      'Research Writing',
      'Data Analysis',
      'Consultations',
      'Market Research',
    ],
  },
  {
    title: 'Resources',
    items: ['Help Center', 'Guides', 'FAQs', 'Case Studies'],
  },
  {
    title: 'Social',
    items: ['Twitter', 'LinkedIn', 'Facebook', 'Instagram'],
  },
];
</script>

<style scoped>
footer {
  font-family: 'Inter', sans-serif;
}

footer h4 {
  letter-spacing: 0.5px;
}

footer p {
  letter-spacing: 0.25px;
}

footer img {
  object-fit: cover;
}
</style>
