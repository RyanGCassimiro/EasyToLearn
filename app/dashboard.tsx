import React, { useState } from 'react';
import {
  View, Text, StyleSheet,
  ScrollView, useWindowDimensions, Pressable, Platform, TextInput, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Colors, roleColor, roleColorLight } from '../constants/theme';

type Tab          = 'perfil' | 'acesso' | 'admin';
type AdminSection = 'avisos' | 'servicos' | 'reservas';

const MOCK_PUBLIC_DATA = [
  { titulo: 'Manutenção programada', mensagem: 'Elevador fora de serviço das 8h–12h.' },
  { titulo: "Falta d'água", mensagem: 'Interrupção dia 20/04 das 9h às 14h.' },
];

type UserEntry  = { nome: string; email: string; role: string };
type Aviso      = { id: number; titulo: string; mensagem: string };
type Servico    = { id: number; nome: string; descricao: string; ativo: boolean };
type Reserva    = { id: number; espaco: string; data: string; horario: string; morador: string };
type CrudModal<T> = { mode: 'create' | 'edit'; draft: T } | null;

const BLANK_AVISO   : Aviso   = { id: 0, titulo: '', mensagem: '' };
const BLANK_SERVICO : Servico = { id: 0, nome: '', descricao: '', ativo: true };
const BLANK_RESERVA : Reserva = { id: 0, espaco: '', data: '', horario: '', morador: '' };

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('perfil');
  const [adminSection, setAdminSection] = useState<AdminSection>('avisos');
  const [blockedModal, setBlockedModal] = useState(false);
  const [avisosModal, setAvisosModal] = useState(false);

  // Usuários — leitura
  const [users] = useState<UserEntry[]>([
    { nome: 'Bruno Morador',  email: 'morador@easy.com',  role: 'morador'  },
    { nome: 'Ana Admin',      email: 'comercio@easy.com', role: 'comercio' },
    { nome: 'Carlos Silva',   email: 'carlos@easy.com',   role: 'morador'  },
  ]);

  // CRUD – Avisos
  const [avisos, setAvisos] = useState<Aviso[]>([
    { id: 1, titulo: 'Manutenção programada', mensagem: 'Elevador fora de serviço das 8h–12h.' },
    { id: 2, titulo: "Falta d'água",          mensagem: 'Interrupção dia 20/04 das 9h às 14h.' },
  ]);
  const [avisoModal, setAvisoModal] = useState<CrudModal<Aviso>>(null);

  // CRUD – Serviços
  const [servicos, setServicos] = useState<Servico[]>([
    { id: 1, nome: 'Academia',      descricao: 'Seg a Sex, 6h–22h',      ativo: true  },
    { id: 2, nome: 'Salão de Festas', descricao: 'Reserva antecipada',   ativo: true  },
    { id: 3, nome: 'Piscina',       descricao: 'Temporariamente fechada', ativo: false },
  ]);
  const [servicoModal, setServicoModal] = useState<CrudModal<Servico>>(null);

  // CRUD – Reservas
  const [reservas, setReservas] = useState<Reserva[]>([
    { id: 1, espaco: 'Salão de Festas', data: '25/04/2026', horario: '17h–21h', morador: 'Bruno Morador' },
    { id: 2, espaco: 'Academia',        data: '26/04/2026', horario: '07h–08h', morador: 'Carlos Silva'  },
  ]);
  const [reservaModal, setReservaModal] = useState<CrudModal<Reserva>>(null);

  // helpers genéricos
  const nextId = (list: { id: number }[]) => Math.max(0, ...list.map(x => x.id)) + 1;

  const saveAviso = () => {
    if (!avisoModal) return;
    const d = avisoModal.draft;
    if (!d.titulo) return;
    setAvisos(prev => avisoModal.mode === 'create'
      ? [...prev, { ...d, id: nextId(prev) }]
      : prev.map(a => a.id === d.id ? d : a));
    setAvisoModal(null);
  };

  const saveServico = () => {
    if (!servicoModal) return;
    const d = servicoModal.draft;
    if (!d.nome) return;
    setServicos(prev => servicoModal.mode === 'create'
      ? [...prev, { ...d, id: nextId(prev) }]
      : prev.map(s => s.id === d.id ? d : s));
    setServicoModal(null);
  };

  const saveReserva = () => {
    if (!reservaModal) return;
    const d = reservaModal.draft;
    if (!d.espaco || !d.morador) return;
    setReservas(prev => reservaModal.mode === 'create'
      ? [...prev, { ...d, id: nextId(prev) }]
      : prev.map(r => r.id === d.id ? d : r));
    setReservaModal(null);
  };

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
        {([
          { label: 'Meu Perfil',      onPress: () => setTab('perfil'),  active: tab === 'perfil'  },
          { label: 'Acesso ao Banco', onPress: () => setTab('acesso'),  active: tab === 'acesso'  },
          ...(isComerco ? [
            { label: 'Admin Data',    onPress: () => setTab('admin'),   active: tab === 'admin'   },
          ] : []),
          { label: 'Avisos',          onPress: () => setAvisosModal(true), active: false },
        ] as { label: string; onPress: () => void; active: boolean }[]).map(item => (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            style={({ hovered, pressed }: any) => [
              s.navItem,
              item.active && s.navItemActive,
              (hovered || pressed) && !item.active && s.navItemHover,
            ]}
          >
            <Text style={s.navItemText}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={({ hovered, pressed }: any) => [s.signOutBtn, (hovered || pressed) && s.signOutHover]}
        onPress={handleSignOut}
      >
        <Text style={s.signOutText}>Sair →</Text>
      </Pressable>
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
          <Pressable
            key={i}
            style={({ hovered, pressed }: any) => [s.noticeRow, (hovered || pressed) && s.noticeRowHover]}
            onPress={() => setAvisosModal(true)}
          >
            <Text style={[s.noticeDot, { color: accent }]}>●</Text>
            <View>
              <Text style={s.noticeTitle}>{item.titulo}</Text>
              <Text style={s.noticeMsg}>{item.mensagem}</Text>
            </View>
          </Pressable>
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
        <View style={[s.card, { borderLeftColor: accent }]}>
          <Text style={s.cardTitle}>USUÁRIOS CADASTRADOS</Text>
          {users.map((u, i) => (
            <Pressable key={i} style={({ hovered, pressed }: any) => [s.userRow, (hovered || pressed) && s.userRowHover]}>
              <View style={[s.avatar, { backgroundColor: accentL }]}>
                <Text style={[s.avatarText, { color: accent }]}>{u.nome[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.userName}>{u.nome}</Text>
                <Text style={s.userEmail}>{u.email}</Text>
              </View>
              <View style={[s.rolePill, { backgroundColor: accentL }]}>
                <Text style={[s.rolePillText, { color: accent }]}>{u.role}</Text>
              </View>
            </Pressable>
          ))}
        </View>
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

  // ── Helper: lista CRUD reutilizável ──────────────────────────────────────
  const CrudList = ({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) => (
    <View style={[s.card, { borderLeftColor: accent }]}>
      <View style={s.cardHeader}>
        <Text style={s.cardTitle}>{title}</Text>
        <Pressable style={({ hovered, pressed }: any) => [s.addBtn, { backgroundColor: accent }, (hovered || pressed) && s.addBtnHover]} onPress={onAdd}>
          <Text style={s.addBtnText}>+ Novo</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );

  const tabAdmin = (
    <ScrollView contentContainerStyle={s.content}>
      <Text style={s.pageTitle}>Admin Data</Text>
      <Text style={s.pageSubtitle}>Gerencie avisos, serviços e reservas do condomínio</Text>

      {/* Sub-tabs */}
      <View style={s.adminTabs}>
        {([
          { key: 'avisos',   label: '📢 Avisos'   },
          { key: 'servicos', label: '🔧 Serviços' },
          { key: 'reservas', label: '📅 Reservas' },
        ] as { key: AdminSection; label: string }[]).map(t => (
          <Pressable
            key={t.key}
            style={({ hovered, pressed }: any) => [
              s.adminTab,
              adminSection === t.key && [s.adminTabActive, { borderBottomColor: accent }],
              (hovered || pressed) && adminSection !== t.key && s.adminTabHover,
            ]}
            onPress={() => setAdminSection(t.key)}
          >
            <Text style={[s.adminTabText, adminSection === t.key && { color: accent, fontWeight: '700' }]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Avisos */}
      {adminSection === 'avisos' && (
        <CrudList title="AVISOS DO CONDOMÍNIO" onAdd={() => setAvisoModal({ mode: 'create', draft: { ...BLANK_AVISO } })}>
          {avisos.length === 0 && <Text style={s.emptyMsg}>Nenhum aviso cadastrado.</Text>}
          {avisos.map(a => (
            <Pressable key={a.id} style={({ hovered, pressed }: any) => [s.entityRow, (hovered || pressed) && s.entityRowHover]}>
              <View style={s.entityIconWrap}>
                <Text style={s.entityIcon}>📢</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.entityName}>{a.titulo}</Text>
                <Text style={s.entitySub}>{a.mensagem}</Text>
              </View>
              <Pressable style={({ hovered, pressed }: any) => [s.iconBtn, (hovered || pressed) && s.iconBtnHover]}
                onPress={() => setAvisoModal({ mode: 'edit', draft: { ...a } })}>
                <Text>✏️</Text>
              </Pressable>
              <Pressable style={({ hovered, pressed }: any) => [s.iconBtn, (hovered || pressed) && s.deleteBtnHover]}
                onPress={() => setAvisos(prev => prev.filter(x => x.id !== a.id))}>
                <Text>🗑</Text>
              </Pressable>
            </Pressable>
          ))}
        </CrudList>
      )}

      {/* Serviços */}
      {adminSection === 'servicos' && (
        <CrudList title="SERVIÇOS" onAdd={() => setServicoModal({ mode: 'create', draft: { ...BLANK_SERVICO } })}>
          {servicos.length === 0 && <Text style={s.emptyMsg}>Nenhum serviço cadastrado.</Text>}
          {servicos.map(sv => (
            <Pressable key={sv.id} style={({ hovered, pressed }: any) => [s.entityRow, (hovered || pressed) && s.entityRowHover]}>
              <View style={s.entityIconWrap}>
                <Text style={s.entityIcon}>🔧</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.entityName}>{sv.nome}</Text>
                <Text style={s.entitySub}>{sv.descricao}</Text>
              </View>
              <View style={[s.statusPill, { backgroundColor: sv.ativo ? Colors.greenL : Colors.redL }]}>
                <Text style={[s.statusText, { color: sv.ativo ? Colors.green : Colors.red }]}>{sv.ativo ? 'ativo' : 'inativo'}</Text>
              </View>
              <Pressable style={({ hovered, pressed }: any) => [s.iconBtn, (hovered || pressed) && s.iconBtnHover]}
                onPress={() => setServicoModal({ mode: 'edit', draft: { ...sv } })}>
                <Text>✏️</Text>
              </Pressable>
              <Pressable style={({ hovered, pressed }: any) => [s.iconBtn, (hovered || pressed) && s.deleteBtnHover]}
                onPress={() => setServicos(prev => prev.filter(x => x.id !== sv.id))}>
                <Text>🗑</Text>
              </Pressable>
            </Pressable>
          ))}
        </CrudList>
      )}

      {/* Reservas */}
      {adminSection === 'reservas' && (
        <CrudList title="RESERVAS DE ESPAÇO" onAdd={() => setReservaModal({ mode: 'create', draft: { ...BLANK_RESERVA } })}>
          {reservas.length === 0 && <Text style={s.emptyMsg}>Nenhuma reserva cadastrada.</Text>}
          {reservas.map(r => (
            <Pressable key={r.id} style={({ hovered, pressed }: any) => [s.entityRow, (hovered || pressed) && s.entityRowHover]}>
              <View style={s.entityIconWrap}>
                <Text style={s.entityIcon}>📅</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.entityName}>{r.espaco}</Text>
                <Text style={s.entitySub}>{r.data} · {r.horario}</Text>
                <Text style={[s.entitySub, { marginTop: 1 }]}>👤 {r.morador}</Text>
              </View>
              <Pressable style={({ hovered, pressed }: any) => [s.iconBtn, (hovered || pressed) && s.iconBtnHover]}
                onPress={() => setReservaModal({ mode: 'edit', draft: { ...r } })}>
                <Text>✏️</Text>
              </Pressable>
              <Pressable style={({ hovered, pressed }: any) => [s.iconBtn, (hovered || pressed) && s.deleteBtnHover]}
                onPress={() => setReservas(prev => prev.filter(x => x.id !== r.id))}>
                <Text>🗑</Text>
              </Pressable>
            </Pressable>
          ))}
        </CrudList>
      )}
    </ScrollView>
  );

  return (
    <View style={s.root}>
      {isDesktop ? (
        <>
          {sidebar}
          <View style={s.main}>
            {tab === 'perfil' ? tabPerfil : tab === 'admin' ? tabAdmin : tabAcesso}
          </View>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={[s.mobileHeader, { backgroundColor: accent }]}>
            <Text style={s.mobileHeaderLogo}>E<Text style={s.sidebarLogoEm}>a</Text>sy</Text>
            <Pressable
              style={({ hovered, pressed }: any) => (hovered || pressed) ? s.mobileSignOutHover : undefined}
              onPress={handleSignOut}
            >
              <Text style={s.mobileSignOut}>Sair</Text>
            </Pressable>
          </View>
          <View style={s.mobileTabs}>
            {([
              { label: 'Perfil',  key: 'perfil'  },
              { label: 'Acesso',  key: 'acesso'  },
              ...(isComerco ? [{ label: 'Admin', key: 'admin' }] : []),
            ] as { label: string; key: Tab }[]).map(t => (
              <Pressable
                key={t.key}
                style={({ hovered, pressed }: any) => [
                  s.mobileTab,
                  tab === t.key && { borderBottomColor: accent, borderBottomWidth: 2 },
                  (hovered || pressed) && tab !== t.key && s.mobileTabHover,
                ]}
                onPress={() => setTab(t.key)}
              >
                <Text style={[s.mobileTabText, tab === t.key && { color: accent }]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
          {tab === 'perfil' ? tabPerfil : tab === 'admin' ? tabAdmin : tabAcesso}
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
            <Pressable style={({ hovered, pressed }: any) => [s.modalBtn, { backgroundColor: accent }, (hovered || pressed) && s.modalBtnHover]} onPress={() => setAvisosModal(false)}>
              <Text style={s.modalBtnText}>Fechar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      )}

      {/* Modal – Aviso */}
      {avisoModal && (
        <Pressable style={s.modalOverlay} onPress={() => setAvisoModal(null)}>
          <Pressable style={[s.modalBox, { gap: 10 }]} onPress={(e) => e.stopPropagation()}>
            <Text style={s.modalTitle}>{avisoModal.mode === 'create' ? 'Novo Aviso' : 'Editar Aviso'}</Text>
            <TextInput style={[s.crudInput, { borderColor: accent }]} placeholder="Título" value={avisoModal.draft.titulo}
              onChangeText={v => setAvisoModal(m => m && ({ ...m, draft: { ...m.draft, titulo: v } }))} />
            <TextInput style={[s.crudInput, { borderColor: accent, minHeight: 72 }]} placeholder="Mensagem" value={avisoModal.draft.mensagem} multiline
              onChangeText={v => setAvisoModal(m => m && ({ ...m, draft: { ...m.draft, mensagem: v } }))} />
            <View style={s.crudBtns}>
              <Pressable style={({ hovered, pressed }: any) => [s.modalBtn, { backgroundColor: Colors.border }, (hovered || pressed) && s.modalBtnHover]} onPress={() => setAvisoModal(null)}>
                <Text style={[s.modalBtnText, { color: Colors.ink }]}>Cancelar</Text>
              </Pressable>
              <Pressable style={({ hovered, pressed }: any) => [s.modalBtn, { backgroundColor: accent }, (hovered || pressed) && s.modalBtnHover]} onPress={saveAviso}>
                <Text style={s.modalBtnText}>Salvar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      )}

      {/* Modal – Serviço */}
      {servicoModal && (
        <Pressable style={s.modalOverlay} onPress={() => setServicoModal(null)}>
          <Pressable style={[s.modalBox, { gap: 10 }]} onPress={(e) => e.stopPropagation()}>
            <Text style={s.modalTitle}>{servicoModal.mode === 'create' ? 'Novo Serviço' : 'Editar Serviço'}</Text>
            <TextInput style={[s.crudInput, { borderColor: accent }]} placeholder="Nome" value={servicoModal.draft.nome}
              onChangeText={v => setServicoModal(m => m && ({ ...m, draft: { ...m.draft, nome: v } }))} />
            <TextInput style={[s.crudInput, { borderColor: accent }]} placeholder="Descrição / horário" value={servicoModal.draft.descricao}
              onChangeText={v => setServicoModal(m => m && ({ ...m, draft: { ...m.draft, descricao: v } }))} />
            <View style={s.switchRow}>
              <Text style={s.adminKey}>Ativo</Text>
              <Switch value={servicoModal.draft.ativo}
                onValueChange={v => setServicoModal(m => m && ({ ...m, draft: { ...m.draft, ativo: v } }))}
                trackColor={{ false: Colors.border, true: accent }} thumbColor={Colors.white} />
            </View>
            <View style={s.crudBtns}>
              <Pressable style={({ hovered, pressed }: any) => [s.modalBtn, { backgroundColor: Colors.border }, (hovered || pressed) && s.modalBtnHover]} onPress={() => setServicoModal(null)}>
                <Text style={[s.modalBtnText, { color: Colors.ink }]}>Cancelar</Text>
              </Pressable>
              <Pressable style={({ hovered, pressed }: any) => [s.modalBtn, { backgroundColor: accent }, (hovered || pressed) && s.modalBtnHover]} onPress={saveServico}>
                <Text style={s.modalBtnText}>Salvar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      )}

      {/* Modal – Reserva */}
      {reservaModal && (
        <Pressable style={s.modalOverlay} onPress={() => setReservaModal(null)}>
          <Pressable style={[s.modalBox, { gap: 10 }]} onPress={(e) => e.stopPropagation()}>
            <Text style={s.modalTitle}>{reservaModal.mode === 'create' ? 'Nova Reserva' : 'Editar Reserva'}</Text>
            <TextInput style={[s.crudInput, { borderColor: accent }]} placeholder="Espaço (ex: Salão)" value={reservaModal.draft.espaco}
              onChangeText={v => setReservaModal(m => m && ({ ...m, draft: { ...m.draft, espaco: v } }))} />
            <TextInput style={[s.crudInput, { borderColor: accent }]} placeholder="Data (ex: 25/04/2026)" value={reservaModal.draft.data}
              onChangeText={v => setReservaModal(m => m && ({ ...m, draft: { ...m.draft, data: v } }))} />
            <TextInput style={[s.crudInput, { borderColor: accent }]} placeholder="Horário (ex: 17h–21h)" value={reservaModal.draft.horario}
              onChangeText={v => setReservaModal(m => m && ({ ...m, draft: { ...m.draft, horario: v } }))} />
            <TextInput style={[s.crudInput, { borderColor: accent }]} placeholder="Morador" value={reservaModal.draft.morador}
              onChangeText={v => setReservaModal(m => m && ({ ...m, draft: { ...m.draft, morador: v } }))} />
            <View style={s.crudBtns}>
              <Pressable style={({ hovered, pressed }: any) => [s.modalBtn, { backgroundColor: Colors.border }, (hovered || pressed) && s.modalBtnHover]} onPress={() => setReservaModal(null)}>
                <Text style={[s.modalBtnText, { color: Colors.ink }]}>Cancelar</Text>
              </Pressable>
              <Pressable style={({ hovered, pressed }: any) => [s.modalBtn, { backgroundColor: accent }, (hovered || pressed) && s.modalBtnHover]} onPress={saveReserva}>
                <Text style={s.modalBtnText}>Salvar</Text>
              </Pressable>
            </View>
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
            <Pressable style={({ hovered, pressed }: any) => [s.modalBtn, { backgroundColor: accent }, (hovered || pressed) && s.modalBtnHover]} onPress={() => setBlockedModal(false)}>
              <Text style={s.modalBtnText}>Entendi</Text>
            </Pressable>
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
  navItemHover: { backgroundColor: Colors.white + '15' },
  navItemText: { color: Colors.white, fontSize: 14, fontWeight: '500' },
  signOutBtn: { marginTop: 'auto' as any, paddingVertical: 10, ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}) },
  signOutHover: { opacity: 1 },
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
  noticeRow: { flexDirection: 'row', gap: 10, marginBottom: 10, borderRadius: 8, padding: 6, ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}) },
  noticeRowHover: { backgroundColor: Colors.sand },
  noticeDot: { fontSize: 10, marginTop: 4 },
  noticeTitle: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  noticeMsg: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  permRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  permPath: { fontSize: 13, color: Colors.ink, flex: 1 },
  permBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  permBadgeText: { fontSize: 12, fontWeight: '600' },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4, borderRadius: 8, padding: 8, ...(Platform.OS === 'web' ? { cursor: 'default' } as any : {}) },
  userRowHover: { backgroundColor: Colors.sand },
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
  modalBtn: { marginTop: 8, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 999, ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}) },
  modalBtnHover: { opacity: 0.85 },
  modalBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addBtn: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}) },
  addBtnHover: { opacity: 0.85 },
  addBtnText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  adminTabs: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 10, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  adminTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent', ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}) },
  adminTabActive: {},
  adminTabHover: { backgroundColor: Colors.sand },
  adminTabText: { fontSize: 13, fontWeight: '600', color: Colors.muted },
  emptyMsg: { fontSize: 13, color: Colors.muted, fontStyle: 'italic', paddingVertical: 8 },
  entityIconWrap: { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.sand, alignItems: 'center', justifyContent: 'center' },
  entityIcon: { fontSize: 18 },
  entityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  entityRowHover: { backgroundColor: Colors.sand },
  entityName: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  entitySub: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  statusPill: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  iconBtn: { padding: 6, borderRadius: 6, ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}) },
  iconBtnHover: { backgroundColor: Colors.sand },
  deleteBtnHover: { opacity: 0.6 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 4 },
  adminKey: { flex: 1, fontSize: 13, fontFamily: 'monospace', color: Colors.muted },
  crudInput: { width: '100%', borderWidth: 1.5, borderRadius: 8, padding: 10, fontSize: 15, color: Colors.ink },
  crudBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  roleSwitch: { flexDirection: 'row', gap: 8, width: '100%' },
  roleSwitchBtn: { flex: 1, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}) },
  roleSwitchHover: { backgroundColor: Colors.sand },
  roleSwitchText: { fontSize: 13, fontWeight: '600', color: Colors.muted },
  avisoItem: { width: '100%', borderLeftWidth: 3, paddingLeft: 12, paddingVertical: 6, marginBottom: 8 },
  avisoTitulo: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  avisoMsg: { fontSize: 13, color: Colors.muted, lineHeight: 18 },
  mobileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 48 },
  mobileHeaderLogo: { fontSize: 22, fontWeight: '800', color: Colors.white },
  mobileSignOut: { color: Colors.white, opacity: 0.8, fontSize: 14 },
  mobileTabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  mobileTab: { flex: 1, paddingVertical: 14, alignItems: 'center', ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}) },
  mobileTabHover: { backgroundColor: Colors.sand },
  mobileTabText: { fontSize: 14, fontWeight: '600', color: Colors.muted },
  mobileSignOutHover: { opacity: 1 },
});
