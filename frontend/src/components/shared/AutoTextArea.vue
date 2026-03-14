<template>
  <textarea
    ref="textarea"
    v-model="localValue"
    @input="resize"
    rows="1"
    class="w-full resize-none overflow-hidden"
  ></textarea>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const textarea = ref(null);
const localValue = ref(props.modelValue);

watch(localValue, (val) => {
  emit("update:modelValue", val);
});

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val;
  }
);

const resize = async () => {
  await nextTick();
  const el = textarea.value;
  if (!el) return;

  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
};

onMounted(resize);
</script>
