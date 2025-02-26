import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { StorageService } from '../services/storageService';
import { Note } from '../types';
import { formatDate } from '../utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';

export default function TrashScreen() {
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    loadDeletedNotes();
  }, []);

  const loadDeletedNotes = async () => {
    const notes = await StorageService.getDeletedNotes();
    setDeletedNotes(notes);
  };

  const handleRestore = async () => {
    if (selectedNotes.length > 0) {
      for (const noteId of selectedNotes) {
        await StorageService.restoreNote(noteId);
      }
      setSelectedNotes([]);
    } else if (selectedNote) {
      await StorageService.restoreNote(selectedNote.id);
      setSelectedNote(null);
    }
    loadDeletedNotes();
  };

  const handlePermanentDelete = async () => {
    if (selectedNotes.length > 0) {
      for (const noteId of selectedNotes) {
        await StorageService.permanentlyDeleteNote(noteId);
      }
      setSelectedNotes([]);
      loadDeletedNotes();
    }
  };

  const handleNotePress = (note: Note) => {
    if (selectedNotes.length > 0) {
      setSelectedNotes(prev => 
        prev.includes(note.id) 
          ? prev.filter(id => id !== note.id)
          : [...prev, note.id]
      );
    } else {
      setSelectedNote(note);
    }
  };

  const handleNoteLongPress = (note: Note) => {
    setSelectedNotes([note.id]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Silinen notlar 30 gün boyunca burada saklanır ve sonrasında otomatik olarak kalıcı olarak silinir.
        </Text>
      </View>
      
      <FlatList
        data={deletedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.noteItem,
              selectedNotes.includes(item.id) && styles.selectedNoteItem
            ]}
            onPress={() => handleNotePress(item)}
            onLongPress={() => handleNoteLongPress(item)}
            delayLongPress={500}
          >
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.noteDate}>
                {formatDate(new Date(item.deletedAt || ''))}
              </Text>
            </View>
            {selectedNotes.includes(item.id) && (
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#FF6B6B" />
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trash-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Çöp kutusu boş</Text>
          </View>
        }
      />

      {selectedNote && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalDismiss}
            activeOpacity={1}
            onPress={() => setSelectedNote(null)}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notu Geri Yükle</Text>
            <Text style={styles.modalText}>
              "{selectedNote.title}" notunu geri yüklemek istediğinize emin misiniz?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setSelectedNote(null)}
              >
                <Text style={styles.cancelButtonText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.restoreButton]}
                onPress={handleRestore}
              >
                <Text style={styles.restoreButtonText}>Geri Yükle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {selectedNotes.length > 0 && (
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handlePermanentDelete}
          >
            <Text style={styles.actionButtonText}>
              Kalıcı Olarak Sil ({selectedNotes.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.restoreButton]}
            onPress={handleRestore}
          >
            <Text style={styles.actionButtonText}>
              Geri Yükle ({selectedNotes.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteContent: {
    flex: 1,
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
  selectedNoteItem: {
    backgroundColor: '#fff5f5',
  },
  checkmarkContainer: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#666',
    marginTop: 10,
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f2f6',
  },
  restoreButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
  },
  restoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 