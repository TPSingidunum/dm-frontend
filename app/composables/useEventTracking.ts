export const useEventTracking = () => {
  // In a real application, you would get the user ID from authentication
  // For now, we'll use a simple approach with localStorage
  const getUserId = () => {
    if (import.meta.client) {
      let userId = localStorage.getItem('demo_user_id');
      if (!userId) {
        // Generate a random user ID for demo purposes
        userId = Math.floor(Math.random() * 10000).toString();
        localStorage.setItem('demo_user_id', userId);
      }
      return parseInt(userId);
    }
    return 1; // Default for SSR
  };

  const trackEvent = async (productId: number, eventType: 'view' | 'add_to_cart' | 'purchase') => {
    try {
      await $fetch('/api/events/track', {
        method: 'POST',
        body: {
          user_id: getUserId(),
          product_id: productId,
          event_type: eventType
        }
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  return {
    getUserId,
    trackEvent
  };
};
