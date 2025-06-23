import React, {useState, useEffect, useCallback} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackingTransparency from 'react-native-tracking-transparency';

type ConsentDialogProps = {
  onConsentCompleted: () => void;
};

const ConsentDialog = ({onConsentCompleted}: ConsentDialogProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const checkConsent = useCallback(async () => {
    const storedConsent = await AsyncStorage.getItem('trackingConsent');
    if (storedConsent === null) {
      setModalVisible(true);
    } else {
      onConsentCompleted();
    }
  }, [onConsentCompleted]);

  useEffect(() => {
    checkConsent();
  }, [checkConsent]);

  const requestTrackingPermission = async (): Promise<string> => {
    if (Platform.OS === 'ios') {
      try {
        const status = await TrackingTransparency.requestTrackingPermission();
        console.log('Tracking permission status:', status);
        return status;
      } catch (error) {
        console.error('Error requesting tracking permission:', error);
        return 'denied';
      }
    }
    return 'granted';
  };

  const handleAllow = async () => {
    await AsyncStorage.setItem('trackingConsent', 'granted');
    setModalVisible(false);

    // Request tracking permission on iOS
    const trackingStatus = await requestTrackingPermission();
    console.log('Tracking consent granted, permission status:', trackingStatus);

    onConsentCompleted();
  };

  const handleDontAllow = async () => {
    await AsyncStorage.setItem('trackingConsent', 'denied');
    setModalVisible(false);
    console.log('Tracking consent denied');
    onConsentCompleted();
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Dear User</Text>
          <Text style={styles.message}>
            To keep Shape Beats free and provide you with the best experience,
            we rely on personalized ads. Our partners will collect data which
            means you'll see ads that match your interests. Your privacy is our
            priority and your data is handled securely.
          </Text>
          <View style={styles.buttonContainer}>
            {Platform.OS === 'android' ? (
              <>
                <TouchableOpacity
                  onPress={handleDontAllow}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Don't Allow</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAllow} style={styles.button}>
                  <Text style={[styles.buttonText, styles.agreeButton]}>
                    Allow
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={handleAllow} style={styles.button}>
                <Text style={[styles.buttonText, styles.continueButton]}>
                  Continue
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
  message: {
    marginBottom: 15,
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  continueButton: {
    fontWeight: 'bold',
  },
  agreeButton: {
    fontWeight: 'bold',
  },
});

export default ConsentDialog;
