import { ref, onMounted } from 'vue';

export function useScrollAnimation() {
  const isVisible = ref(false);
  const elRef = ref(null);

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (elRef.value) {
      observer.observe(elRef.value);
    }
  });

  return { elRef, isVisible };
}

