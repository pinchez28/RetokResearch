<template>
  <div class="expert-cv-viewer">
    <CvViewer :cv-url="cvUrl" />
  </div>
</template>

<script>
import CvViewer from "./CvViewer.vue";

export default {
  name: "ExpertCvViewer",
  components: { CvViewer },
  props: {
    cvUrl: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.expert-cv-viewer {
  width: 100%;
  height: 100%;
}
</style>
