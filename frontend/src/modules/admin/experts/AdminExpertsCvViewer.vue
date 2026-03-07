<template>
  <div class="admin-expert-cv-viewer p-4">
    <h2 class="text-xl font-semibold mb-4">Expert CV</h2>
    <ExpertCvViewer :cv-url="expertCvUrl" />
  </div>
</template>

<script>
import ExpertCvViewer from "@/components/ui/ExpertCvViewer.vue";

export default {
  components: { ExpertCvViewer },
  props: {
    expertCvUrl: {
      type: String,
      required: true,
    },
  },
};
</script>
