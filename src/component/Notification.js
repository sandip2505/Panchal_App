// import React from 'react'
// import PushNotification from 'react-native-push-notification';
// import messaging from '@react-native-firebase/messaging';

// const Notification = () => {
//     useEffect(() => {
//         messaging().requestPermission()
//             .then(() => {
//                 return messaging().getToken();
//             })
//             .then(token => {
//                 console.log('FCM Token:', token);
//             })
//             .catch(error => {
//                 console.log('FCM Permission/Token Error:', error);
//             });

//         PushNotification.configure({
//             onRegister: function (token) {
//                 console.log('TOKEN:', token);
//             },
//             onNotification: function (notification) {
//                 console.log('NOTIFICATION:', notification);
//             },
//             popInitialNotification: true,
//             requestPermissions: true,
//         });

//         const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
//             console.log('FCM Message received:', remoteMessage);
//         });

//         return () => {
//             unsubscribeOnMessage();
//         };
//     }, []);
//     return (
//         <Text>Notification</Text>
//     )
// }

// export default Notification