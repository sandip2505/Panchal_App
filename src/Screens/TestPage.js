import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AgeCount from '../component/AgeCount';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { API_BASE_URL, IMAGE_URL } from '@env';
import moment from 'moment';
import { showToast } from '../component/CustomToast';
import RNFetchBlob from 'rn-fetch-blob';
import ProgressBar from 'react-native-progress/Bar';
import api from './api';
import { useTranslation, initReactI18next } from 'react-i18next';

const ProfilePage = () => {
  const [parentsData, setParentsData] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    const final = AsyncStorage.getItem('userData')
      .then(value => {
        if (value) {
          const userData = JSON.parse(value);
          setParentsData(userData);
        }
      })
      .catch(error => {
        console.error('Error in profile page : ', error);
      });

  }, []);


  const requestStoragePermission = async (id) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Downloader App Storage Permission',
          message:
            'Downloader App needs access to your storage' +
            'so you can download files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        downloadFile(id);
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const downloadFile = (id) => {
    const { config, fs } = RNFetchBlob;
    const date = new Date();
    const fileDir = fs.dirs.DownloadDir;

    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          fileDir +
          '/download_' +
          Math.floor(date.getDate() + date.getSeconds() / 2) +
          '.pdf',
        description: 'file download',
      },
      progress: (received, total) => {
        const progress = (received / total) * 100;
        setDownloadProgress(progress);
      },
    })
      .fetch('GET', `YOUR_DOWNLOAD_URL/${id}`, {
        // Update YOUR_DOWNLOAD_URL with your actual download URL
      })
      .then((res) => {
        showToast('success', t('downloadsuccessfully'), 2000);
        setDownloadProgress(0); // Reset progress when download is complete
      })
      .catch((error) => {
        console.error('Download failed:', error);
        setDownloadProgress(0); // Reset progress on download failure
      });
  };

  return (
    <View style={styles.maincontainer}>
      <View style={styles.container}>

        <ScrollView>
          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('invoice')} :</Text>
              <TouchableOpacity
                style={styles.dlfamilybtn}
                onPress={() => requestStoragePermission(parentsData?._id)}
                activeOpacity={0.6}>
                <Text style={styles.dlbtntext}>{t('download')}</Text>
              </TouchableOpacity>
            </View>
            {downloadProgress > 0 && (
              <ProgressBar
                progress={downloadProgress / 100}
                width={null} // Use null for full width
                color={'green'}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    height: '100%',
  },

  container: {
    width: '100%',
    height: '100%',
  },

  name: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  details: {
    backgroundColor: '#edf9ff',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginVertical: 5,
    marginHorizontal: 15,
    shadowColor: 'black',
    elevation: 3,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  label: {
    alignItems: 'flex-start',
    flexBasis: '40%',
    fontSize: 17,
    color: 'black',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  dlfamilybtn: {
    height: 35,
    backgroundColor: '#68b300',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'gray',
    elevation: 3,
    width: '48%',
  },

});

export default ProfilePage;
