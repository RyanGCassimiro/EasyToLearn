import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Role } from '../context/AuthContext';
import { Colors } from '../constants/theme';

type Props = {
  value: Role;
  onChange: (role: Role) => void;
};

export default function RoleToggle({ value, onChange }: Props) {
  return (
    <View style={s.container}>
      <TouchableOpacity
        style={[s.option, value === 'morador' && { backgroundColor: Colors.teal }]}
        onPress={() => onChange('morador')}
      >
        <Text style={[s.label, value === 'morador' && s.labelActive]}>Morador</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[s.option, value === 'comercio' && { backgroundColor: Colors.blue }]}
        onPress={() => onChange('comercio')}
      >
        <Text style={[s.label, value === 'comercio' && s.labelActive]}>Comércio</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.sand,
    borderRadius: 999,
    padding: 3,
    alignSelf: 'center',
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.muted,
  },
  labelActive: {
    color: Colors.white,
  },
});
