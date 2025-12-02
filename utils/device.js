// utils/device.js

export const isMobile = () => {
  if (typeof window === 'undefined') {
    return false; // Prevents this from running on the server
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};