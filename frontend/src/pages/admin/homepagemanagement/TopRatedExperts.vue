<template>
  <section class="top-rated-experts py-10">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-bold mb-6 text-center">Top Rated Experts</h2>

      <!-- Add Expert Button -->
      <div class="text-center mb-6">
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Add Top Expert
        </button>
      </div>

      <!-- Loading / Empty -->
      <div v-if="loading" class="text-center py-10 text-gray-500">
        Loading top experts...
      </div>
      <div v-else-if="experts.length === 0" class="text-center py-10 text-gray-500">
        No top-rated experts available.
      </div>

      <!-- Experts Grid -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <div
          v-for="expert in experts"
          :key="expert._id"
          class="expert-card rounded-xl p-5 shadow-lg text-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 relative"
        >
          <!-- Delete Button -->
          <button
            @click="deleteExpert(expert.position)"
            class="absolute top-2 right-2 text-red-500 hover:text-red-700"
            title="Delete"
          >
            <i class="fas fa-trash"></i>
          </button>

          <img
            :src="expert.meta?.avatarUrl || '/img/default-avatar.png'"
            alt="Expert Avatar"
            class="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          />

          <h3 class="font-semibold text-lg mb-1">{{ expert.meta?.name }}</h3>

          <div class="flex justify-center items-center gap-1 mb-3">
            <span v-for="n in 5" :key="n" class="text-yellow-500">
              <i
                :class="
                  n <= Math.round(expert.meta?.rating || 0)
                    ? 'fas fa-star'
                    : 'far fa-star'
                "
              ></i>
            </span>
          </div>

          <router-link
            :to="`/experts/${expert.expertId}`"
            class="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          >
            View Profile
          </router-link>

          <!-- Edit Button -->
          <button
            @click="openEditModal(expert)"
            class="mt-3 block w-full bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition text-sm"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Add Expert Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-96">
        <h3 class="text-lg font-semibold mb-4">Add Top Expert</h3>

        <div class="mb-4">
          <label class="block mb-1 font-medium">Expert</label>
          <select v-model="newExpert.expertId" class="w-full border rounded px-3 py-2">
            <option value="" disabled>Select an expert</option>
            <option v-for="exp in allExperts" :key="exp._id" :value="exp._id">
              {{ exp.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block mb-1 font-medium">Position (1–5)</label>
          <input
            type="number"
            v-model.number="newExpert.position"
            min="1"
            max="5"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <div class="flex justify-end gap-2">
          <button
            @click="showAddModal = false"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="addExpert"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Expert Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-96">
        <h3 class="text-lg font-semibold mb-4">
          Edit Top Expert (Position {{ editExpert.position }})
        </h3>

        <div class="mb-4">
          <label class="block mb-1 font-medium">Expert</label>
          <select v-model="editExpert.expertId" class="w-full border rounded px-3 py-2">
            <option value="" disabled>Select an expert</option>
            <option v-for="exp in allExperts" :key="exp._id" :value="exp._id">
              {{ exp.name }}
            </option>
          </select>
        </div>

        <div class="flex justify-end gap-2">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="updateExpert"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "@/utils/api.js"; // your axios instance

export default {
  name: "TopRatedExperts",
  data() {
    return {
      experts: [],
      loading: true,
      allExperts: [],

      // Add Expert
      showAddModal: false,
      newExpert: {
        expertId: "",
        position: 1,
      },

      // Edit Expert
      showEditModal: false,
      editExpert: {
        position: null,
        expertId: "",
      },
    };
  },
  async mounted() {
    await this.fetchExperts();
    await this.fetchAllExperts();
  },
  methods: {
    async fetchExperts() {
      this.loading = true;
      try {
        const res = await axios.get("/top-rated-experts");
        this.experts = res.data.experts || [];
      } catch (err) {
        console.error("Failed to load top experts", err);
      } finally {
        this.loading = false;
      }
    },
    async fetchAllExperts() {
      try {
        const res = await axios.get("/experts"); // returns all experts for dropdown
        this.allExperts = res.data.experts || [];
      } catch (err) {
        console.error("Failed to fetch all experts", err);
      }
    },
    // Add Expert
    async addExpert() {
      try {
        await axios.post("/top-rated-experts", this.newExpert);
        this.showAddModal = false;
        this.newExpert = { expertId: "", position: 1 };
        await this.fetchExperts();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to add expert");
      }
    },
    // Open Edit Modal
    openEditModal(expert) {
      this.editExpert = {
        position: expert.position,
        expertId: expert.expertId,
      };
      this.showEditModal = true;
    },
    // Update Expert
    async updateExpert() {
      try {
        await axios.put(`/top-rated-experts/${this.editExpert.position}`, {
          expertId: this.editExpert.expertId,
        });
        this.showEditModal = false;
        await this.fetchExperts();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to update expert");
      }
    },
    // Delete Expert
    async deleteExpert(position) {
      if (!confirm(`Are you sure you want to remove expert from position ${position}?`))
        return;
      try {
        await axios.delete(`/top-rated-experts/${position}`);
        await this.fetchExperts();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete expert");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.expert-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
}
</style>
