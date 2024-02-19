import React from 'react';
import {View, Modal, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';

const CustomModal = ({showModal, setShowModal, onConfirm, Title, Message}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.centeredView}>
      <Modal
        // transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitleText}>{Title}</Text>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalTextMessage}>{Message}</Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setShowModal(false)}>
                <Text style={styles.textStyle}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => {
                  setShowModal(false);
                  onConfirm();
                }}>
                <Text style={styles.textStyle}>{t('yes')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  modalView: {
    width: '80%',
    height: '25%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },

  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    // position: 'absolute',
    // bottom: 0,
  },

  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginVertical: 15,
    marginHorizontal: 5,
  },

  buttonCancel: {
    backgroundColor: '#ff2626',
    width: '45%',
  },

  buttonConfirm: {
    backgroundColor: '#2196F3',
    width: '45%',
  },

  textStyle: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 1,
  },

  modalTitleText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
    fontSize: 25,
    paddingVertical: 5
  },

  modalTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalTextMessage: {
    color: '#000',
    textAlign: 'center',
    fontSize: 19,
  },
});
