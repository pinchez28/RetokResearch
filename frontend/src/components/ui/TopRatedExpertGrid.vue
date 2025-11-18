<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto"
  >
    <TopRatedExpertCard
      v-for="expert in experts"
      :key="expert._id"
      :id="expert._id"
      :name="expert.name"
      :role="expert.role"
      :photo="expert.photo"
      :rating="expert.rating"
      @viewProfile="viewProfile"
    />
  </div>
</template>

<script setup>
import TopRatedExpertCard from './TopRatedExpertCard.vue';

defineProps({
  experts: Array,
});

const emit = defineEmits(['viewProfile']);

const viewProfile = (id) => {
  emit('viewProfile', id);
};
</script>
