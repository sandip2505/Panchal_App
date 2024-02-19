import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import { OrdersProvider } from './src/context/AppContext';

console.log("index.js file is running...");
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
messaging().getInitialNotification(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  
AppRegistry.registerComponent(appName, () => App);




