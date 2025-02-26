import { StyleSheet, TouchableOpacity, Text, View, StyleProp, TextStyle } from "react-native";
import { Note } from "../../types";
import { useSettings } from "../../contexts/SettingsContext";

interface NoteCardProps {
  note: {
    id: string;
    title: string | React.ReactNode;
    content: string | React.ReactNode;
    createdAt: string;
  };
  onPress: () => void;
  onLongPress: () => void;
  isSelected: boolean;
  titleStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<TextStyle>;
}

export function NoteCard({ note, onPress, onLongPress, isSelected, titleStyle, contentStyle }: NoteCardProps) {
  const { fontFamily } = useSettings();

  return (
    <TouchableOpacity 
      style={[styles.noteCard, isSelected && styles.selectedCard]} 
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={200}
    >
      <View style={styles.contentContainer}>
        <Text style={[
          styles.noteTitle, 
          titleStyle,
          { fontFamily: fontFamily === 'system' ? undefined : fontFamily }
        ]}>
          {note.title}
        </Text>
        <Text 
          numberOfLines={2} 
          style={[
            styles.noteContent, 
            contentStyle,
            { fontFamily: fontFamily === 'system' ? undefined : fontFamily }
          ]}
        >
          {note.content}
        </Text>
        <Text style={[
          styles.dateText,
          { fontFamily: fontFamily === 'system' ? undefined : fontFamily }
        ]}>
          {note.createdAt}
        </Text>
      </View>
      {isSelected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  contentContainer: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  dateText: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  checkmark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  checkmarkText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#999',
  },
}); 