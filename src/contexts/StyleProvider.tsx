import { StyleSheet, View } from 'react-native';
import { useSettings } from './SettingsContext';

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const { fontFamily } = useSettings();
  
  StyleSheet.setStyleAttributePreprocessor('fontFamily', (family) => {
    return family === 'system' ? undefined : family;
  });

  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
} 