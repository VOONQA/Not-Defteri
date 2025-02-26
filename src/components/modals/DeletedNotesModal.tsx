import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { StorageService } from '../../services/storageService';
import { Note } from '../../types';
import { formatDate } from '../../utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';

interface DeletedNotesModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DeletedNotesModal({ visible, onClose }: DeletedNotesModalProps) {
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    if (visible) {
      loadDeletedNotes();
    }
  }, [visible]);

  const loadDeletedNotes = async () => {
    const notes = await StorageService.getDeletedNotes();
    setDeletedNotes(notes);
  };

  const getRemainingDays = (deletedAt: string) => {
    const deleteDate = new Date(deletedAt);
    const expiryDate = new Date(deleteDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const remainingDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return remainingDays;
  };

  const handleRestore = async () => {
    if (!selectedNote) return;
    
    await StorageService.restoreNote(selectedNote.id);
    setSelectedNote(null);
    loadDeletedNotes();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Çöp Kutusu</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={deletedNotes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.noteItem}
                onPress={() => setSelectedNote(item)}
              >
                <Text style={styles.noteTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.noteDate}>
                  {formatDate(new Date(item.deletedAt || ''))}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="trash-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>Çöp kutusu boş</Text>
              </View>
            }
          />
        </View>

        {selectedNote && (
          <TouchableOpacity 
            style={styles.restoreOverlay}
            activeOpacity={1}
            onPress={() => setSelectedNote(null)}
          >
            <View style={styles.restorePopup}>
              <Text style={styles.restoreTitle}>Notu Geri Yükle</Text>
              <Text style={styles.restoreText}>
                "{selectedNote.title}" notunu geri yüklemek istediğinize emin misiniz?
              </Text>
              <View style={styles.restoreButtons}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setSelectedNote(null)}
                >
                  <Text style={styles.buttonText}>Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.restoreButton]}
                  onPress={handleRestore}
                >
                  <Text style={[styles.buttonText, styles.restoreButtonText]}>
                    Geri Yükle
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 50,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  noteItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteTitle: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    fontSize: 16,
  },
  restoreOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  restorePopup: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  restoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  restoreText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 15,
  },
  restoreButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  restoreButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  restoreButtonText: {
    color: '#fff',
  },
}); 