<template>
  <div class="cv-viewer w-full h-full flex flex-col">
    <div v-if="!cvUrl" class="flex items-center justify-center h-full">
      <p class="text-gray-500">No CV uploaded</p>
    </div>

    <iframe
      v-if="cvUrl"
      :src="cvUrl"
      class="w-full h-[90vh] border rounded"
      frameborder="0"
      allowfullscreen
    ></iframe>

    <div v-if="cvUrl" class="mt-2 flex justify-end">
      <button
        @click="openFullPage"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Open Full Page
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CvViewer",
  props: {
    cvUrl: {
      type: String,
      required: false,
      default: null,
    },
  },
  methods: {
    openFullPage() {
      if (this.cvUrl) {
        window.open(this.cvUrl, "_blank");
      }
    },
  },
};
</script>

<style scoped>
.cv-viewer iframe {
  min-height: 80vh;
}
</style>
