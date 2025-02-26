import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, Folder } from '../types';

const NOTES_KEY = 'notes_data';
const DELETED_NOTES_KEY = 'deleted_notes_data';
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // 30 gün milisaniye cinsinden

export const StorageService = {
  async saveNotes(notes: Note[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem(NOTES_KEY, jsonValue);
    } catch (error) {
      console.error('Notlar kaydedilirken hata:', error);
      throw error;
    }
  },

  async getNotes(): Promise<Note[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(NOTES_KEY);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Notlar yüklenirken hata:', error);
      return [];
    }
  },

  async addNote(note: Note): Promise<void> {
    try {
      const notes = await this.getNotes();
      notes.push(note);
      await this.saveNotes(notes);
    } catch (error) {
      console.error('Not eklenirken hata:', error);
      throw error;
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      const notes = await this.getNotes();
      const noteToDelete = notes.find(note => note.id === id);
      
      if (noteToDelete) {
        // Ana listeden notu sil
        const updatedNotes = notes.filter(note => note.id !== id);
        await this.saveNotes(updatedNotes);

        // Silinen notlar listesine ekle
        const deletedNotes = await this.getDeletedNotes();
        const noteWithDeleteDate = {
          ...noteToDelete,
          deletedAt: new Date().toISOString()
        };
        await AsyncStorage.setItem(
          DELETED_NOTES_KEY, 
          JSON.stringify([...deletedNotes, noteWithDeleteDate])
        );
      }
    } catch (error) {
      console.error('Not silinirken hata:', error);
      throw error;
    }
  },

  async getNote(id: string): Promise<Note | undefined> {
    try {
      const notes = await this.getNotes();
      return notes.find(note => note.id === id);
    } catch (error) {
      console.error('Not alınırken hata:', error);
      return undefined;
    }
  },

  async updateNote(updatedNote: Note): Promise<void> {
    try {
      const notes = await this.getNotes();
      const updatedNotes = notes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      );
      await this.saveNotes(updatedNotes);
    } catch (error) {
      console.error('Not güncellenirken hata:', error);
    }
  },

  async getFolders(): Promise<Folder[]> {
    try {
      const foldersJson = await AsyncStorage.getItem('folders');
      return foldersJson ? JSON.parse(foldersJson) : [];
    } catch (error) {
      console.error('Klasörler yüklenirken hata:', error);
      return [];
    }
  },

  async createFolder(name: string): Promise<void> {
    try {
      const folders = await this.getFolders();
      const newFolder = {
        id: Date.now().toString(),
        name,
        createdAt: new Date().toISOString()
      };
      await AsyncStorage.setItem('folders', JSON.stringify([...folders, newFolder]));
    } catch (error) {
      console.error('Klasör oluşturulurken hata:', error);
    }
  },

  async moveNoteToFolder(noteId: string, folderId: string): Promise<void> {
    try {
      const notes = await this.getNotes();
      const updatedNotes = notes.map(note => 
        note.id === noteId ? { ...note, folderId } : note
      );
      await this.saveNotes(updatedNotes);
    } catch (error) {
      console.error('Not taşınırken hata:', error);
    }
  },

  async deleteFolders(folderIds: string[]): Promise<void> {
    try {
      // Önce klasörleri sil
      const folders = await this.getFolders();
      const remainingFolders = folders.filter(folder => !folderIds.includes(folder.id));
      await AsyncStorage.setItem('folders', JSON.stringify(remainingFolders));

      // Sonra bu klasörlerdeki notları güncelle
      const notes = await this.getNotes();
      const updatedNotes = notes.map(note => 
        folderIds.includes(note.folderId || '') 
          ? { ...note, folderId: undefined }
          : note
      );
      await this.saveNotes(updatedNotes);
    } catch (error) {
      console.error('Klasörler silinirken hata:', error);
    }
  },

  async getDeletedNotes(): Promise<Note[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(DELETED_NOTES_KEY);
      if (!jsonValue) return [];
      
      const deletedNotes = JSON.parse(jsonValue) as Note[];
      const now = new Date().getTime();
      
      // 30 günden eski notları filtrele
      const currentNotes = deletedNotes.filter(note => {
        const deleteDate = new Date(note.deletedAt || '').getTime();
        return (now - deleteDate) < THIRTY_DAYS;
      });

      // Filtrelenmiş notları kaydet
      await AsyncStorage.setItem(DELETED_NOTES_KEY, JSON.stringify(currentNotes));
      
      return currentNotes;
    } catch (error) {
      console.error('Silinen notlar alınırken hata:', error);
      return [];
    }
  },

  async restoreNote(noteId: string): Promise<void> {
    try {
      const deletedNotes = await this.getDeletedNotes();
      const noteToRestore = deletedNotes.find(note => note.id === noteId);
      
      if (noteToRestore) {
        const currentNotes = await this.getNotes();
        const updatedDeletedNotes = deletedNotes.filter(note => note.id !== noteId);
        
        delete noteToRestore.deletedAt;
        currentNotes.unshift(noteToRestore);
        
        await this.saveNotes(currentNotes);
        await AsyncStorage.setItem(DELETED_NOTES_KEY, JSON.stringify(updatedDeletedNotes));
      }
    } catch (error) {
      console.error('Not geri yüklenirken hata:', error);
      throw error;
    }
  },

  async permanentlyDeleteNote(id: string): Promise<void> {
    try {
      const deletedNotes = await this.getDeletedNotes();
      const updatedNotes = deletedNotes.filter(note => note.id !== id);
      await AsyncStorage.setItem(DELETED_NOTES_KEY, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Not kalıcı olarak silinirken hata:', error);
      throw error;
    }
  },
}; 