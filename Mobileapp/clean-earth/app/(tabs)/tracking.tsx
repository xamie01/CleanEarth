// @ts-nocheck
import { View, Text, SafeAreaView, Dimensions, StyleSheet } from 'react-native';
// Note: In a real app, import MapView, { Marker } from 'react-native-maps';
// For this prototype, we'll visualize the layout
import { Phone, MessageSquare } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbeafe',
  },
  mapText: {
    color: '#93c5fd',
    fontWeight: 'bold',
    fontSize: 36,
    transform: [{ rotate: '-12deg' }],
  },
  driverCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#d1d5db',
    borderRadius: 24,
    marginRight: 16,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b1b1b',
  },
  driverDetails: {
    color: '#6b7280',
    fontSize: 14,
  },
  ratingBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  etaText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b1b1b',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statusLabelRight: {
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  callButtonText: {
    color: '#2e7d32',
  },
  messageButtonText: {
    color: '#374151',
  },
});

export default function Tracking() {
  return (
    <View style={styles.container}>
      {/* Mock Map Background */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapText}>MAP VIEW</Text>
      </View>

      {/* Driver Card Overlay */}
      <View style={styles.driverCard}>
        <View style={styles.driverHeader}>
          <View style={styles.avatar} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Mike D.</Text>
            <Text style={styles.driverDetails}>Electric Van • Plate 892</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>4.9 ★</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>ETA</Text>
            <Text style={styles.etaText}>4 mins</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={[styles.infoLabel, styles.statusLabelRight]}>Status</Text>
            <Text style={[styles.statusText, styles.statusLabelRight]}>Arriving</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.callButton}>
            <Phone size={18} color="#2E7D32" />
            <Text style={[styles.buttonText, styles.callButtonText]}>Call</Text>
          </View>
          <View style={styles.messageButton}>
            <MessageSquare size={18} color="#374151" />
            <Text style={[styles.buttonText, styles.messageButtonText]}>Message</Text>
          </View>
        </View>
      </View>
    </View>
  );
}