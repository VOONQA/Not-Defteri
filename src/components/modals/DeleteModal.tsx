import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  count: number;
}

export function DeleteModal({ visible, onClose, onDelete, count }: DeleteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Notları Sil</Text>
              <Text style={styles.message}>Bu notu silmek istediğinize emin misiniz?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.deleteButton]} 
                  onPress={onDelete}
                >
                  <Text style={styles.deleteButtonText}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f1f2f6',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  cancelButtonText: {
    color: '#2c3e50',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
}); 