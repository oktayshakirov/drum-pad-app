import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import Clipboard from '@react-native-clipboard/clipboard';
import InAppReview from 'react-native-in-app-review';
import {triggerPlatformHaptic} from '../utils/haptics';
import {getResponsiveSize} from '../utils/deviceUtils';
import {
  APP_NAME,
  CONTACT_EMAIL,
  APP_STORE_ID,
  ANDROID_PACKAGE,
  RATED_FLAG_KEY,
  SOCIAL_URLS,
} from '../constants/connect';

const APP_VERSION = DeviceInfo.getVersion();

/** Opens the public store listing where the user can read or leave a review. */
function openStoreListing(): void {
  const url =
    Platform.OS === 'ios'
      ? `https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`
      : `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
  Linking.openURL(url).catch(() => undefined);
}

interface MailOption {
  name: string;
  open: () => Promise<void>;
}

/** Opens the user's default mail handler (or, on Android, the system chooser). */
function openMailto(subject: string, body: string): Promise<void> {
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
  return Linking.openURL(mailto);
}

/** Last resort when no mail app exists: let the user copy our address. */
function showCopyAddressFallback(): void {
  Alert.alert(
    'No email app found',
    `Copy our address and send your message from any email app:\n\n${CONTACT_EMAIL}`,
    [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Copy address',
        onPress: () => Clipboard.setString(CONTACT_EMAIL),
      },
    ],
  );
}

async function sendMail(subject: string, body: string): Promise<void> {
  // Android resolves mailto: to its own app chooser (incl. Gmail), so there's
  // nothing to detect — just open it.
  if (Platform.OS !== 'ios') {
    try {
      await openMailto(subject, body);
    } catch {
      showCopyAddressFallback();
    }
    return;
  }

  // iOS: detect installed mail apps, with Gmail prioritized first.
  const enc = (s: string) => encodeURIComponent(s);
  const options: MailOption[] = [];

  // Gmail — note the three-slash "/co" compose path required by the app.
  const gmailUrl = `googlegmail:///co?to=${CONTACT_EMAIL}&subject=${enc(
    subject,
  )}&body=${enc(body)}`;
  try {
    if (await Linking.canOpenURL(gmailUrl)) {
      options.push({name: 'Gmail', open: () => Linking.openURL(gmailUrl)});
    }
  } catch {
    // Ignore detection failure.
  }

  // Outlook
  const outlookUrl = `ms-outlook://compose?to=${CONTACT_EMAIL}&subject=${enc(
    subject,
  )}&body=${enc(body)}`;
  try {
    if (await Linking.canOpenURL(outlookUrl)) {
      options.push({name: 'Outlook', open: () => Linking.openURL(outlookUrl)});
    }
  } catch {
    // Ignore detection failure.
  }

  // No dedicated mail app detected: hand off to the system default (usually
  // Apple Mail) via mailto:, then fall back to copy-address if that fails.
  // We can't detect whether Apple Mail has a configured account the way
  // expo-mail-composer's isAvailableAsync() does, so it's only offered here
  // as the last resort rather than as an explicit picker option.
  if (options.length === 0) {
    try {
      await openMailto(subject, body);
    } catch {
      showCopyAddressFallback();
    }
    return;
  }

  // Exactly one app: open it directly, no need to ask.
  if (options.length === 1) {
    await options[0].open().catch(() => showCopyAddressFallback());
    return;
  }

  // Several apps: ask the user which one to use (Gmail listed first).
  ActionSheetIOS.showActionSheetWithOptions(
    {
      title: 'Send feedback with',
      options: [...options.map(o => o.name), 'Cancel'],
      cancelButtonIndex: options.length,
    },
    index => {
      if (index < options.length) {
        options[index].open().catch(() => showCopyAddressFallback());
      }
    },
  );
}

// Use CRLF (\r\n) so line breaks survive across mail clients — Gmail's iOS
// deep link in particular collapses lone \n into a single line.
const NL = '\r\n';

function handleBugReport(): void {
  const deviceModel = DeviceInfo.getModel() || 'Unknown device';
  const osName = Platform.OS === 'ios' ? 'iOS' : 'Android';
  const osVersion = `${osName} ${DeviceInfo.getSystemVersion()}`.trim();
  sendMail(
    `[Bug Report] ${APP_NAME}`,
    `Describe the bug:${NL}${NL}${NL}Steps to reproduce:${NL}1.${NL}2.${NL}3.${NL}${NL}--- App info ---${NL}Version: ${APP_VERSION}${NL}Device: ${deviceModel}${NL}OS: ${osVersion}${NL}`,
  );
}

function handleFeatureRequest(): void {
  sendMail(
    `[Feature Request] ${APP_NAME}`,
    `What feature would you like to see?${NL}${NL}${NL}Why would this be useful?${NL}${NL}`,
  );
}

function handlePartnership(): void {
  sendMail(
    `[Partnership] ${APP_NAME}`,
    `Hi ${APP_NAME} team,${NL}${NL}I'd like to explore a partnership opportunity.${NL}${NL}Company / Name:${NL}Website:${NL}Proposal:${NL}${NL}`,
  );
}

