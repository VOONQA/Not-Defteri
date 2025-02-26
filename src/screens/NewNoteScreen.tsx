import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StorageService } from '../services/storageService';
import { formatDate } from '../utils/dateFormatter';
import { useSettings } from '../contexts/SettingsContext';

export default function NewNoteScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const characterCount = content.length;
  const [createdAt] = useState(formatDate(new Date()));
  const { fontSize, fontFamily } = useSettings();

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;

    const newNote = {
      id: Date.now().toString(),
      title: title.trim() || "Başlıksız Not",
      content: content.trim() || "Metin yok",
      characterCount,
      createdAt,
      updatedAt: createdAt
    };

    try {
      const allNotes = await StorageService.getNotes();
      const updatedNotes = [newNote, ...allNotes];
      await StorageService.saveNotes(updatedNotes);
      router.back();
    } catch (error) {
      console.error('Not kaydedilirken hata:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.titleInput, { 
          fontFamily: fontFamily === 'system' ? undefined : fontFamily 
        }]}
        placeholder="Başlık"
        value={title}
        onChangeText={setTitle}
        autoCapitalize="sentences"
        keyboardType="default"
        autoFocus={true}
      />
      
      <TextInput
        style={[styles.contentInput, { 
          fontFamily: fontFamily === 'system' ? undefined : fontFamily 
        }]}
        placeholder="Notunuzu yazın..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        keyboardType="default"
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{createdAt}</Text>
        <Text style={styles.infoText}>Karakter: {characterCount}</Text>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 8,
  },
  infoText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
}); 