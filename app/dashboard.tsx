import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, useWindowDimensions, Modal, Pressable, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Colors, roleColor, roleColorLight } from '../constants/theme';

type Tab = 'perfil' | 'acesso';

const MOCK_ADMIN_DATA = {
  maxUsers: 100,
  maintenance: false,
  version: '1.0.4',
};

const MOCK_PUBLIC_DATA = [
  { titulo: 'Manutenção programada', mensagem: 'Elevador fora de serviço das 8h–12h.' },
  { titulo: "Falta d'água", mensagem: 'Interrupção dia 20/04 das 9h às 14h.' },
];

const MOCK_ALL_USERS = [
  { nome: 'Bruno Morador', email: 'morador@easy.com', role: 'morador' },
  { nome: 'Ana Admin', email: 'comercio@easy.com', role: 'comercio' },
];

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('perfil');
  const [blockedModal, setBlockedModal] = useState(false);
  const [avisosModal, setAvisosModal] = useState(false);

  if (!user) {
    router.replace('/');
    return null;
  }

  const accent = roleColor(user.role);
  const accentL = roleColorLight(user.role);
  const isComerco = user.role === 'comercio';

  const handleSignOut = () => {
    signOut();
    router.replace('/');
  };

  const sidebar = (
    <View style={[s.sidebar, { backgroundColor: accent }]}>
      <Text style={s.sidebarLogo}>
        E<Text style={s.sidebarLogoEm}>a</Text>sy
      </Text>
      <Text style={s.sidebarName}>{user.nome}</Text>
      <View style={[s.roleBadge, { backgroundColor: Colors.white + '22' }]}>
        <Text style={s.roleBadgeText}>{user.role}</Text>
      </View>

      <View style={s.navItems}>
        <TouchableOpacity
          style={[s.navItem, tab === 'perfil' && s.navItemActive]}
          onPress={() => setTab('perfil')}
        >
          <Text style={s.navItemText}>Meu Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.navItem, tab === 'acesso' && s.navItemActive]}
          onPress={() => setTab('acesso')}
        >
          <Text style={s.navItemText}>Acesso ao Banco</Text>
        </TouchableOpacity>
        {isComerco && (
          <>
            <TouchableOpacity style={s.navItem}>
              <Text style={s.navItemText}>Usuários</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.navItem}>
              <Text style={s.navItemText}>Admin Data</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={s.navItem} onPress={() => setAvisosModal(true)}>
          <Text style={s.navItemText}>Avisos</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut}>
        <Text style={s.signOutText}>Sair →</Text>
      </TouchableOpacity>
    </View>
  );

  const tabPerfil = (
    <ScrollView contentContainerStyle={s.content}>
      <Text style={s.pageTitle}>Meu Perfil</Text>
      <Text style={s.pageSubtitle}>Seus dados cadastrais</Text>

      <View style={[s.card, { borderLeftColor: accent }]}>
        <Text style={s.cardTitle}>DADOS CADASTRAIS</Text>
        <View style={s.dataRow}>
          <Text style={s.dataIcon}>👤</Text>
          <Text style={s.dataValue}>{user.nome}</Text>
        </View>
        <View style={s.dataRow}>
          <Text style={s.dataIcon}>✉</Text>
          <Text style={s.dataValue}>{user.email}</Text>
        </View>

        {user.unidade && (
          <View style={s.dataRow}>
            <Text style={s.dataIcon}>🏠</Text>
            <Text style={s.dataValue}>{user.unidade} — {user.torre}</Text>
          </View>
        )}
        {user.cnpj && (
          <View style={s.dataRow}>
            <Text style={s.dataIcon}>🏢</Text>
            <Text style={s.dataValue}>{user.cnpj}</Text>
          </View>
        )}
      </View>

      <View style={[s.card, { borderLeftColor: accent }]}>
        <Text style={s.cardTitle}>AVISOS DO CONDOMÍNIO</Text>
        {MOCK_PUBLIC_DATA.map((item, i) => (
          <View key={i} style={s.noticeRow}>
            <Text style={[s.noticeDot, { color: accent }]}>●</Text>
            <View>
              <Text style={s.noticeTitle}>{item.titulo}</Text>
              <Text style={s.noticeMsg}>{item.mensagem}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const tabAcesso = (
    <ScrollView contentContainerStyle={s.content}>
      <Text style={s.pageTitle}>Acesso ao Banco</Text>
      <Text style={s.pageSubtitle}>Permissões e dados por cargo</Text>

      <View style={[s.card, { borderLeftColor: accent }]}>
        <Text style={s.cardTitle}>SUAS PERMISSÕES (RLS)</Text>
        {[
          { path: '/users/{uid}', allowed: true },
          { path: '/users (lista completa)', allowed: isComerco },
          { path: '/admin_data', allowed: isComerco },
          { path: '/public_data', allowed: true },
        ].map((item, i) => (
          <View key={i} style={s.permRow}>
            <Text style={s.permPath}>{item.path}</Text>
            <View style={[s.permBadge, { backgroundColor: item.allowed ? Colors.greenL : Colors.redL }]}>
              <Text style={[s.permBadgeText, { color: item.allowed ? Colors.green : Colors.red }]}>
                {item.allowed ? '✓ permitido' : '✗ negado'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {isComerco ? (
        <>
          <View style={[s.card, { borderLeftColor: accent }]}>
            <Text style={s.cardTitle}>USERS — TODOS</Text>
            {MOCK_ALL_USERS.map((u, i) => (
              <View key={i} style={s.userRow}>
                <View style={[s.avatar, { backgroundColor: accentL }]}>
                  <Text style={[s.avatarText, { color: accent }]}>{u.nome[0]}</Text>
                </View>
                <View>
                  <Text style={s.userName}>{u.nome}</Text>
                  <Text style={s.userEmail}>{u.email}</Text>
                </View>
                <View style={[s.rolePill, { backgroundColor: accentL }]}>
                  <Text style={[s.rolePillText, { color: accent }]}>{u.role}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[s.card, { borderLeftColor: accent }]}>
            <Text style={s.cardTitle}>ADMIN DATA/SETTINGS</Text>
            <Text style={s.codeBlock}>{JSON.stringify(MOCK_ADMIN_DATA, null, 2)}</Text>
          </View>
        </>
      ) : (
        <View style={s.blockedRow}>
          {(['Usuários', 'Admin Data'] as const).map((label) => (
            <Pressable
              key={label}
              onPress={() => setBlockedModal(true)}
              style={({ pressed, hovered }: any) => [
                s.blockedPanel,
                (hovered || pressed) && s.blockedPanelHover,
              ]}
            >
              {({ pressed, hovered }: any) => (
                <>
                  <Text style={s.blockedIcon}>🔒</Text>
                  <Text style={s.blockedTitle}>ACESSO NEGADO</Text>
                  <Text style={s.blockedSub}>{label}</Text>
                  <Text style={[s.blockedHint, (hovered || pressed) && { opacity: 1 }]}>
                    {Platform.OS === 'web' ? 'clique para saber mais' : 'toque para saber mais'}
                  </Text>
                </>
              )}
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={s.root}>
      {isDesktop ? (
        <>
          {sidebar}
          <View style={s.main}>{tab === 'perfil' ? tabPerfil : tabAcesso}</View>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={[s.mobileHeader, { backgroundColor: accent }]}>
            <Text style={s.mobileHeaderLogo}>E<Text style={s.sidebarLogoEm}>a</Text>sy</Text>
            <TouchableOpacity onPress={handleSignOut}>
              <Text style={s.mobileSignOut}>Sair</Text>
            </TouchableOpacity>
          </View>
          <View style={s.mobileTabs}>
            <TouchableOpacity
              style={[s.mobileTab, tab === 'perfil' && { borderBottomColor: accent, borderBottomWidth: 2 }]}
              onPress={() => setTab('perfil')}
            >
              <Text style={[s.mobileTabText, tab === 'perfil' && { color: accent }]}>Meu Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.mobileTab, tab === 'acesso' && { borderBottomColor: accent, borderBottomWidth: 2 }]}
              onPress={() => setTab('acesso')}
            >
              <Text style={[s.mobileTabText, tab === 'acesso' && { color: accent }]}>Acesso ao Banco</Text>
            </TouchableOpacity>
          </View>
          {tab === 'perfil' ? tabPerfil : tabAcesso}
        </View>
      )}

      {avisosModal && (
        <Pressable style={s.modalOverlay} onPress={() => setAvisosModal(false)}>
          <Pressable style={s.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={s.modalIcon}>📢</Text>
            <Text style={s.modalTitle}>Avisos do Condomínio</Text>
            {MOCK_PUBLIC_DATA.map((item, i) => (
              <View key={i} style={[s.avisoItem, { borderLeftColor: accent }]}>
                <Text style={[s.avisoTitulo, { color: accent }]}>{item.titulo}</Text>
                <Text style={s.avisoMsg}>{item.mensagem}</Text>
              </View>
            ))}
            <TouchableOpacity style={[s.modalBtn, { backgroundColor: accent }]} onPress={() => setAvisosModal(false)}>
              <Text style={s.modalBtnText}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}

      {blockedModal && (
        <Pressable style={s.modalOverlay} onPress={() => setBlockedModal(false)}>
          <Pressable style={s.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={s.modalIcon}>🔒</Text>
            <Text style={s.modalTitle}>Acesso Negado</Text>
            <Text style={s.modalBody}>
              Você não tem permissão para visualizar este conteúdo.{'\n\n'}
              Apenas usuários com cargo <Text style={s.modalEm}>Comércio</Text> podem acessar os dados administrativos e a lista de usuários.
            </Text>
            <TouchableOpacity style={[s.modalBtn, { backgroundColor: accent }]} onPress={() => setBlockedModal(false)}>
              <Text style={s.modalBtnText}>Entendi</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: Colors.cream, position: 'relative' },
  sidebar: { width: 200, paddingTop: 40, paddingHorizontal: 16, paddingBottom: 24 },
  sidebarLogo: { fontSize: 28, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  sidebarLogoEm: { fontStyle: 'italic' },
  sidebarName: { color: Colors.white, fontWeight: '600', marginTop: 16, fontSize: 14 },
  roleBadge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6 },
  roleBadgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  navItems: { marginTop: 32, gap: 4 },
  navItem: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  navItemActive: { backgroundColor: Colors.white + '22' },
  navItemText: { color: Colors.white, fontSize: 14, fontWeight: '500' },
  signOutBtn: { marginTop: 'auto' as any, paddingVertical: 10 },
  signOutText: { color: Colors.white, opacity: 0.7, fontSize: 13 },
  main: { flex: 1 },
  content: { padding: 32 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: Colors.ink },
  pageSubtitle: { fontSize: 13, color: Colors.muted, marginBottom: 24, marginTop: 4 },
  card: { backgroundColor: Colors.white, borderRadius: 12, padding: 20, marginBottom: 16, borderLeftWidth: 4 },
  cardTitle: { fontSize: 11, fontWeight: '700', color: Colors.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
  dataRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  dataIcon: { fontSize: 16, width: 24 },
  dataValue: { fontSize: 14, color: Colors.ink, fontWeight: '500' },
  noticeRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  noticeDot: { fontSize: 10, marginTop: 4 },
  noticeTitle: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  noticeMsg: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  permRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  permPath: { fontSize: 13, color: Colors.ink, flex: 1 },
  permBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  permBadgeText: { fontSize: 12, fontWeight: '600' },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '700', fontSize: 15 },
  userName: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  userEmail: { fontSize: 12, color: Colors.muted },
  rolePill: { marginLeft: 'auto' as any, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  rolePillText: { fontSize: 11, fontWeight: '700' },
  codeBlock: { fontFamily: 'monospace', fontSize: 12, color: Colors.ink, backgroundColor: Colors.cream, padding: 12, borderRadius: 8 },
  blockedRow: { flexDirection: 'row', gap: 16 },
  blockedPanel: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 12, padding: 24,
    alignItems: 'center', gap: 8,
    borderWidth: 2, borderColor: 'transparent',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  blockedPanelHover: {
    borderColor: Colors.red,
    backgroundColor: Colors.redL,
    transform: [{ scale: 1.02 }],
  },
  blockedIcon: { fontSize: 28 },
  blockedTitle: { fontSize: 14, fontWeight: '700', color: Colors.red },
  blockedSub: { fontSize: 12, color: Colors.muted },
  blockedHint: { fontSize: 11, color: Colors.muted, opacity: 0.4, marginTop: 4 },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 24, zIndex: 999 },
  modalBox: { backgroundColor: Colors.white, borderRadius: 16, padding: 28, width: '100%', maxWidth: 400, alignItems: 'center', gap: 12 },
  modalIcon: { fontSize: 40 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.red },
  modalBody: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 22 },
  modalEm: { fontWeight: '700', color: Colors.ink },
  modalBtn: { marginTop: 8, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 999 },
  modalBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  avisoItem: { width: '100%', borderLeftWidth: 3, paddingLeft: 12, paddingVertical: 6, marginBottom: 8 },
  avisoTitulo: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  avisoMsg: { fontSize: 13, color: Colors.muted, lineHeight: 18 },
  mobileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 48 },
  mobileHeaderLogo: { fontSize: 22, fontWeight: '800', color: Colors.white },
  mobileSignOut: { color: Colors.white, opacity: 0.8, fontSize: 14 },
  mobileTabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  mobileTab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  mobileTabText: { fontSize: 14, fontWeight: '600', color: Colors.muted },
});
