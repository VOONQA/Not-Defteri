import { View, TextInput, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { useSettings } from '../contexts/SettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { DeleteModal } from '../components/modals/DeleteModal';

export default function NoteDetailScreen() {
  const { noteId } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const { fontSize, fontFamily } = useSettings();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const hasChanges = title !== originalTitle || content !== originalContent;

  useEffect(() => {
    loadNote();
  }, [noteId]);

  useEffect(() => {
    global.toggleMenu = () => setShowMenu(prev => !prev);
    return () => {
      global.toggleMenu = undefined;
    };
  }, []);

  const loadNote = async () => {
    if (!noteId) return;
    
    try {
      const note = await StorageService.getNote(noteId as string);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setCreatedAt(note.createdAt);
        setOriginalTitle(note.title);
        setOriginalContent(note.content);
      }
    } catch (error) {
      console.error('Not yüklenirken hata:', error);
    }
  };

  useEffect(() => {
    const hasChanges = title !== originalTitle || content !== originalContent;
    router.setParams({ showSaveButton: hasChanges ? '1' : '0' });
    global.saveNote = hasChanges ? handleSave : undefined;
  }, [title, content, originalTitle, originalContent]);

  const handleSave = async () => {
    try {
      const updatedNote = {
        id: noteId as string,
        title,
        content,
        createdAt,
        updatedAt: new Date().toISOString(),
        characterCount: content.length
      };

      await StorageService.updateNote(updatedNote);
      setOriginalTitle(title);
      setOriginalContent(content);
      
      router.setParams({ showSaveButton: '0' });
    } catch (error) {
      console.error('Not kaydedilirken hata:', error);
    }
  };

  const MenuButton = () => (
    <TouchableOpacity 
      onPress={() => setShowMenu(true)}
      style={{ marginRight: 15 }}
    >
      <Ionicons name="ellipsis-vertical" size={24} color="#2c3e50" />
    </TouchableOpacity>
  );

  const handleDelete = async () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleMove = () => {
    setShowMenu(false);
    router.push({
      pathname: "/folders",
      params: { selectMode: "1", noteId: noteId }
    });
  };

  const titleStyle = StyleSheet.create({
    input: {
      fontSize: fontSize === 'small' ? 20 : fontSize === 'medium' ? 24 : 28,
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: 16,
      fontFamily: fontFamily === 'system' ? undefined : fontFamily,
    }
  });

  const contentStyle = StyleSheet.create({
    input: {
      fontSize: fontSize === 'small' ? 14 : fontSize === 'medium' ? 16 : 18,
      color: '#2c3e50',
      lineHeight: fontSize === 'small' ? 20 : fontSize === 'medium' ? 24 : 28,
      fontFamily: fontFamily === 'system' ? undefined : fontFamily,
    }
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={titleStyle.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Başlık"
        multiline
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{createdAt}</Text>
        <Text style={styles.infoText}>Karakter: {content.length}</Text>
      </View>
      
      <TextInput
        style={contentStyle.input}
        value={content}
        onChangeText={setContent}
        placeholder="İçerik"
        multiline
      />
      
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={styles.menuOverlay} 
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleMove}
            >
              <Ionicons name="folder-outline" size={20} color="#2c3e50" />
              <Text style={styles.menuText}>Şuraya Taşı</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#FF5252" />
              <Text style={[styles.menuText, { color: '#FF5252' }]}>Sil</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      <DeleteModal 
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={async () => {
          await StorageService.deleteNote(noteId as string);
          router.back();
        }}
        count={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 8,
    paddingVertical: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoText: {
    color: '#666',
    fontSize: 12,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    minWidth: 150,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
}); 