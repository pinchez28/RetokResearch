// core/utils/authUtils.js
export const waitForAuth = (authStore, maxWait = 1000) => {
  return new Promise((resolve) => {
    const startTime = Date.now();

    // If already initialized, resolve immediately
    if (authStore.isInitialized) {
      console.log('✅ Auth already initialized');
      resolve(true);
      return;
    }

    const check = () => {
      // If auth store is initialized, resolve
      if (authStore.isInitialized) {
        console.log(
          '✅ Auth store initialized after',
          Date.now() - startTime,
          'ms'
        );
        resolve(true);
        return;
      }

      // If timeout reached, resolve anyway
      if (Date.now() - startTime > maxWait) {
        console.warn('⚠️ Auth initialization timeout after', maxWait, 'ms');
        resolve(false);
        return;
      }

      // Check again
      setTimeout(check, 10);
    };

    // Start checking
    check();
  });
};
