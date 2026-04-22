import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, Role } from '../context/AuthContext';
import { Colors, roleColor } from '../constants/theme';
import RoleToggle from '../components/RoleToggle';
import InputField from '../components/InputField';

export default function Cadastro() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const router = useRouter();
  const { signUp } = useAuth();

  const [role, setRole] = useState<Role>('morador');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [cpf, setCpf] = useState('');
  const [unidade, setUnidade] = useState('');
  const [torre, setTorre] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [nomeFan, setNomeFan] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const accent = roleColor(role);

  const handleCadastro = async () => {
    if (!nome || !email || !password) {
      Alert.alert('Preencha todos os campos obrigatórios.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('As senhas não coincidem.');
      return;
    }
    if (!terms) {
      Alert.alert('Aceite os Termos de Serviço para continuar.');
      return;
    }
    setLoading(true);
    try {
      await signUp({
        nome: role === 'comercio' ? nomeFan : nome,
        email,
        role,
        password,
        cpf: role === 'morador' ? cpf : undefined,
        unidade: role === 'morador' ? unidade : undefined,
        torre: role === 'morador' ? torre : undefined,
        cnpj: role === 'comercio' ? cnpj : undefined,
        nome_fantasia: role === 'comercio' ? nomeFan : undefined,
        responsavel: role === 'comercio' ? responsavel : undefined,
      });
      router.replace('/dashboard');
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <ScrollView contentContainerStyle={s.form}>
      <RoleToggle value={role} onChange={setRole} />
      <Text style={s.title}>Cadastro</Text>

      {role === 'morador' ? (
        <>
          <InputField label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome completo" accentColor={accent} />
          <InputField label="CPF" value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" keyboardType="numeric" accentColor={accent} />
          <View style={s.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <InputField label="Unidade" value={unidade} onChangeText={setUnidade} placeholder="101" accentColor={accent} />
            </View>
            <View style={{ flex: 1 }}>
              <InputField label="Torre/Quadra" value={torre} onChangeText={setTorre} placeholder="Torre A" accentColor={accent} />
            </View>
          </View>
        </>
      ) : (
        <>
          <InputField label="Nome Fantasia" value={nomeFan} onChangeText={setNomeFan} placeholder="Nome do estabelecimento" accentColor={accent} />
          <InputField label="CNPJ" value={cnpj} onChangeText={setCnpj} placeholder="00.000.000/0001-00" keyboardType="numeric" accentColor={accent} />
          <InputField label="Nome do Responsável" value={responsavel} onChangeText={setResponsavel} placeholder="Nome completo" accentColor={accent} />
        </>
      )}

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
});