async function handleRateApp(): Promise<void> {
  // The native in-app review prompt is silent and rate-limited by the OS: it
  // resolves successfully even when nothing is shown (e.g. the user already
  // rated or the yearly cap is hit), and there is no API to detect that.
  // So we only use it the first time, then fall back to the store listing,
  // which always works and shows the user their existing review if any.
  let alreadyRequested = false;
  try {
    alreadyRequested = (await AsyncStorage.getItem(RATED_FLAG_KEY)) === '1';
  } catch {
    // Treat storage failure as "not requested yet".
  }

  const canPrompt = !alreadyRequested && InAppReview.isAvailable();

  if (canPrompt) {
    try {
      await InAppReview.RequestInAppReview();
      await AsyncStorage.setItem(RATED_FLAG_KEY, '1');
    } catch {
      openStoreListing();
    }
    return;
  }

  // Already prompted before (or native prompt unavailable): give clear feedback
  // and a reliable way to reach the listing.
  Alert.alert(
    'Thanks for your support! 💛',
    `If you've already rated ${APP_NAME}, you're awesome. Want to update your review or leave one now?`,
    [
      {text: 'Not now', style: 'cancel'},
      {text: 'Open store', onPress: openStoreListing},
    ],
  );
}

function openUrl(url: string): void {
  Linking.openURL(url).catch(() => undefined);
}

interface ConnectModalProps {
  visible: boolean;
  onClose: () => void;
  /** True when RevenueCat is configured/available on this platform. */
  revenueCatAvailable?: boolean;
  /** True when the user owns the lifetime "Full Unlock" entitlement. */
  isUnlocked?: boolean;
  /** Called from the Plan tab when a Free user taps "Unlock Full Version". */
  onUpgrade?: () => void;
  /** Called from the Plan tab when a Free user taps "Restore Purchases". */
  onRestore?: () => void | Promise<void>;
}

type Tab = 'connect' | 'plan';

interface RowProps {
  icon: string;
  iconColor: string;
  label: string;
  onPress: () => void;
  /** Use the "open in external app" chevron instead of "forward". */
  external?: boolean;
}

const Row: React.FC<RowProps> = ({
  icon,
  iconColor,
  label,
  onPress,
  external,
}) => (
  <TouchableOpacity
    style={styles.row}
    activeOpacity={0.7}
    onPress={() => {
      triggerPlatformHaptic('selection');
      onPress();
    }}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={getResponsiveSize(20, 26)} color={iconColor} />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <Ionicons
      name={external ? 'open-outline' : 'chevron-forward'}
      size={getResponsiveSize(16, 22)}
      color="#6e6e73"
    />
  </TouchableOpacity>
);

const SectionLabel: React.FC<{children: string}> = ({children}) => (
  <Text style={styles.sectionLabel}>{children}</Text>
);

