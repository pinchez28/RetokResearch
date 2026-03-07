<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-semibold">My Projects</h1>

    <!-- Loading Spinner -->
    <Spinner v-if="loading" />

    <!-- Empty State -->
    <EmptyState v-else-if="projects.length === 0" message="No projects found." />

    <!-- Projects Cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in projects"
        :key="project._id"
        class="bg-white rounded-2xl shadow p-5 flex flex-col justify-between"
      >
        <!-- Card Header -->
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ project.title }}
          </h2>
          <p class="text-sm text-gray-500">{{ project.description }}</p>
        </div>

        <!-- Card Info -->
        <div class="mt-4 space-y-2 text-sm text-gray-700">
          <!-- Expert Info: first accepted application -->
          <div>
            <span class="font-medium">Expert:</span>
            {{
              project.expert?.name ||
              project.applications[0]?.expert?.name ||
              "Unassigned"
            }}
          </div>
          <div>
            <span class="font-medium">Specialization:</span>
            {{
              project.expert?.specialization ||
              project.applications[0]?.expert?.specialization ||
              "N/A"
            }}
          </div>

          <!-- Status -->
          <div>
            <span class="font-medium">Status:</span>
            <StatusBadge :status="project.status" />
          </div>

          <!-- Deadline -->
          <div>
            <span class="font-medium">Deadline:</span>
            {{ formatDate(project.deadline) }}
          </div>

          <!-- Delivered Attachments -->
          <div v-if="project.deliveredWorkAttachments?.length">
            <span class="font-medium">Attachments:</span>
            <ul class="list-disc list-inside">
              <li v-for="file in project.deliveredWorkAttachments" :key="file.url">
                <a :href="file.url" target="_blank" class="text-blue-600 underline">{{
                  file.name
                }}</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="mt-4 flex justify-end">
          <BaseButton @click="viewDetails(project._id)" variant="primary" size="sm">
            View Details
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useClientProjects } from "@/composables/client/useClientProject";

import BaseButton from "@/components/ui/BaseButton.vue";
import Spinner from "@/components/shared/Spinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";

export default {
  name: "ProjectsCards",
  components: {
    BaseButton,
    Spinner,
    EmptyState,
    StatusBadge,
  },
  setup() {
    const { projects, loading, fetchProjects, formatDate } = useClientProjects();

    const router = useRouter();

    const viewDetails = (projectId) => {
      router.push({
        name: "ProjectDetails",
        params: { projectId },
      });
    };

    onMounted(fetchProjects);

    return {
      projects,
      loading,
      formatDate,
      viewDetails,
    };
  },
};
</script>

<style scoped>
/* Card hover effect */
div[role="card"] {
  transition: transform 0.2s, box-shadow 0.2s;
}
div[role="card"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
