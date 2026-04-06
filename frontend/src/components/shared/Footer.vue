<template>
  <footer class="bg-primary-900 text-accent-500">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex flex-col lg:flex-row justify-between gap-12">
        <!-- Branding -->
        <div class="flex flex-col items-start space-y-4 w-full lg:w-1/3">
          <div class="flex items-center space-x-3">
            <img
              src="@/assets/images/logo.webp"
              alt="Logo"
              class="h-12 w-12 rounded-full"
            />
            <h1 class="text-4xl font-extrabold text-accent-500">Retok</h1>
          </div>
          <p class="text-gray-300 leading-relaxed">
            Connecting researchers and experts to deliver top-notch insights and guidance.
          </p>
        </div>

        <!-- Footer links -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 w-full">
          <div v-for="(section, index) in links" :key="index">
            <h4 class="font-semibold mb-3 text-accent-500 flex items-center gap-2">
              <component :is="section.icon" v-if="section.icon" class="w-4 h-4" />
              {{ section.title }}
            </h4>

            <ul class="space-y-2 text-gray-300">
              <li
                v-for="(item, lIndex) in section.items"
                :key="lIndex"
                class="hover:text-accent-500 transition-colors cursor-pointer flex items-center gap-2"
              >
                <component :is="item.icon" v-if="item.icon" class="w-4 h-4" />
                {{ item.label }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        class="border-t border-primary-700 mt-8 pt-6 text-center text-gray-400 text-sm"
      >
        &copy; {{ currentYear }} RETOK Researchers. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Phone, Mail, Twitter, Linkedin, Facebook, Instagram } from "lucide-vue-next";

const currentYear = new Date().getFullYear();

const links = [
  {
    title: "Company",
    items: [
      { label: "About Us" },
      { label: "Careers" },
      { label: "Blog" },
      { label: "Contact" },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Research Writing" },
      { label: "Data Analysis" },
      { label: "Consultations" },
      { label: "Market Research" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Help Center" },
      { label: "Guides" },
      { label: "FAQs" },
      { label: "Case Studies" },
    ],
  },
  {
    title: "Social",
    items: [
      { label: "Twitter", icon: Twitter },
      { label: "LinkedIn", icon: Linkedin },
      { label: "Facebook", icon: Facebook },
      { label: "Instagram", icon: Instagram },
    ],
  },
  {
    title: "Contacts",
    items: [
      { label: "0700000000", icon: Phone },
      { label: "admin@retok.ke", icon: Mail },
    ],
  },
];
</script>

<style scoped>
footer {
  font-family: "Inter", sans-serif;
}
</style>