const ConnectModalContent: React.FC<ConnectModalProps> = ({
  onClose,
  revenueCatAvailable = false,
  isUnlocked = false,
  onUpgrade,
  onRestore,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('connect');

  const showPlanTab = revenueCatAvailable;
  const effectiveTab: Tab =
    activeTab === 'plan' && !showPlanTab ? 'connect' : activeTab;

  return (
    <TouchableOpacity
      style={styles.backdrop}
      activeOpacity={1}
      onPress={onClose}>
      <TouchableOpacity
        style={[styles.sheet, {paddingBottom: insets.bottom + 8}]}
        activeOpacity={1}
        onPress={() => {}}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>Connect with Us</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <Ionicons name="close" size={getResponsiveSize(24, 32)} color="#aaa" />
          </TouchableOpacity>
        </View>

        {showPlanTab && (
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[
                styles.tab,
                effectiveTab === 'connect' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('connect')}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={15}
                color={effectiveTab === 'connect' ? '#fff' : '#8e8e93'}
              />
              <Text
                style={[
                  styles.tabText,
                  effectiveTab === 'connect' && styles.tabTextActive,
                ]}>
                Connect
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, effectiveTab === 'plan' && styles.tabActive]}
              onPress={() => setActiveTab('plan')}>
              <Ionicons
                name="diamond-outline"
                size={15}
                color={effectiveTab === 'plan' ? '#fff' : '#8e8e93'}
              />
              <Text
                style={[
                  styles.tabText,
                  effectiveTab === 'plan' && styles.tabTextActive,
                ]}>
                Plan
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {effectiveTab === 'connect' && (
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}>
            <SectionLabel>Feedback</SectionLabel>
            <Row
              icon="bug-outline"
              iconColor="#f87171"
              label="Report a Bug"
              onPress={handleBugReport}
            />
            <Row
              icon="bulb-outline"
              iconColor="#facc15"
              label="Suggest a Feature"
              onPress={handleFeatureRequest}
            />

            <SectionLabel>Community</SectionLabel>
            <Row
              icon="star-outline"
              iconColor="#fb923c"
              label={`Rate ${APP_NAME}`}
              onPress={handleRateApp}
            />
            <Row
              icon="logo-tiktok"
              iconColor="#fff"
              label="Follow on TikTok"
              onPress={() => openUrl(SOCIAL_URLS.tiktok)}
              external
            />

            <SectionLabel>Business</SectionLabel>
            <Row
              icon="rocket-outline"
              iconColor="#818cf8"
              label="Work with Us"
              onPress={handlePartnership}
            />
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}

        {effectiveTab === 'plan' && (
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}>
            <View style={styles.planCard}>
              <Text style={styles.planCardLabel}>Current plan</Text>
              <Text style={styles.planCardValue}>
                {isUnlocked ? 'Full Version' : 'Free'}
              </Text>
            </View>

            {isUnlocked ? (
              <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>
                  Thank you for supporting {APP_NAME} 💛
                </Text>
                <Text style={styles.tipBody}>
                  Your purchase unlocks every sound pack and removes ads
                  forever. You'll also get any future packs and features we add
                  - at no extra cost.
                </Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.planAction}
                  activeOpacity={0.8}
                  onPress={() => {
                    triggerPlatformHaptic('selection');
                    onClose();
                    onUpgrade?.();
                  }}>
                  <Ionicons name="diamond-outline" size={22} color="#FFC682" />
                  <View style={styles.planActionText}>
                    <Text style={styles.planActionTitle}>
                      Unlock Full Version
                    </Text>
                    <Text style={styles.planActionSubtitle}>
                      Every sound pack, no ads - one-time purchase
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#aaa" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.planAction}
                  activeOpacity={0.8}
                  onPress={() => {
                    triggerPlatformHaptic('selection');
                    onRestore?.();
                  }}>
                  <Ionicons name="refresh-outline" size={22} color="#aaa" />
                  <View style={styles.planActionText}>
                    <Text style={styles.planActionTitle}>
                      Restore Purchases
                    </Text>
                    <Text style={styles.planActionSubtitle}>
                      Already paid? Restore your full version
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#aaa" />
                </TouchableOpacity>
              </>
            )}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const ConnectModal: React.FC<ConnectModalProps> = props => {
  const {visible, onClose} = props;

  // Always reopen on the Connect tab — remount the content each time the
  // modal becomes visible so internal tab state resets.
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaProvider>
        <ConnectModalContent {...props} />
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#2c2c2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingHorizontal: getResponsiveSize(16, 28),
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#555',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  title: {
    color: '#fff',
    fontSize: getResponsiveSize(20, 26),
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1f1f21',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#3a3a3c',
  },
  tabText: {
    color: '#8e8e93',
    fontSize: getResponsiveSize(14, 18),
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  scroll: {
    flexGrow: 0,
  },
  sectionLabel: {
    color: '#8e8e93',
    fontSize: getResponsiveSize(12, 15),
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3a3a3c',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: getResponsiveSize(13, 18),
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    color: '#fff',
    fontSize: getResponsiveSize(15, 19),
    fontWeight: '500',
  },
  planCard: {
    backgroundColor: '#3a3a3c',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 18,
    marginBottom: 12,
  },
  planCardLabel: {
    color: '#aaa',
    fontSize: getResponsiveSize(14, 18),
  },
  planCardValue: {
    color: '#fff',
    fontSize: getResponsiveSize(18, 24),
    fontWeight: 'bold',
    marginTop: 2,
  },
  planAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#3a3a3c',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  planActionText: {
    flex: 1,
  },
  planActionTitle: {
    color: '#fff',
    fontSize: getResponsiveSize(15, 19),
    fontWeight: '600',
  },
  planActionSubtitle: {
    color: '#aaa',
    fontSize: getResponsiveSize(13, 16),
    marginTop: 2,
  },
  tipCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.10)',
    borderColor: 'rgba(76, 175, 80, 0.30)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  tipTitle: {
    color: '#7bd88f',
    fontSize: getResponsiveSize(15, 19),
    fontWeight: '600',
    marginBottom: 4,
  },
  tipBody: {
    color: '#ccc',
    fontSize: getResponsiveSize(13, 17),
    lineHeight: getResponsiveSize(19, 24),
  },
  bottomSpacer: {
    height: 12,
  },
});

export default ConnectModal;
