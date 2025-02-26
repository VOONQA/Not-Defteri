import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function MenuButton() {
  return (
    <TouchableOpacity 
      onPress={() => global.toggleMenu?.()}
      style={{
        padding: 12,
        minWidth: 44,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="ellipsis-vertical" size={24} color="#2c3e50" />
    </TouchableOpacity>
  );
} 