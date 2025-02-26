import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StorageService } from '../services/storageService';
import { Folder } from '../types';
import { DeletedNotesModal } from '../components/modals/DeletedNotesModal';

export default function FoldersScreen() {
  const router = useRouter();
  const { selectMode, noteId } = useLocalSearchParams();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showDeletedNotes, setShowDeletedNotes] = useState(false);

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    if (selectedFolders.length > 0) {
      router.setParams({ 
        showHeader: '0',
        selectedCount: selectedFolders.length 
      });
    } else {
      router.setParams({ 
        showHeader: '1',
        selectedCount: 0 
      });
    }
  }, [selectedFolders]);

  useEffect(() => {
    global.clearFolderSelection = () => setSelectedFolders([]);
    return () => {
      global.clearFolderSelection = undefined;
    };
  }, []);

  const loadFolders = async () => {
    const savedFolders = await StorageService.getFolders();
    setFolders(savedFolders);
  };

  const handleFolderLongPress = (folderId: string) => {
    if (selectMode !== "1") {
      setSelectedFolders([folderId]);
    }
  };

  const handleFolderPress = (folderId: string) => {
    if (selectMode === "1" && noteId) {
      handleSelectFolder(folderId);
    } else if (selectedFolders.length > 0) {
      setSelectedFolders(prev => 
        prev.includes(folderId) 
          ? prev.filter(id => id !== folderId)
          : [...prev, folderId]
      );
    }
  };

  const handleDeleteFolders = async () => {
    await StorageService.deleteFolders(selectedFolders);
    setSelectedFolders([]);
    loadFolders();
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    await StorageService.createFolder(newFolderName.trim());
    setNewFolderName('');
    setShowCreateModal(false);
    loadFolders();
  };

  const handleSelectFolder = async (folderId: string) => {
    if (selectMode && noteId) {
      await StorageService.moveNoteToFolder(noteId as string, folderId);
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.folderItem,
              selectedFolders.includes(item.id) && styles.selectedFolderItem
            ]}
            onPress={() => handleFolderPress(item.id)}
            onLongPress={() => handleFolderLongPress(item.id)}
            delayLongPress={500}
          >
            <View style={styles.folderItemLeft}>
              <View style={[
                styles.folderIcon,
                selectedFolders.includes(item.id) && styles.selectedFolderIcon
              ]}>
                <Ionicons 
                  name={selectedFolders.includes(item.id) ? "folder" : "folder-outline"} 
                  size={24} 
                  color={selectedFolders.includes(item.id) ? "#FF6B6B" : "#2c3e50"} 
                />
              </View>
              <Text style={[
                styles.folderName,
                selectedFolders.includes(item.id) && styles.selectedFolderName
              ]}>{item.name}</Text>
            </View>
            {selectedFolders.includes(item.id) && (
              <Ionicons name="checkmark-circle" size={24} color="#FF6B6B" />
            )}
          </TouchableOpacity>
        )}
      />
      
      {selectedFolders.length > 0 ? (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteFolders}
        >
          <Text style={styles.deleteButtonText}>
            Seçilen Klasörleri Sil ({selectedFolders.length})
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>Yeni Klasör Oluştur</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCreateModal(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Yeni Klasör</Text>
            <TextInput
              style={styles.input}
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="Klasör adı"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleCreateFolder}
              >
                <Text style={styles.createButtonText}>Oluştur</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <DeletedNotesModal
        visible={showDeletedNotes}
        onClose={() => setShowDeletedNotes(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  folderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFolderIcon: {
    backgroundColor: '#fff5f5',
  },
  folderName: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  createButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
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
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f2f6',
  },
  createModalButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedFolderItem: {
    backgroundColor: '#fff5f5',
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  selectedFolderName: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  deleteButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FF5252',
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 