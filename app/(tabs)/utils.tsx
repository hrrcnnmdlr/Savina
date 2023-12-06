// utils.js
import { Vibration } from 'react-native';

export const vibrate = () => {
  Vibration.vibrate([500, 500, 500]); // Vibrate for 500ms, pause for 500ms, vibrate for 500ms
};