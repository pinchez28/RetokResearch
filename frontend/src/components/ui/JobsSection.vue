<template>
  <section class="jobs-section py-6">
    <div v-if="loading" class="text-gray-500">Loading jobs...</div>

    <div
      v-else-if="jobs.length"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <JobCard
        v-for="(job, index) in jobs"
        :key="job._id"
        :job="job"
        :showPricing="true"
        :branchIndex="index"
        :categoryIndex="index"
        @click="$emit('viewJob', job)"
      />
    </div>

    <div v-else class="text-center text-gray-500 mt-10">
      No jobs available for bidding.
    </div>
  </section>
</template>

<script setup>
import JobCard from '@/components/ui/JobCard.vue';

const props = defineProps({
  jobs: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.jobs-section {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
