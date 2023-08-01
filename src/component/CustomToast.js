import React from 'react';
import Toast, {BaseToast} from 'react-native-toast-message';

export const showToast = (type, message1, message2, duration = 2000) => {
  Toast.show({
    type,
    text1: message1,
    text2: message2,
    visibilityTime: duration,
    autoHide: true,
  });
};
