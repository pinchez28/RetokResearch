<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 py-10 text-center">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
        @click="close"
      ></div>

      <!-- Modal panel -->
      <div
        class="relative bg-white rounded-2xl text-left overflow-hidden shadow-2xl w-full max-w-2xl"
      >
        <!-- Header -->
        <div
          class="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-between"
        >
          <div class="flex items-center gap-4">
            <div class="p-2 bg-white/20 rounded-lg">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">
                Proposal from {{ proposal?.expert?.name || "Expert" }}
              </h3>
              <p class="text-blue-100 text-sm mt-1">
                Submitted {{ formatFullDate(proposal?.createdAt) }}
              </p>
            </div>
          </div>

          <button
            @click="close"
            class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            ✕
          </button>
        </div>

        <!-- Body -->
        <div class="px-8 py-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <!-- Proposal -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h4 class="font-bold text-gray-800 mb-4">Proposal Details</h4>

            <div class="flex justify-between mb-4">
              <span class="text-gray-600 font-semibold">Quoted Amount</span>
              <span class="font-bold">
                KES {{ Number(proposal?.quote || 0).toLocaleString() }}
              </span>
            </div>

            <div>
              <p class="text-gray-600 font-semibold mb-2">Proposal Message</p>
              <div
                class="p-4 bg-white rounded-lg border border-gray-200 whitespace-pre-line text-gray-700"
              >
                {{ proposal?.proposalText || "No proposal text provided." }}
              </div>
            </div>
          </div>

          <!-- Expert Info -->
          <div class="border border-gray-200 rounded-xl p-6">
            <h4 class="font-bold text-gray-800 mb-4">About the Expert</h4>

            <div class="space-y-3 text-sm">
              <div>
                <span class="text-gray-500">Name</span>
                <p class="font-semibold text-gray-800">
                  {{ proposal?.expert?.name || "—" }}
                </p>
              </div>

              <div>
                <span class="text-gray-500">Specialization</span>
                <p class="font-semibold text-gray-800">
                  {{ proposal?.expert?.specialization || "—" }}
                </p>
              </div>

              <div>
                <span class="text-gray-500">Experience</span>
                <p class="font-semibold text-gray-800">
                  {{ proposal?.expert?.experience || 0 }} years
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            @click="close"
            class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl"
          >
            Close
          </button>

          <button
            v-if="!hired"
            @click="$emit('hire', proposal)"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl"
          >
            Hire This Expert
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  proposal: {
    type: Object,
    required: true,
  },
  hired: Boolean,
});

const emit = defineEmits(["close", "hire"]);

const close = () => emit("close");

const formatFullDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-KE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
