import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  isPassword?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  accentColor?: string;
};

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  isPassword = false,
  keyboardType = 'default',
  accentColor = Colors.teal,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={s.wrapper}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.pill, { borderColor: accentColor + '55' }]}>
        <TextInput
          style={s.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.muted}
          secureTextEntry={isPassword && !visible}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setVisible(v => !v)} style={s.eye}>
            <Text style={[s.eyeText, { color: accentColor }]}>{visible ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 999,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: Colors.ink,
  },
  eye: {
    paddingLeft: 8,
  },
  eyeText: {
    fontSize: 16,
  },
});
