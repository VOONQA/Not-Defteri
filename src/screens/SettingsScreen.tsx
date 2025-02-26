import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function SettingsScreen() {
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [showFontFamilyModal, setShowFontFamilyModal] = useState(false);
  const { fontSize, setFontSize, fontFamily, setFontFamily } = useSettings();

  const handleFontSizeSelect = async (size: string) => {
    await setFontSize(size);
    setShowFontSizeModal(false);
  };

  const handleFontFamilySelect = async (font: string) => {
    await setFontFamily(font);
    setShowFontFamilyModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stil</Text>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => setShowFontSizeModal(true)}
        >
          <View>
            <Text style={styles.settingTitle}>Yazı Boyutu</Text>
            <Text style={styles.settingValue}>
              {fontSize === 'small' ? 'Küçük' : 
               fontSize === 'medium' ? 'Orta' : 'Büyük'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => setShowFontFamilyModal(true)}
        >
          <View>
            <Text style={styles.settingTitle}>Yazı Tipi</Text>
            <Text style={styles.settingValue}>
              {fontFamily === 'system' ? 'Sistem' : 
               fontFamily === 'serif' ? 'Serif' : 
               fontFamily === 'monospace' ? 'Monospace' : 'Sans Serif'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Font Size Modal */}
      <Modal
        visible={showFontSizeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFontSizeModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1} 
          onPress={() => setShowFontSizeModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yazı Boyutu</Text>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleFontSizeSelect('small')}
            >
              <Text style={[styles.modalOptionText, fontSize === 'small' && styles.selectedOptionText]}>
                Küçük
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleFontSizeSelect('medium')}
            >
              <Text style={[styles.modalOptionText, fontSize === 'medium' && styles.selectedOptionText]}>
                Orta
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleFontSizeSelect('large')}
            >
              <Text style={[styles.modalOptionText, fontSize === 'large' && styles.selectedOptionText]}>
                Büyük
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Font Family Modal */}
      <Modal
        visible={showFontFamilyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFontFamilyModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1} 
          onPress={() => setShowFontFamilyModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yazı Tipi</Text>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleFontFamilySelect('system')}
            >
              <Text style={[styles.modalOptionText, fontFamily === 'system' && styles.selectedOptionText]}>
                Sistem
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleFontFamilySelect('serif')}
            >
              <Text style={[styles.modalOptionText, fontFamily === 'serif' && styles.selectedOptionText]}>
                Serif
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleFontFamilySelect('sans-serif')}
            >
              <Text style={[styles.modalOptionText, fontFamily === 'sans-serif' && styles.selectedOptionText]}>
                Sans Serif
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleFontFamilySelect('monospace')}
            >
              <Text style={[styles.modalOptionText, fontFamily === 'monospace' && styles.selectedOptionText]}>
                Monospace
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  settingButton: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#FF6B6B',
    fontWeight: '600',
  }
}); 