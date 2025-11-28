<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bell } from 'lucide-vue-next';
import { socket } from '@/utils/socket.js'; // import socket instance
import api from '@/utils/api.js';

export default {
  components: { Bell },
  setup() {
    const router = useRouter();

    const showNotifications = ref(false);
    const showUserMenu = ref(false);
    const notifications = ref(0);
    const notificationList = ref([]);

    // Fetch historical notifications from backend
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/client/notifications'); // new API endpoint
        notificationList.value = res.data || [];
        notifications.value = notificationList.value.length;
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    onMounted(() => {
      fetchNotifications();

      // Connect socket
      socket.connect();

      // Listen for new notifications from backend
      socket.on('client:new_notification', (data) => {
        notificationList.value.unshift(data.message);
        notifications.value += 1;
      });
    });

    onUnmounted(() => {
      socket.off('client:new_notification');
      socket.disconnect();
    });

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      showUserMenu.value = false;
      notifications.value = 0; // reset unread count on open
    };

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      showNotifications.value = false;
    };

    const logout = () => {
      router.push('/login');
    };

    return {
      notifications,
      notificationList,
      showNotifications,
      showUserMenu,
      toggleNotifications,
      toggleUserMenu,
      logout,
    };
  },
};
</script>
