import React, {useState, useEffect, useCallback} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeGlobalAds} from './adsManager';
import {
  requestTrackingPermission,
  getTrackingStatus,
} from 'react-native-tracking-transparency';

type ConsentDialogProps = {
  onConsentCompleted: () => void;
};

const ConsentDialog = ({onConsentCompleted}: ConsentDialogProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const checkConsent = useCallback(async () => {
    try {
      const storedConsent = await AsyncStorage.getItem('trackingConsent');
      if (storedConsent === null) {
        setModalVisible(true);
      } else {
        await initializeGlobalAds();
        onConsentCompleted();
      }
    } catch (error) {
      setModalVisible(true);
    }
  }, [onConsentCompleted]);

  useEffect(() => {
    checkConsent();
  }, [checkConsent]);

  const handleConsent = async (consent: 'granted' | 'denied') => {
    try {
      await AsyncStorage.setItem('trackingConsent', consent);
      setModalVisible(false);

      if (consent === 'granted' && Platform.OS === 'ios') {
        try {
          const currentStatus = await getTrackingStatus();

          if (currentStatus === 'not-determined') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await requestTrackingPermission();
          }
        } catch (error) {}
      }

      await initializeGlobalAds();
      onConsentCompleted();
    } catch (error) {
      setModalVisible(false);
      onConsentCompleted();
    }
  };

  const handleAllow = () => handleConsent('granted');
  const handleDontAllow = () => handleConsent('denied');

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setModalVisible(false)}>
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Privacy Settings</Text>
            <Text style={styles.subtitle}>Help us improve your experience</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.message}>
              {Platform.OS === 'ios'
                ? "We value your privacy and aim to keep Shape Beats free through personalized ads. You'll see a system dialog next to confirm your choice."
                : 'We use data to provide you with a better experience and keep Shape Beats free through personalized ads. Your data is handled securely, and we prioritize your privacy at all times.'}
            </Text>

            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>
                • Personalized content and ads
              </Text>
              <Text style={styles.bulletPoint}>• Better app experience</Text>
              <Text style={styles.bulletPoint}>• Support app development</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {Platform.OS === 'android' ? (
              <>
                <TouchableOpacity
                  onPress={handleDontAllow}
                  style={[styles.button, styles.declineButton]}>
                  <Text style={[styles.buttonText, styles.declineButtonText]}>
                    Don't Allow
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAllow}
                  style={[styles.button, styles.allowButton]}>
                  <Text style={[styles.buttonText, styles.allowButtonText]}>
                    Allow
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={handleAllow}
                style={[
                  styles.button,
                  styles.allowButton,
                  styles.singleButton,
                ]}>
                <Text style={[styles.buttonText, styles.allowButtonText]}>
                  Continue
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  content: {
    marginBottom: 24,
  },
  message: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  bulletPoints: {
    marginTop: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 8,
    paddingLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  singleButton: {
    minWidth: 150,
  },
  declineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#404040',
  },
  allowButton: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  declineButtonText: {
    color: '#B3B3B3',
  },
  allowButtonText: {
    color: '#FFFFFF',
  },
});

export default ConsentDialog;
