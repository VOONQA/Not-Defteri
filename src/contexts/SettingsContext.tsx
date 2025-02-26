import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsContextType = {
  fontSize: string;
  setFontSize: (size: string) => Promise<void>;
  fontFamily: string;
  setFontFamily: (family: string) => Promise<void>;
  sortBy: string;
  setSortBy: (sort: string) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState('medium');
  const [fontFamily, setFontFamilyState] = useState('system');
  const [sortBy, setSortByState] = useState('createdAt');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedFontSize = await AsyncStorage.getItem('fontSize');
      const savedFontFamily = await AsyncStorage.getItem('fontFamily');
      const savedSortBy = await AsyncStorage.getItem('sortBy');
      
      if (savedFontSize) setFontSizeState(savedFontSize);
      if (savedFontFamily) setFontFamilyState(savedFontFamily);
      if (savedSortBy) setSortByState(savedSortBy);
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
    }
  };

  const setFontSize = async (size: string) => {
    try {
      await AsyncStorage.setItem('fontSize', size);
      setFontSizeState(size);
    } catch (error) {
      console.error('Font size kaydedilirken hata:', error);
    }
  };

  const setFontFamily = async (family: string) => {
    try {
      await AsyncStorage.setItem('fontFamily', family);
      setFontFamilyState(family);
    } catch (error) {
      console.error('Font family kaydedilirken hata:', error);
    }
  };

  const setSortBy = async (sort: string) => {
    try {
      await AsyncStorage.setItem('sortBy', sort);
      setSortByState(sort);
    } catch (error) {
      console.error('Sıralama tercihi kaydedilirken hata:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      fontSize, 
      setFontSize, 
      fontFamily, 
      setFontFamily,
      sortBy, 
      setSortBy 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 