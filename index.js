import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage.data.newsId);
});
messaging().getInitialNotification(async remoteMessage => {
  console.log('Message handled in the background getInitialNotification', remoteMessage);
});


AppRegistry.registerComponent(appName, () => App);




