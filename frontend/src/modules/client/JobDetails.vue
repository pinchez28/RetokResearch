<template>
  <div class="job-details">
    <!-- Loading -->
    <div v-if="loading" class="loading">Loading job details...</div>

    <!-- Error -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <!-- Job Content -->
    <div v-else-if="job">
      <h1 class="title">{{ job.title }}</h1>

      <div class="meta">
        <span class="status">Status: {{ job.status }}</span>
        <span v-if="job.budget">Budget: {{ job.budget }}</span>
        <span v-if="job.deadline">Deadline: {{ formatDate(job.deadline) }}</span>
      </div>

      <section class="section">
        <h3>Description</h3>
        <p>{{ job.description }}</p>
      </section>

      <!-- Applications -->
      <section class="section" v-if="job.applications.length">
        <h3>Expert Applications</h3>

        <div v-for="app in job.applications" :key="app._id" class="application">
          <div class="expert">
            <strong>{{ app.expert.name }}</strong>
            <span>{{ app.expert.email }}</span>
          </div>

          <div class="proposal">
            <p>{{ app.coverLetter }}</p>
          </div>

          <button class="hire-btn" @click="hireExpert(app)" :disabled="submitting">
            Hire Expert
          </button>
        </div>
      </section>

      <!-- No applications -->
      <p v-else class="muted">No applications yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { clientApi } from "@/core/api/http.js";

/* ---------------- ROUTER ---------------- */
const route = useRoute();
const router = useRouter();
const jobId = route.params.jobId;

/* ---------------- STATE ---------------- */
const job = ref(null);
const loading = ref(false);
const submitting = ref(false);
const error = ref(null);

/* ---------------- HELPERS ---------------- */
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

/* ---------------- LOAD JOB ---------------- */
const loadJob = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data } = await clientApi.getJobById(jobId);

    if (!data?.success || !data.job) {
      throw new Error(data?.message || "Job not found");
    }

    const j = data.job;

    job.value = {
      _id: j._id,
      title: j.title || "",
      description: j.description || "",
      status: j.status || "",

      deadline: j.deadline || null,
      applications: (j.applications || []).map((app) => ({
        _id: app._id,
        coverLetter: app.coverLetter || "",
        expert: {
          _id: app.expertSnapshot?._id,
          name: app.expertSnapshot?.name || "Unknown",
          email: app.expertSnapshot?.email || "",
        },
      })),
    };
  } catch (err) {
    console.error("Load job error:", err);
    error.value = err.message || "Failed to load job";
  } finally {
    loading.value = false;
  }
};

/* ---------------- ACTIONS ---------------- */
const hireExpert = async (application) => {
  const confirm = await Swal.fire({
    title: "Hire this expert?",
    text: `Hire ${application.expert.name} for this job?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, hire",
  });

  if (!confirm.isConfirmed) return;

  submitting.value = true;

  try {
    const { data } = await clientApi.hireExpert(jobId, {
      proposalId: application._id,
    });

    if (!data.success) {
      throw new Error(data.message || "Failed to hire expert");
    }

    Swal.fire("Success", "Expert hired successfully", "success");

    // Redirect to tracking / projects
    router.push({ name: "JobTracking", params: { jobId } });
  } catch (err) {
    console.error("Hire error:", err);
    Swal.fire("Error", err.message || "Failed to hire expert", "error");
  } finally {
    submitting.value = false;
  }
};

/* ---------------- INIT ---------------- */
onMounted(loadJob);
</script>

<style scoped>
.job-details {
  max-width: 900px;
  margin: 0 auto;
}

.loading,
.error,
.muted {
  padding: 1rem;
  color: #666;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.meta span {
  margin-right: 1rem;
  font-size: 0.9rem;
  color: #555;
}

.section {
  margin-top: 1.5rem;
}

.application {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 6px;
}

.hire-btn {
  margin-top: 0.5rem;
}
</style>
