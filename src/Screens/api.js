import axios from 'axios';
import { API_BASE_URL, API_KEY } from '@env';
import MaintenanceScreen from './MaintenanceScreen';
import { Alert, StyleSheet } from 'react-native';
import RNExitApp from 'react-native-exit-app';
console.log(API_BASE_URL, 'API_BASE_URL')

const instance = axios.create({
    baseURL: API_BASE_URL, 
});

const handleExit = () => {
    RNExitApp.exitApp();
  };
const createTwoButtonAlert = () =>
Alert.alert('Under Maintenance', "Sorry for the inconvenience, but we're performing some maintenance at the moment. We'll be back online shortly. Thank you for your patience.", [
    {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
    },
    { text: 'OK', onPress: () => handleExit() },
]);


// Add request interceptor
instance.interceptors.request.use(
    (config) => {
        // Do something before the request is sent
        // For example, add headers
        config.headers['x-api-key'] = API_KEY;
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add response interceptor
instance.interceptors.response.use(
    (response) => {
        // Do something with the response data
        // console.log(response, 'response')
        if (response.status === 200) {
            return response;
        } else if (response.status === 500 || response.status === 503 || response.status === 404 || response.status === 400 || response.status === 401 || response.status === 403) {
            createTwoButtonAlert()
        }
  
        
    },
    (error) => {
        console.log(error, 'error')
        // Do something with response error
        return Promise.reject(error);
    }
);


export default instance;
