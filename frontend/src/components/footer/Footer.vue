<template>
  <footer class="bg-[#001BB7] text-white">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex flex-col lg:flex-row justify-between gap-12">
        <!-- Branding -->
        <div class="flex flex-col items-start space-y-4 w-full lg:w-1/3">
          <div class="flex items-center space-x-3">
            <img
              src="@/assets/images/logo.jpg"
              alt="Logo"
              class="h-12 w-12 rounded-full"
            />
            <h1 class="text-4xl font-extrabold text-[#FFD700]">Retok</h1>
          </div>
          <p class="text-gray-200 leading-relaxed">
            Connecting researchers and experts to deliver top-notch insights and
            guidance.
          </p>
        </div>

        <!-- Footer links evenly distributed -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 w-full"
        >
          <div v-for="(section, index) in links" :key="index">
            <h4
              class="font-semibold mb-3 text-[#FFD700] flex items-center gap-2"
            >
              <!-- icon only for Contacts & Social -->
              <component
                :is="section.icon"
                v-if="section.icon"
                class="w-4 h-4"
              />
              {{ section.title }}
            </h4>

            <ul class="space-y-2 text-gray-200">
              <li
                v-for="(item, lIndex) in section.items"
                :key="lIndex"
                class="hover:text-[#FF8040] transition-colors cursor-pointer flex items-center gap-2"
              >
                <component :is="item.icon" v-if="item.icon" class="w-4 h-4" />
                {{ item.label }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div
        class="border-t border-blue-500 mt-8 pt-6 text-center text-gray-300 text-sm"
      >
        &copy; 2025 RETOK Researchers. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
import {
  Phone,
  Mail,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
} from 'lucide-vue-next';

const links = [
  {
    title: 'Company',
    items: [
      { label: 'About Us' },
      { label: 'Careers' },
      { label: 'Blog' },
      { label: 'Contact' },
    ],
  },
  {
    title: 'Services',
    items: [
      { label: 'Research Writing' },
      { label: 'Data Analysis' },
      { label: 'Consultations' },
      { label: 'Market Research' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Help Center' },
      { label: 'Guides' },
      { label: 'FAQs' },
      { label: 'Case Studies' },
    ],
  },
  {
    title: 'Social',
    icon: Twitter,
    items: [
      { label: 'Twitter', icon: Twitter },
      { label: 'LinkedIn', icon: Linkedin },
      { label: 'Facebook', icon: Facebook },
      { label: 'Instagram', icon: Instagram },
    ],
  },
  {
    title: 'Contacts',
    icon: Phone,
    items: [
      { label: '0700000000', icon: Phone },
      { label: 'admin@retok.ke', icon: Mail },
    ],
  },
];
</script>

<style scoped>
footer {
  font-family: 'Inter', sans-serif;
}
</style>
