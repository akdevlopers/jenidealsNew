import axiosInstance from '../lib/axios';

/**
 * Fetch user notifications
 * @param {string} userId - User ID
 * @returns {Promise} Notifications list
 */
export const getNotifications = async (userId) => {
  try {
    const endpoint = `/notifications?user_id=${userId}&userId=${userId}`;
    
    const response = await axiosInstance.post(endpoint, {
      user_id: userId,
      userId: userId
    });
    
    if (response.status) {
      const notifications = response.Data || response.data?.Data || response.data || [];
      return notifications;
    } else {
      throw new Error(response.message || 'Failed to fetch notifications');
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID
 * @returns {Promise} Response
 */
export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const endpoint = `/notification-read`;
    
    const response = await axiosInstance.post(endpoint, {
      notification_id: notificationId,
      notificationId: notificationId,
      user_id: userId,
      userId: userId
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @param {string} userId - User ID
 * @returns {Promise} Response
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const endpoint = `/notifications-read-all`;
    
    const response = await axiosInstance.post(endpoint, {
      user_id: userId,
      userId: userId
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID
 * @returns {Promise} Response
 */
export const deleteNotification = async (notificationId, userId) => {
  try {
    const endpoint = `/notification-delete`;
    
    const response = await axiosInstance.post(endpoint, {
      notification_id: notificationId,
      notificationId: notificationId,
      user_id: userId,
      userId: userId
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};
