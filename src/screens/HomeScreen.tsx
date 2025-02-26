import { StyleSheet, View, FlatList, TouchableOpacity, Text, Alert, TextInput, ScrollView, Modal } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { NoteCard } from "../components/notes/NoteCard";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Note, Folder } from "../types";
import { StorageService } from "../services/storageService";
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../contexts/SettingsContext';
import { DeleteModal } from '../components/modals/DeleteModal';

export default function HomeScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const { sortBy } = useSettings();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const loadData = async () => {
    const savedNotes = await StorageService.getNotes();
    const savedFolders = await StorageService.getFolders();
    setNotes(savedNotes);
    setFolders(savedFolders);
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleNotePress = (note: Note) => {
    if (selectedNotes.length > 0) {
      handleNoteSelect(note.id);
    } else {
      router.push({
        pathname: "/note-detail",
        params: { noteId: note.id }
      });
    }
  };

  const handleNoteLongPress = (noteId: string) => {
    handleNoteSelect(noteId);
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleDelete = async () => {
    try {
      // Her seçili not için silme işlemini yap
      for (const noteId of selectedNotes) {
        await StorageService.deleteNote(noteId);
      }
      
      // Seçili notları temizle ve listeyi güncelle
      setSelectedNotes([]);
      loadData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Notlar silinirken hata:', error);
    }
  };

  const handleMove = async (folderId: string) => {
    try {
      const allNotes = await StorageService.getNotes();
      const updatedNotes = allNotes.map(note => 
        selectedNotes.includes(note.id) ? { ...note, folderId } : note
      );
      await StorageService.saveNotes(updatedNotes);
      setNotes(updatedNotes);
      setSelectedNotes([]);
      setShowMoveModal(false);
    } catch (error) {
      console.error('Notlar taşınırken hata:', error);
    }
  };

  const filteredNotes = useMemo(() => {
    let filtered = notes;
    
    // Klasör filtresi
    if (selectedFolder) {
      filtered = filtered.filter(note => note.folderId === selectedFolder);
    }
    
    // Arama filtresi
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [notes, searchText, selectedFolder]);

  const highlightText = (text: string) => {
    if (!searchText.trim()) return text;
    
    const searchLower = searchText.toLowerCase();
    const index = text.toLowerCase().indexOf(searchLower);
    
    if (index === -1) return text;
    
    return (
      <>
        {text.slice(0, index)}
        <Text style={{ color: '#FF6B6B', fontWeight: '600' }}>
          {text.slice(index, index + searchText.length)}
        </Text>
        {text.slice(index + searchText.length)}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {selectedNotes.length > 0 ? (
          <>
            <TouchableOpacity onPress={() => setSelectedNotes([])}>
              <Text style={styles.cancelButton}>İptal</Text>
            </TouchableOpacity>
            <Text style={styles.selectionText}>{selectedNotes.length} not seçildi</Text>
          </>
        ) : (
          <>
            <Text style={styles.header}>Notlarım</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push("/folders")}
              >
                <Ionicons name="folder-outline" size={24} color="#2c3e50" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push("/settings")}
              >
                <Ionicons name="settings-outline" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Notlarda ara..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView 
        horizontal 
        style={styles.folderList}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={[
            styles.folderChip,
            !selectedFolder && styles.selectedFolderChip
          ]}
          onPress={() => setSelectedFolder(null)}
        >
          <Text style={[
            styles.folderChipText,
            !selectedFolder && styles.selectedFolderChipText
          ]}>Tümü</Text>
        </TouchableOpacity>
        
        {folders.map(folder => (
          <TouchableOpacity 
            key={folder.id}
            style={[
              styles.folderChip,
              selectedFolder === folder.id && styles.selectedFolderChip
            ]}
            onPress={() => setSelectedFolder(folder.id)}
          >
            <Text style={[
              styles.folderChipText,
              selectedFolder === folder.id && styles.selectedFolderChipText
            ]}>{folder.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard 
            note={{
              ...item,
              title: highlightText(item.title),
              content: highlightText(item.content)
            }}
            onPress={() => handleNotePress(item)}
            onLongPress={() => handleNoteLongPress(item.id)}
            isSelected={selectedNotes.includes(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText ? 'Arama sonucu bulunamadı' : 'Henüz not eklenmemiş'}
          </Text>
        }
      />
      
      {selectedNotes.length > 0 ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.moveButton} 
            onPress={() => setShowMoveModal(true)}
          >
            <Ionicons name="folder-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>
              Taşı ({selectedNotes.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => setShowDeleteModal(true)}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>
              Sil ({selectedNotes.length})
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => router.push("/new-note")}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <DeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        count={selectedNotes.length}
      />

      <Modal
        visible={showMoveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMoveModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1} 
          onPress={() => setShowMoveModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Klasöre Taşı</Text>
            
            {folders.map(folder => (
              <TouchableOpacity 
                key={folder.id}
                style={styles.modalOption}
                onPress={() => handleMove(folder.id)}
              >
                <Ionicons name="folder-outline" size={20} color="#2c3e50" />
                <Text style={styles.modalOptionText}>{folder.name}</Text>
              </TouchableOpacity>
            ))}
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
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: '#2c3e50',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    backgroundColor: '#FF6B6B',
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  fabText: {
    color: 'white',
    fontSize: 32,
    marginTop: -2,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5252',
    padding: 15,
    borderRadius: 12,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  selectionText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 4,
  },
  folderList: {
    maxHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  folderChip: {
    height: 34,
    paddingHorizontal: 16,
    backgroundColor: '#f1f2f6',
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFolderChip: {
    backgroundColor: '#FF6B6B',
  },
  folderChipText: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedFolderChipText: {
    color: '#fff',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 12,
    marginRight: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
}); 