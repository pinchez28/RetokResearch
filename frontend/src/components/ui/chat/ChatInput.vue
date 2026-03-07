<template>
  <div
    class="chat-input flex items-center gap-3 w-full p-3 rounded-xl shadow-lg bg-primary-900"
  >
    <input
      ref="inputRef"
      v-model="text"
      type="text"
      class="chat-input__field flex-1 h-12 px-4 rounded-lg border border-primary-800 bg-primary-700 text-accent-500 placeholder-accent-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      placeholder="Type a message…"
      :disabled="!canSend && adminMode"
      @keydown.enter.prevent="submit"
    />

    <button
      class="chat-input__send h-12 px-4 rounded-lg font-semibold bg-gradient-to-tr from-accent-500 to-accent-700 text-primary-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg border border-accent-600 shadow-sm"
      :disabled="!canSend"
      @click="submit"
    >
      <span v-if="!sending">Send</span>
      <span
        v-else
        class="spinner w-4 h-4 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"
      ></span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  adminMode: { type: Boolean, default: false },
});

const emit = defineEmits(["send"]);

const text = ref("");
const sending = ref(false);
const inputRef = ref(null);

const canSend = computed(() => {
  return !props.adminMode && text.value.trim().length > 0 && !sending.value;
});

const submit = async () => {
  if (!canSend.value) return;

  sending.value = true;
  emit("send", text.value.trim());
  text.value = "";

  setTimeout(() => {
    sending.value = false;
    inputRef.value?.focus();
  }, 150);
};

onMounted(() => {
  inputRef.value?.focus();
});
</script>

<style scoped>
/* Spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}
</style>
