import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/theme';
import InputField from '../components/InputField';

export default function Cadastro() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'morador' | 'comercio'>('morador');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const accent = role === 'morador' ? Colors.teal : Colors.blue;

  const handleCadastro = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!name || !email || !password) {
      setErrorMsg('Preencha todos os campos obrigatórios.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }
    if (!terms) {
      setErrorMsg('Aceite os Termos de Serviço para continuar.');
      return;
    }
    setLoading(true);
    try {
      await signUp({ name, email, role, password });
      setSuccessMsg('Conta criada com sucesso! Faça login para continuar.');
      setTimeout(() => router.replace('/'), 2000);
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <ScrollView contentContainerStyle={s.form}>
      <Text style={s.title}>Cadastro</Text>

      {successMsg ? (
        <View style={s.bannerSuccess}><Text style={s.bannerSuccessText}>✓ {successMsg}</Text></View>
      ) : null}
      {errorMsg ? (
        <View style={s.bannerError}><Text style={s.bannerErrorText}>⚠ {errorMsg}</Text></View>
      ) : null}

      <View style={s.toggleRow}>
        <TouchableOpacity
          style={[s.toggleBtn, role === 'morador' && { backgroundColor: accent }]}
          onPress={() => setRole('morador')}
        >
          <Text style={[s.toggleText, role === 'morador' && s.toggleTextActive]}>🏠 Morador</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.toggleBtn, role === 'comercio' && { backgroundColor: Colors.blue }]}
          onPress={() => setRole('comercio')}
        >
          <Text style={[s.toggleText, role === 'comercio' && s.toggleTextActive]}>🏢 Comércio</Text>
        </TouchableOpacity>
      </View>

      <InputField label="Nome" value={name} onChangeText={setName} placeholder="Seu nome completo" accentColor={accent} />
      <InputField label="E-mail" value={email} onChangeText={setEmail} placeholder="e-mail@email.com" keyboardType="email-address" accentColor={accent} />
      <View style={s.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <InputField label="Senha" value={password} onChangeText={setPassword} placeholder="Mínimo 6 caracteres" isPassword accentColor={accent} />
        </View>
        <View style={{ flex: 1 }}>
          <InputField label="Confirmar Senha" value={confirm} onChangeText={setConfirm} placeholder="Repita a senha" isPassword accentColor={accent} />
        </View>
      </View>

      <TouchableOpacity style={s.checkRow} onPress={() => setTerms(t => !t)}>
        <View style={[s.check, terms && { backgroundColor: accent, borderColor: accent }]}>
          {terms && <Text style={s.checkMark}>✓</Text>}
        </View>
        <Text style={s.checkLabel}>
          Concordo com os{' '}
          <Text style={[s.checkLabelLink, { color: accent }]}>Termos de Serviço e Políticas de Privacidade</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.btnPrimary, { backgroundColor: accent }]}
        onPress={handleCadastro}
        disabled={loading}
      >
        <Text style={s.btnPrimaryText}>{loading ? 'Criando conta...' : 'Criar Conta'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.loginLink} onPress={() => router.back()}>
        <Text style={[s.loginLinkText, { color: accent }]}>Já possui conta? Fazer Login!</Text>
      </TouchableOpacity>

      <Text style={s.footer}>EASY© 2026</Text>
    </ScrollView>
  );

  if (isDesktop) {
    return (
      <View style={[s.desktop, { backgroundColor: accent }]}>
        <View style={s.desktopLeft}>
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
    <View style={{ flex: 1, backgroundColor: Colors.cream }}>
      <View style={[s.mobileLogo, { backgroundColor: accent }]}>
        <Text style={s.logoLarge}>
          E<Text style={s.logoEm}>a</Text>sy
        </Text>
      </View>
      {form}
    </View>
  );
}

const s = StyleSheet.create({
  desktop: { flex: 1, flexDirection: 'row' },
  desktopLeft: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 48 },
  desktopRight: { flex: 1, backgroundColor: Colors.cream },
  mobileLogo: { padding: 32, alignItems: 'center' },
  form: { padding: 32 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.ink, marginTop: 20, marginBottom: 20 },
  row: { flexDirection: 'row' },
  logoLarge: { fontSize: 48, fontWeight: '800', color: Colors.white, letterSpacing: -1 },
  logoEm: { fontStyle: 'italic' },
  tagline: { fontSize: 14, color: Colors.white, opacity: 0.85, marginTop: 8, textAlign: 'center' },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 4 },
  check: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: Colors.border, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  checkLabel: { flex: 1, fontSize: 13, color: Colors.muted },
  checkLabelLink: { fontWeight: '600' },
  btnPrimary: { borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  btnPrimaryText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  loginLink: { alignItems: 'center', paddingVertical: 8 },
  loginLinkText: { fontSize: 14, fontWeight: '600' },
  footer: { textAlign: 'center', color: Colors.border, fontSize: 11, marginTop: 24 },
  toggleRow: { flexDirection: 'row', backgroundColor: Colors.sand, borderRadius: 999, padding: 4, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: 'center' },
  toggleText: { fontSize: 14, fontWeight: '600', color: Colors.muted },
  toggleTextActive: { color: Colors.white },
  bannerSuccess: { backgroundColor: Colors.greenL, borderRadius: 8, padding: 12, marginBottom: 12 },
  bannerSuccessText: { color: Colors.green, fontWeight: '600', fontSize: 14 },
  bannerError: { backgroundColor: Colors.redL, borderRadius: 8, padding: 12, marginBottom: 12 },
  bannerErrorText: { color: Colors.red, fontWeight: '600', fontSize: 14 },
});
