export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  navigator.serviceWorker.register(
    `${import.meta.env.BASE_URL}service-worker.js`
  );
};
