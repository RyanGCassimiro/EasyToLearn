import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/theme';
import InputField from '../components/InputField';

export default function Login() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password, 'user');
      router.replace('/dashboard');
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('wan@gmail.com');
    setPassword('123456');
  };

  const accent = Colors.teal;

  const form = (
    <View style={s.form}>
      <Text style={s.formTitle}>Acesse sua conta</Text>
      <Text style={[s.formSub, { color: accent }]}>LOGIN</Text>

      <InputField
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="e-mail@email.com"
        keyboardType="email-address"
        accentColor={accent}
      />
      <InputField
        label="Senha"
        value={password}
        onChangeText={setPassword}
        placeholder="ex: Abc123"
        isPassword
        accentColor={accent}
      />

      <TouchableOpacity
        style={[s.btnPrimary, { backgroundColor: accent }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={s.btnPrimaryText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <View style={s.row}>
        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={[s.link, { color: accent }]}>Registrar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.btnDemo} onPress={fillDemo}>
        <Text style={[s.btnDemoText, { color: accent }]}>Preencher dados demo</Text>
      </TouchableOpacity>

      <Text style={s.forgot}>Esqueci minha senha</Text>
      <Text style={s.footer}>EASY© 2026</Text>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={[s.desktop, { backgroundColor: accent }]}>
        <View style={[s.desktopLeft, { backgroundColor: accent }]}>
          <Text style={s.logoLarge}>
            E<Text style={s.logoEm}>a</Text>sy
          </Text>
          <Text style={s.tagline}>nunca foi tão fácil se conectar com pessoas</Text>
        </View>
        <View style={s.desktopRight}>{form}</View>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: Colors.cream }} contentContainerStyle={s.mobile}>
      <View style={[s.mobileLogo, { backgroundColor: accent }]}>
        <Text style={s.logoLarge}>
          E<Text style={s.logoEm}>a</Text>sy
        </Text>
        <Text style={s.tagline}>nunca foi tão fácil se conectar com pessoas</Text>
      </View>
      {form}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  desktop: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  desktopRight: {
    flex: 1,
    backgroundColor: Colors.cream,
    justifyContent: 'center',
    padding: 48,
  },
  mobile: {
    flexGrow: 1,
  },
  mobileLogo: {
    padding: 48,
    alignItems: 'center',
  },
  form: {
    padding: 32,
  },
  logoLarge: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -1,
  },
  logoEm: {
    fontStyle: 'italic',
  },
  tagline: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.85,
    marginTop: 8,
    textAlign: 'center',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.ink,
    marginTop: 24,
    marginBottom: 2,
  },
  formSub: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 20,
  },
  btnPrimary: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
  btnDemo: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.sand,
  },
  btnDemoText: {
    fontSize: 13,
    fontWeight: '600',
  },
  forgot: {
    textAlign: 'center',
    color: Colors.muted,
    fontSize: 13,
    marginTop: 14,
  },
  footer: {
    textAlign: 'center',
    color: Colors.border,
    fontSize: 11,
    marginTop: 32,
  },
});
