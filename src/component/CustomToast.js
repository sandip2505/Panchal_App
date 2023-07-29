import React from 'react';
import Toast, { BaseToast } from 'react-native-toast-message';

export const showToast = (type, message, duration = 2000) => {
  Toast.show({
    type,
    text1: message,
    visibilityTime: duration,
    autoHide: true,
  });
};
