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
      <div
        v-else-if="experts.length === 0"
        class="text-center py-10 text-gray-500"
      >
        No top-rated experts available.
      </div>

      <!-- Experts Grid -->
      <div
        v-else
        class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
      >
        <div
          v-for="expert in experts"
          :key="expert.position"
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
            :src="expert.avatarUrl || '/img/default-avatar.png'"
            alt="Expert Avatar"
            class="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          />

          <h3 class="font-semibold text-lg mb-1">{{ expert.name }}</h3>

          <div class="flex justify-center items-center gap-1 mb-3">
            <span v-for="n in 5" :key="n" class="text-yellow-500">
              <i
                :class="
                  n <= Math.round(expert.rating || 0)
                    ? 'fas fa-star'
                    : 'far fa-star'
                "
              ></i>
            </span>
          </div>

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
          <select
            v-model="newExpert.id"
            class="w-full border rounded px-3 py-2"
          >
            <option value="" disabled>Select an expert</option>
            <option v-for="exp in allExperts" :key="exp.id" :value="exp.id">
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
          <select
            v-model="editExpert.id"
            class="w-full border rounded px-3 py-2"
          >
            <option value="" disabled>Select an expert</option>
            <option v-for="exp in allExperts" :key="exp.id" :value="exp.id">
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
export default {
  name: 'TopRatedExperts',
  data() {
    return {
      loading: false,
      experts: [],

      // Dummy all experts
      allExperts: [
        {
          id: '1',
          name: 'John Doe',
          avatarUrl: '/img/default-avatar.png',
          rating: 5,
        },
        {
          id: '2',
          name: 'Jane Smith',
          avatarUrl: '/img/default-avatar.png',
          rating: 4,
        },
        {
          id: '3',
          name: 'Alice Johnson',
          avatarUrl: '/img/default-avatar.png',
          rating: 5,
        },
        {
          id: '4',
          name: 'Bob Brown',
          avatarUrl: '/img/default-avatar.png',
          rating: 3,
        },
        {
          id: '5',
          name: 'Emma White',
          avatarUrl: '/img/default-avatar.png',
          rating: 4,
        },
      ],

      // Add Expert
      showAddModal: false,
      newExpert: { id: '', position: 1 },

      // Edit Expert
      showEditModal: false,
      editExpert: { position: null, id: '' },
    };
  },
  mounted() {
    this.loadDummyExperts();
  },
  methods: {
    loadDummyExperts() {
      this.loading = true;
      // Prepopulate top-rated experts for demo
      this.experts = [
        { position: 1, ...this.allExperts[0] },
        { position: 2, ...this.allExperts[1] },
        { position: 3, ...this.allExperts[2] },
      ];
      this.loading = false;
    },

    addExpert() {
      const expert = this.allExperts.find((e) => e.id === this.newExpert.id);
      if (!expert) return alert('Select a valid expert');
      this.experts.push({ position: this.newExpert.position, ...expert });
      this.showAddModal = false;
      this.newExpert = { id: '', position: 1 };
    },

    openEditModal(expert) {
      this.editExpert = { ...expert };
      this.showEditModal = true;
    },

    updateExpert() {
      const idx = this.experts.findIndex(
        (e) => e.position === this.editExpert.position
      );
      if (idx !== -1) {
        const updatedExpert = this.allExperts.find(
          (e) => e.id === this.editExpert.id
        );
        this.experts[idx] = {
          position: this.editExpert.position,
          ...updatedExpert,
        };
      }
      this.showEditModal = false;
    },

    deleteExpert(position) {
      if (!confirm(`Delete expert at position ${position}?`)) return;
      this.experts = this.experts.filter((e) => e.position !== position);
    },
  },
};
</script>

<style scoped>
.expert-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.expert-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
</style>
