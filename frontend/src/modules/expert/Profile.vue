<template>
  <div class="p-6 bg-[#F5F1DC] min-h-screen">
    <h1 class="text-2xl font-bold mb-4">My Profile</h1>

    <div class="bg-white p-6 rounded shadow-md space-y-4">
      <!-- Photo -->
      <div class="flex items-center space-x-4">
        <img
          :src="previewPhoto || '/default-avatar.png'"
          alt="Profile Photo"
          class="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
        />
        <input type="file" @change="(e) => handleFileChange(e, 'photo')" />
      </div>

      <!-- Specialization -->
      <div>
        <label class="font-semibold">Specialization</label>
        <input
          v-model="form.specialization"
          placeholder="Enter your specialization"
          class="w-full mt-1 p-2 border rounded"
        />
      </div>

      <!-- Bio -->
      <div>
        <label class="font-semibold">Bio</label>
        <textarea
          v-model="form.bio"
          placeholder="Enter your bio"
          class="w-full mt-1 p-2 border rounded"
        ></textarea>
      </div>

      <!-- Experience -->
      <div>
        <label class="font-semibold">Experience (years)</label>
        <input
          type="number"
          v-model.number="form.experience"
          class="w-full mt-1 p-2 border rounded"
        />
      </div>

      <!-- Education -->
      <div>
        <label class="font-semibold">Education</label>
        <input
          v-model="form.education"
          placeholder="Enter your education"
          class="w-full mt-1 p-2 border rounded"
        />
      </div>

      <!-- Certifications -->
      <div>
        <label class="font-semibold">Certifications (comma separated)</label>
        <input
          v-model="certificationsInput"
          @blur="updateCertifications"
          placeholder="Enter certifications"
          class="w-full mt-1 p-2 border rounded"
        />
      </div>

      <!-- CV -->
      <div class="flex items-center space-x-4">
        <button
          @click="openCVViewer"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View CV
        </button>
        <input type="file" @change="(e) => handleFileChange(e, 'cvPdf')" />
      </div>

      <!-- Status -->
      <div>
        <span class="font-semibold">Status:</span>
        <span :class="statusColorClass">{{ profileStatusDisplay }}</span>
      </div>

      <!-- Submit -->
      <div>
        <button
          :disabled="loading"
          @click="submitProfile"
          class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
        >
          {{ loading ? "Submitting..." : "Submit Changes" }}
        </button>
      </div>
    </div>

    <!-- CV Modal -->
    <div
      v-if="showCVModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded w-3/4 h-3/4 overflow-hidden relative">
        <button
          @click="showCVModal = false"
          class="absolute top-2 right-2 text-red-600 font-bold"
        >
          Close
        </button>
        <iframe :src="cvUrl" class="w-full h-full" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import http from "@/core/api/http.js";
import Swal from "sweetalert2";

const loading = ref(false);
const showCVModal = ref(false);
const cvUrl = ref("");
const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// ---------------------------
// PROFILE DATA (Always current)
// ---------------------------
const profileData = reactive({
  specialization: "",
  bio: "",
  experience: 0,
  education: "",
  certifications: [],
  photo: "",
  cvPdf: "",
  status: "",
});

// ---------------------------
// FORM DATA (Tracks edits only)
// ---------------------------
const form = reactive({
  specialization: "",
  bio: "",
  experience: null,
  education: "",
  certifications: [],
  photo: null,
  cvPdf: null,
});

const previewPhoto = ref("");
const certificationsInput = ref("");

// ---------------------------
// COMPUTED
// ---------------------------
const profileStatusDisplay = computed(() => {
  if (profileData.status === "approved") return "Approved";
  if (profileData.status === "rejected") return "Rejected";
  if (profileData.status === "pending_admin_review") return "Pending Review";
  return "";
});

const statusColorClass = computed(() => {
  if (profileData.status === "approved") return "text-emerald-700";
  if (profileData.status === "rejected") return "text-red-700";
  return "text-amber-700";
});

// ---------------------------
// LOAD PROFILE
// ---------------------------
const loadProfile = async () => {
  try {
    const { data } = await http.get("/expert/profile");
    if (!data?.data) return;

    const p = data.data;
    profileData.specialization = p.specialization || "";
    profileData.bio = p.bio || "";
    profileData.experience = p.experience || 0;
    profileData.education = p.education || "";
    profileData.certifications = p.certifications || [];
    profileData.photo = p.photo || "";
    profileData.cvPdf = p.cvPdf || "";
    profileData.status = p.status || "";

    // Preview photo
    previewPhoto.value = profileData.photo;

    // Fill certifications input
    certificationsInput.value = profileData.certifications.join(", ");
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
};

// ---------------------------
// HANDLE FILE UPLOAD
// ---------------------------
const handleFileChange = (e, field) => {
  const file = e.target.files[0];
  if (!file) return;

  if (field === "photo") previewPhoto.value = URL.createObjectURL(file);

  form[field] = file;
};

// ---------------------------
// UPDATE CERTIFICATIONS
// ---------------------------
const updateCertifications = () => {
  form.certifications = certificationsInput.value
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
};

// ---------------------------
// SUBMIT PROFILE (PATCH only changed fields)
// ---------------------------
const submitProfile = async () => {
  loading.value = true;
  try {
    const formData = new FormData();

    // Only append fields that the user changed
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== "" && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

    await http.put("/expert/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    Swal.fire(
      "Submitted!",
      "Your changes have been submitted for admin approval.",
      "success"
    );

    // Reload profile after submit
    Object.keys(form).forEach(
      (key) => (form[key] = key.includes("experience") ? null : "")
    );
    loadProfile();
  } catch (err) {
    console.error("Profile update failed:", err);
    Swal.fire("Failed", err.response?.data?.message || "Profile update failed", "error");
  } finally {
    loading.value = false;
  }
};

// ---------------------------
// CV VIEWER
// ---------------------------
const openCVViewer = () => {
  const pdf = form.cvPdf || profileData.cvPdf;
  cvUrl.value =
    typeof pdf === "string" && !pdf.startsWith("http") ? `${backendBaseUrl}${pdf}` : pdf;
  showCVModal.value = true;
};

onMounted(loadProfile);
</script>
