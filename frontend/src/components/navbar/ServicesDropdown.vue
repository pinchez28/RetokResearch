<template #MenuItem="{ item }">
  <li class="relative group">
    <!-- Leaf node -->
    <router-link
      v-if="!item.sub"
      :to="'/#' + item.id"
      class="block text-lg px-2 py-1 rounded hover:bg-current hover:text-[#F5F1DC] transition"
      :style="{ color: item.color || '#001BB7' }"
    >
      {{ item.title }}
    </router-link>

    <!-- Parent node -->
    <div v-else class="relative">
      <span
        class="block font-medium px-2 py-1 rounded cursor-pointer hover:text-blue-700"
        :style="{ color: item.color || '#001BB7' }"
      >
        {{ item.title }} →
      </span>
      <ul
        class="absolute left-full top-0 mt-0 ml-1 min-w-[180px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 bg-[#f5f1dc] px-2 py-2"
      >
        <MenuItem
          v-for="subItem in item.sub"
          :key="subItem.id || subItem.title"
          :item="subItem"
        />
      </ul>
    </div>
  </li>
</template>

<script setup>
const services = [
  {
    title: 'Academic Research',
    color: '#001BB7',
    bg: '#dbe4ff',
    sub: [
      { id: 'all-academic-research', title: 'All Academic Research' },
      { id: 'social-sciences', title: 'Social Sciences' },
      { id: 'natural-sciences', title: 'Natural Sciences' },
      {
        title: 'Engineering & Technology',
        sub: [
          { id: 'mechanical', title: 'Mechanical' },
          { id: 'electrical', title: 'Electrical' },
        ],
      },
      { id: 'medical-health', title: 'Medical & Health' },
      { id: 'arts-humanities', title: 'Arts & Humanities' },
    ],
  },
  {
    title: 'Industrial Research',
    color: '#FF8040',
    bg: '#ffe6d6',
    sub: [
      { id: 'all-industrial-research', title: 'All Industrial Research' },
      { id: 'automotive-transport', title: 'Automotive & Transport' },
      { id: 'energy-environment', title: 'Energy & Environment' },
      { id: 'manufacturing-materials', title: 'Manufacturing & Materials' },
      { id: 'ict-digital-tech', title: 'ICT & Digital Tech' },
      { id: 'pharma-biotech', title: 'Pharma & Biotech' },
    ],
  },
];
</script>

<style scoped>
li > span {
  transition: transform 0.2s ease;
}
li.group:hover > span {
  transform: rotate(90deg);
}
</style>
