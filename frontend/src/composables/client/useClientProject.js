import { ref } from 'vue';
import { clientApi } from '@/core/api/http.js';
import Swal from 'sweetalert2';

export function useClientProjects() {
  /* ---------------- STATE ---------------- */
  const projects = ref([]);
  const loading = ref(false);

  /* ---------------- HELPERS ---------------- */
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');

  /* ---------------- FETCH PROJECTS ---------------- */
  const fetchProjects = async () => {
    loading.value = true;
    try {
      const { data } = await clientApi.getProjects();
      projects.value = data?.data || [];
      return projects.value;
    } catch (err) {
      console.error('[useClientProjects] Failed to fetch projects', err);
      Swal.fire('Error', 'Failed to load projects', 'error');
      projects.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  };

  return {
    projects,
    loading,
    fetchProjects,
    formatDate,
  };
}
