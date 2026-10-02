import { computed } from 'vue';

export const useDevice = () => {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  
  const isMobile = computed(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  });
  
  const isTablet = computed(() => {
    return /iPad|Android(?!.*Mobile)/i.test(userAgent);
  });
  
  const isDesktop = computed(() => {
    return !isMobile.value;
  });

  const getDeviceType = () => {
    if (isTablet.value) return 'tablet';
    if (isMobile.value) return 'mobile';
    return 'desktop';
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    getDeviceType
  };
};
