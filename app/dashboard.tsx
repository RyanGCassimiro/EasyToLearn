import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  ScrollView, useWindowDimensions, Pressable, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ref, set, get, remove, push } from 'firebase/database';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/theme';
import { db } from '../lib/firebase';

type Tab = 'perfil' | 'acesso' | 'admin';

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Aviso = { id: string; titulo: string; mensagem: string; categoria: string; data: string };
type Reserva = { id: string; local: string; dia: string; mes: string; descricao: string };

// ─── Categorias de aviso ──────────────────────────────────────────────────────
const CATEGORIAS = ['Piscina', 'Elevador', 'Portaria', 'Manutenção', 'Geral'];
const LOCAIS = ['Salão de Festas', 'Churrasqueira', 'Quadra', 'Piscina', 'Espaço Gourmet'];

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [tab, setTab] = useState<Tab>('perfil');
  const [blockedModal, setBlockedModal] = useState(false);
  const [reservaModal, setReservaModal] = useState(false);
  const [novaReservaModal, setNovaReservaModal] = useState({ local: 'Salão de Festas', dia: '', mes: MESES[new Date().getMonth()] });

  // Avisos
  const [avisosDB, setAvisosDB] = useState<Aviso[]>([]);
  const [selectedAviso, setSelectedAviso] = useState<Aviso | null>(null);

  // CRUD Admin – Avisos
  const [novoAviso, setNovoAviso] = useState({ titulo: '', mensagem: '', categoria: 'Geral' });
  const [editAviso, setEditAviso] = useState<Aviso | null>(null);

  // CRUD Admin – Reservas
  const [reservasDB, setReservasDB] = useState<Reserva[]>([]);
  const [novaReserva, setNovaReserva] = useState({ local: 'Salão de Festas', dia: '', mes: '', descricao: '' });
  const [editReserva, setEditReserva] = useState<Reserva | null>(null);

  // Carrega dados do Firebase (e faz seed se vazio)
  useEffect(() => {
    if (!db) return;
    get(ref(db, 'avisos')).then(async snap => {
      if (snap.exists()) {
        const data = snap.val();
        setAvisosDB(Object.keys(data).map(k => ({ id: k, ...data[k] })));
      } else {
        // Seed inicial com avisos de exemplo
        const seeds = [
          { titulo: 'Manutenção da Piscina', mensagem: 'A piscina estará fora de serviço no dia 14/05 das 8:00 às 17:00 hrs para manutenção preventiva anual. Pedimos desculpas pelo inconveniente.', categoria: 'Piscina', data: '14/05/2026' },
          { titulo: 'Manutenção do Elevador', mensagem: 'O elevador passará por revisão técnica obrigatória no dia 16/05 das 9:00 às 13:00 hrs. Durante esse período utilize a escada. A empresa Elevadores TechLift realizará o serviço.', categoria: 'Elevador', data: '16/05/2026' },
          { titulo: 'Reunião de Condomínio', mensagem: 'Reunião ordinária de condomínio no dia 20/05 às 19:00 hrs no salão de festas. Pauta: aprovação de contas e eleição de síndico.', categoria: 'Geral', data: '20/05/2026' },
        ];
        const inserted: Aviso[] = [];
        for (const s of seeds) {
          const newRef = push(ref(db, 'avisos'));
          await set(newRef, s);
          inserted.push({ id: newRef.key!, ...s });
        }
        setAvisosDB(inserted);
      }
    });
    get(ref(db, 'reservas')).then(snap => {
      if (snap.exists()) {
        const data = snap.val();
        setReservasDB(Object.keys(data).map(k => ({ id: k, ...data[k] })));
      }
    });
  }, [tab]);

  if (!user) { router.replace('/'); return null; }

  const accent = user.role === 'comercio' ? Colors.blue : user.role === 'admin' ? Colors.blue : Colors.teal;
  const accentL = user.role === 'morador' ? Colors.tealL : Colors.blueL;
  const isAdmin = user.role === 'admin' || user.role === 'comercio';

  const handleSignOut = async () => { await signOut(); router.replace('/'); };

  // ─── CRUD Avisos ────────────────────────────────────────────────────────────
  const salvarAviso = async () => {
    if (!db || !novoAviso.titulo || !novoAviso.mensagem) return;
    const data = new Date().toLocaleDateString('pt-BR');
    const novo = { ...novoAviso, data };
    const newRef = push(ref(db, 'avisos'));
    await set(newRef, novo);
    const id = newRef.key!;
    setAvisosDB(prev => [...prev, { id, ...novo }]);
    setNovoAviso({ titulo: '', mensagem: '', categoria: 'Geral' });
  };

  const atualizarAviso = async () => {
    if (!db || !editAviso) return;
    await set(ref(db, `avisos/${editAviso.id}`), {
      titulo: editAviso.titulo, mensagem: editAviso.mensagem,
      categoria: editAviso.categoria, data: editAviso.data,
    });
    setAvisosDB(prev => prev.map(a => a.id === editAviso.id ? editAviso : a));
    setEditAviso(null);
  };

  const deletarAviso = async (id: string) => {
    if (!db) return;
    await remove(ref(db, `avisos/${id}`));
    setAvisosDB(prev => prev.filter(a => a.id !== id));
  };

  // ─── CRUD Reservas ──────────────────────────────────────────────────────────
  const salvarReserva = async () => {
    if (!db || !novaReserva.dia || !novaReserva.mes) return;
    const newRef = push(ref(db, 'reservas'));
    await set(newRef, novaReserva);
    const id = newRef.key!;
    setReservasDB(prev => [...prev, { id, ...novaReserva }]);
    setNovaReserva({ local: 'Salão de Festas', dia: '', mes: '', descricao: '' });
  };

  const atualizarReserva = async () => {
    if (!db || !editReserva) return;
    await set(ref(db, `reservas/${editReserva.id}`), {
      local: editReserva.local, dia: editReserva.dia,
      mes: editReserva.mes, descricao: editReserva.descricao,
    });
    setReservasDB(prev => prev.map(r => r.id === editReserva.id ? editReserva : r));
    setEditReserva(null);
  };

  const deletarReserva = async (id: string) => {
    if (!db) return;
    await remove(ref(db, `reservas/${id}`));
    setReservasDB(prev => prev.filter(r => r.id !== id));
  };

  const salvarReservaModal = async () => {
    if (!db || !novaReservaModal.dia || !novaReservaModal.mes) return;
    const ano = new Date().getFullYear().toString();
    const dados = { local: novaReservaModal.local, dia: novaReservaModal.dia, mes: novaReservaModal.mes, ano, descricao: '', uid: user.uid };
    const newRef = push(ref(db, 'reservas'));
    await set(newRef, dados);
    setReservasDB(prev => [...prev, { id: newRef.key!, ...dados }]);
    setNovaReservaModal({ local: 'Salão de Festas', dia: '', mes: MESES[new Date().getMonth()] });
    setReservaModal(false);
  };

  // ─── Sidebar ────────────────────────────────────────────────────────────────
  const sidebar = (
    <View style={[s.sidebar, { backgroundColor: accent }]}>
      <Text style={s.sidebarLogo}>E<Text style={s.sidebarLogoEm}>a</Text>sy</Text>
      <Text style={s.sidebarName}>{user.name}</Text>
      <View style={s.badgeRow}>
        <View style={[s.roleBadge, { backgroundColor: Colors.white + '22' }]}>
          <Text style={s.roleBadgeText}>{user.role}</Text>
        </View>
        {isAdmin && (
          <View style={[s.roleBadge, { backgroundColor: Colors.amber + 'CC' }]}>
            <Text style={s.roleBadgeText}>⭐ admin</Text>
          </View>
        )}
      </View>

      <View style={s.navItems}>
        <NavItem label="Meu Perfil" active={tab === 'perfil'} onPress={() => setTab('perfil')} />
        <NavItem label="Acesso ao Banco" active={tab === 'acesso'} onPress={() => setTab('acesso')} />
        {!isAdmin && (
          <NavItem label="Reservar Espaço" active={false} onPress={() => setReservaModal(true)} />
        )}
        {isAdmin && (
          <NavItem label="Admin Data" active={tab === 'admin'} onPress={() => setTab('admin')} />
        )}
      </View>

      <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut}>
        <Text style={s.signOutText}>Sair →</Text>
      </TouchableOpacity>
    </View>
  );

  // ─── Tab Perfil ─────────────────────────────────────────────────────────────
  const tabPerfil = (
    <ScrollView contentContainerStyle={s.content}>
      <Text style={s.pageTitle}>Meu Perfil</Text>
      <Text style={s.pageSubtitle}>Seus dados cadastrais</Text>
      <View style={[s.card, { borderLeftColor: accent }]}>
        <Text style={s.cardTitle}>DADOS CADASTRAIS</Text>
        <DataRow icon="👤" value={user.name} />
        <DataRow icon="✉" value={user.email} />
        <DataRow icon="🏷" value={user.role} />
      </View>

      {!isAdmin && (
        <>
          <Text style={s.sectionLabel}>🏛 MINHAS RESERVAS</Text>
          <View style={[s.card, { borderLeftColor: Colors.teal }]}>
            {reservasDB.filter(r => (r as any).uid === user.uid).length === 0
              ? <Text style={s.emptyText}>Nenhuma reserva feita ainda.</Text>
              : reservasDB.filter(r => (r as any).uid === user.uid).map((res, i, arr) => (
                <View key={res.id} style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
                  <View>
                    <Text style={s.crudTitle}>{res.local}</Text>
                    <Text style={s.crudDate}>{res.dia} de {res.mes} • {(res as any).ano ?? new Date().getFullYear()}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deletarReserva(res.id)} style={[s.btnDelete, { marginTop: 0 }]}>
                    <Text style={s.btnDeleteText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
          </View>
          <Text style={s.sectionLabel}>📢 AVISOS DO CONDOMÍNIO</Text>
          {avisosDB.length === 0 && <Text style={s.emptyText}>Nenhum aviso no momento.</Text>}
          {avisosDB.map((item) => {
            const catColor = item.categoria === 'Piscina' ? Colors.blue
              : item.categoria === 'Elevador' ? Colors.amber
              : item.categoria === 'Portaria' ? Colors.teal
              : Colors.muted;
            const catIcon = item.categoria === 'Piscina' ? '🏊'
              : item.categoria === 'Elevador' ? '🛗'
              : item.categoria === 'Portaria' ? '🚪'
              : item.categoria === 'Manutenção' ? '🔧' : '📋';
            return (
              <Pressable
                key={item.id}
                onPress={() => setSelectedAviso(item)}
                style={({ pressed, hovered }: any) => [
                  s.avisoBlocoCard,
                  { borderLeftColor: catColor },
                  (pressed || hovered) && s.avisoBlocoHover,
                ]}
              >
                <View style={s.avisoBlocoTop}>
                  <Text style={s.avisoBlocoIcon}>{catIcon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.avisoBlocoTitulo}>{item.titulo}</Text>
                    <Text style={s.avisoBlocoMsg} numberOfLines={2}>{item.mensagem}</Text>
                  </View>
                  <Text style={[s.noticeChevron, { color: catColor }]}>›</Text>
                </View>
                <View style={s.avisoBlocoFooter}>
                  <View style={[s.catChip, { backgroundColor: catColor + '18', marginBottom: 0, marginRight: 0 }]}>
                    <Text style={[s.catChipText, { color: catColor }]}>{item.categoria}</Text>
                  </View>
                  <Text style={s.crudDate}>{item.data}</Text>
                </View>
              </Pressable>
            );
          })}
        </>
      )}
    </ScrollView>
  );

  // ─── Tab Acesso ─────────────────────────────────────────────────────────────
  const tabAcesso = (
    <ScrollView contentContainerStyle={s.content}>
      <Text style={s.pageTitle}>Acesso ao Banco</Text>
      <Text style={s.pageSubtitle}>Permissões por cargo</Text>
      <View style={[s.card, { borderLeftColor: accent }]}>
        <Text style={s.cardTitle}>SUAS PERMISSÕES (RLS)</Text>
        {[
          { path: '/usuarios/{uid}', allowed: true },
          { path: '/usuarios (lista completa)', allowed: isAdmin },
          { path: '/admin_data', allowed: isAdmin },
          { path: '/avisos', allowed: true },
          { path: '/reservas', allowed: true },
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

      {!isAdmin && (
        <View style={s.blockedRow}>
          {(['Reservas', 'Admin Data'] as const).map((label) => (
            <Pressable
              key={label}
              onPress={() => setBlockedModal(true)}
              style={({ pressed, hovered }: any) => [
                s.blockedPanel,
                (pressed || hovered) && s.blockedPanelHover,
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

  // ─── Tab Admin Data ──────────────────────────────────────────────────────────
  const tabAdmin = (
    <ScrollView contentContainerStyle={s.content}>
      <Text style={s.pageTitle}>Admin Data</Text>
      <Text style={s.pageSubtitle}>Gerencie avisos e reservas do condomínio</Text>

      {/* ── Mural de Avisos ── */}
      <Text style={s.sectionLabel}>📢 MURAL DE AVISOS</Text>

      <View style={[s.card, { borderLeftColor: accent }]}>
        <Text style={s.cardTitle}>NOVO AVISO</Text>
        <TextInput
          style={s.input} placeholder="Título" value={novoAviso.titulo}
          onChangeText={v => setNovoAviso(p => ({ ...p, titulo: v }))}
        />
        <TextInput
          style={[s.input, s.inputMulti]} placeholder="Mensagem" multiline
          value={novoAviso.mensagem}
          onChangeText={v => setNovoAviso(p => ({ ...p, mensagem: v }))}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {CATEGORIAS.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setNovoAviso(p => ({ ...p, categoria: cat }))}
              style={[s.catChip, novoAviso.categoria === cat && { backgroundColor: accent }]}
            >
              <Text style={[s.catChipText, novoAviso.categoria === cat && { color: Colors.white }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={[s.btnSave, { backgroundColor: accent }]} onPress={salvarAviso}>
          <Text style={s.btnSaveText}>+ Publicar Aviso</Text>
        </TouchableOpacity>
      </View>

      {avisosDB.map(aviso => (
        <View key={aviso.id} style={[s.card, { borderLeftColor: accent }]}>
          {editAviso?.id === aviso.id ? (
            <>
              <TextInput style={s.input} value={editAviso.titulo} onChangeText={v => setEditAviso(p => p ? { ...p, titulo: v } : p)} />
              <TextInput style={[s.input, s.inputMulti]} multiline value={editAviso.mensagem} onChangeText={v => setEditAviso(p => p ? { ...p, mensagem: v } : p)} />
              <View style={s.crudRow}>
                <TouchableOpacity style={[s.btnSave, { backgroundColor: accent, flex: 1 }]} onPress={atualizarAviso}>
                  <Text style={s.btnSaveText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btnCancel, { flex: 1 }]} onPress={() => setEditAviso(null)}>
                  <Text style={s.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={s.crudHeader}>
                <View style={[s.catChip, { backgroundColor: accentL, marginBottom: 0 }]}>
                  <Text style={[s.catChipText, { color: accent }]}>{aviso.categoria}</Text>
                </View>
                <Text style={s.crudDate}>{aviso.data}</Text>
              </View>
              <Text style={s.crudTitle}>{aviso.titulo}</Text>
              <Text style={s.crudMsg}>{aviso.mensagem}</Text>
              <View style={s.crudRow}>
                <TouchableOpacity style={s.btnEdit} onPress={() => setEditAviso(aviso)}>
                  <Text style={[s.btnEditText, { color: accent }]}>✏ Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnDelete} onPress={() => deletarAviso(aviso.id)}>
                  <Text style={s.btnDeleteText}>🗑 Excluir</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      ))}

      {/* ── Reservas de Espaço ── */}
      <Text style={[s.sectionLabel, { marginTop: 8 }]}>🏛 RESERVAS DE ESPAÇO</Text>

      <View style={[s.card, { borderLeftColor: Colors.blue }]}>
        <Text style={s.cardTitle}>NOVA RESERVA</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {LOCAIS.map(loc => (
            <TouchableOpacity
              key={loc}
              onPress={() => setNovaReserva(p => ({ ...p, local: loc }))}
              style={[s.catChip, novaReserva.local === loc && { backgroundColor: Colors.blue }]}
            >
              <Text style={[s.catChipText, novaReserva.local === loc && { color: Colors.white }]}>{loc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={s.rowInputs}>
          <TextInput
            style={[s.input, { flex: 1, marginRight: 8 }]} placeholder="Dia (ex: 25)"
            value={novaReserva.dia} keyboardType="numeric"
            onChangeText={v => setNovaReserva(p => ({ ...p, dia: v }))}
          />
          <TextInput
            style={[s.input, { flex: 1 }]} placeholder="Mês (ex: Maio)"
            value={novaReserva.mes}
            onChangeText={v => setNovaReserva(p => ({ ...p, mes: v }))}
          />
        </View>
        <TextInput
          style={s.input} placeholder="Observação (opcional)"
          value={novaReserva.descricao}
          onChangeText={v => setNovaReserva(p => ({ ...p, descricao: v }))}
        />
        <TouchableOpacity style={[s.btnSave, { backgroundColor: Colors.blue }]} onPress={salvarReserva}>
          <Text style={s.btnSaveText}>+ Reservar Espaço</Text>
        </TouchableOpacity>
      </View>

      {reservasDB.map(res => (
        <View key={res.id} style={[s.card, { borderLeftColor: Colors.blue }]}>
          {editReserva?.id === res.id ? (
            <>
              <View style={s.rowInputs}>
                <TextInput style={[s.input, { flex: 1, marginRight: 8 }]} value={editReserva.dia} onChangeText={v => setEditReserva(p => p ? { ...p, dia: v } : p)} placeholder="Dia" />
                <TextInput style={[s.input, { flex: 1 }]} value={editReserva.mes} onChangeText={v => setEditReserva(p => p ? { ...p, mes: v } : p)} placeholder="Mês" />
              </View>
              <TextInput style={s.input} value={editReserva.descricao} onChangeText={v => setEditReserva(p => p ? { ...p, descricao: v } : p)} placeholder="Observação" />
              <View style={s.crudRow}>
                <TouchableOpacity style={[s.btnSave, { backgroundColor: Colors.blue, flex: 1 }]} onPress={atualizarReserva}>
                  <Text style={s.btnSaveText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btnCancel, { flex: 1 }]} onPress={() => setEditReserva(null)}>
                  <Text style={s.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={s.crudHeader}>
                <Text style={[s.crudTitle, { color: Colors.blue }]}>{res.local}</Text>
                <Text style={s.crudDate}>{res.dia} de {res.mes}</Text>
              </View>
              {res.descricao ? <Text style={s.crudMsg}>{res.descricao}</Text> : null}
              <View style={s.crudRow}>
                <TouchableOpacity style={s.btnEdit} onPress={() => setEditReserva(res)}>
                  <Text style={[s.btnEditText, { color: Colors.blue }]}>✏ Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnDelete} onPress={() => deletarReserva(res.id)}>
                  <Text style={s.btnDeleteText}>🗑 Excluir</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );

  const renderTab = () => {
    if (tab === 'perfil') return tabPerfil;
    if (tab === 'acesso') return tabAcesso;
    if (tab === 'admin' && isAdmin) return tabAdmin;
    return tabPerfil;
  };

  return (
    <View style={s.root}>
      {isDesktop ? (
        <>
          {sidebar}
          <View style={s.main}>{renderTab()}</View>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={[s.mobileHeader, { backgroundColor: accent }]}>
            <Text style={s.mobileHeaderLogo}>E<Text style={s.sidebarLogoEm}>a</Text>sy</Text>
            <TouchableOpacity onPress={handleSignOut}>
              <Text style={s.mobileSignOut}>Sair</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal style={s.mobileTabs} showsHorizontalScrollIndicator={false}>
            {(['perfil', 'acesso'] as Tab[]).concat(isAdmin ? ['admin'] : []).map(t => (
              <TouchableOpacity
                key={t}
                style={[s.mobileTab, tab === t && { borderBottomColor: accent, borderBottomWidth: 2 }]}
                onPress={() => { if (t !== 'admin' || isAdmin) setTab(t); }}
              >
                <Text style={[s.mobileTabText, tab === t && { color: accent }]}>
                  {t === 'perfil' ? 'Perfil' : t === 'acesso' ? 'Acesso' : 'Admin'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {renderTab()}
        </View>
      )}

      {/* ── Modal Aviso Detalhe (morador) ── */}
      {selectedAviso && (
        <Pressable style={s.modalOverlay} onPress={() => setSelectedAviso(null)}>
          <Pressable style={s.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={s.modalIcon}>
              {selectedAviso.categoria === 'Piscina' ? '🏊'
                : selectedAviso.categoria === 'Elevador' ? '🛗'
                : selectedAviso.categoria === 'Portaria' ? '🚪'
                : selectedAviso.categoria === 'Manutenção' ? '🔧' : '📋'}
            </Text>
            <View style={[s.catChip, { backgroundColor: accentL, alignSelf: 'center' }]}>
              <Text style={[s.catChipText, { color: accent }]}>{selectedAviso.categoria}</Text>
            </View>
            <Text style={[s.modalTitle, { color: Colors.ink }]}>{selectedAviso.titulo}</Text>
            <Text style={s.modalBody}>{selectedAviso.mensagem}</Text>
            <Text style={s.crudDate}>{selectedAviso.data}</Text>
            <TouchableOpacity
              style={[s.modalBtn, { backgroundColor: accent }]}
              onPress={() => setSelectedAviso(null)}
            >
              <Text style={s.modalBtnText}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}

      {/* ── Modal Reservar Espaço (morador) ── */}
      {reservaModal && (
        <Pressable style={s.modalOverlay} onPress={() => setReservaModal(false)}>
          <Pressable style={s.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={s.modalIcon}></Text>
            <Text style={[s.modalTitle, { color: Colors.ink }]}>Reservar Espaço</Text>
            <Text style={[s.modalBody, { marginBottom: 4 }]}>Escolha o espaço e a data. A reserva é para o dia todo.</Text>

            <Text style={s.reservaLabel}>ESPAÇO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {LOCAIS.map(loc => (
                <TouchableOpacity
                  key={loc}
                  onPress={() => setNovaReservaModal(p => ({ ...p, local: loc }))}
                  style={[s.catChip, novaReservaModal.local === loc && { backgroundColor: Colors.teal }]}
                >
                  <Text style={[s.catChipText, novaReservaModal.local === loc && { color: Colors.white }]}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <CalendarioSimples
              mes={novaReservaModal.mes}
              diaSelecionado={novaReservaModal.dia}
              onSelectDia={dia => setNovaReservaModal(p => ({ ...p, dia }))}
              onChangeMes={mes => setNovaReservaModal(p => ({ ...p, mes, dia: '' }))}
              accent={Colors.teal}
            />

            <TouchableOpacity
              style={[s.modalBtn, { backgroundColor: novaReservaModal.dia ? Colors.teal : Colors.muted }]}
              onPress={salvarReservaModal}
              disabled={!novaReservaModal.dia}
            >
              <Text style={s.modalBtnText}>Confirmar Reserva</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.modalBtn, { backgroundColor: Colors.sand, marginTop: 4 }]} onPress={() => setReservaModal(false)}>
              <Text style={[s.modalBtnText, { color: Colors.muted }]}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}

      {/* ── Modal Acesso Negado ── */}
      {blockedModal && (
        <Pressable style={s.modalOverlay} onPress={() => setBlockedModal(false)}>
          <Pressable style={s.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={s.modalIcon}>🔒</Text>
            <Text style={s.modalTitle}>Acesso Negado</Text>
            <Text style={s.modalBody}>
              Você não tem permissão para visualizar este conteúdo.{'\n\n'}
              Apenas usuários <Text style={s.modalEm}>Comércio</Text> ou <Text style={s.modalEm}>Admin</Text> podem acessar esta área.
            </Text>
            <TouchableOpacity style={[s.modalBtn, { backgroundColor: Colors.red }]} onPress={() => setBlockedModal(false)}>
              <Text style={s.modalBtnText}>Entendi</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

// ─── Componentes auxiliares ──────────────────────────────────────────────────
function NavItem({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[s.navItem, (active || hovered) && s.navItemActive]}
    >
      <Text style={s.navItemText}>{label}</Text>
    </Pressable>
  );
}

function DataRow({ icon, value }: { icon: string; value: string }) {
  return (
    <View style={s.dataRow}>
      <Text style={s.dataIcon}>{icon}</Text>
      <Text style={s.dataValue}>{value}</Text>
    </View>
  );
}

const ANO_ATUAL = new Date().getFullYear();
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function CalendarioSimples({ mes, diaSelecionado, onSelectDia, onChangeMes, accent }: {
  mes: string; diaSelecionado: string;
  onSelectDia: (d: string) => void;
  onChangeMes: (m: string) => void;
  accent: string;
}) {
  const hoje = new Date();
  const mesIdx = MESES.indexOf(mes);
  const totalDias = new Date(ANO_ATUAL, mesIdx + 1, 0).getDate();
  const primeiroDia = new Date(ANO_ATUAL, mesIdx, 1).getDay();
  const cells: (number | null)[] = [...Array(primeiroDia).fill(null), ...Array.from({ length: totalDias }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const mesAtualIdx = hoje.getMonth();
  const isPrevDisabled = mesIdx === mesAtualIdx;
  const isPasado = (dia: number) => mesIdx < mesAtualIdx || (mesIdx === mesAtualIdx && dia < hoje.getDate());

  const prevMes = () => { if (!isPrevDisabled) onChangeMes(MESES[(mesIdx + 11) % 12]); };
  const nextMes = () => onChangeMes(MESES[(mesIdx + 1) % 12]);

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={cal.header}>
        <TouchableOpacity onPress={prevMes} style={cal.navBtn} disabled={isPrevDisabled}><Text style={[cal.navTxt, isPrevDisabled && { opacity: 0.2 }]}>‹</Text></TouchableOpacity>
        <Text style={cal.mesAno}>{mes} {ANO_ATUAL}</Text>
        <TouchableOpacity onPress={nextMes} style={cal.navBtn}><Text style={cal.navTxt}>›</Text></TouchableOpacity>
      </View>
      <View style={cal.grid}>
        {DIAS_SEMANA.map((d, i) => (
          <View key={i} style={cal.cell}><Text style={cal.weekDay}>{d}</Text></View>
        ))}
        {cells.map((dia, i) => {
          const selected = dia !== null && diaSelecionado === String(dia);
          const passado = dia !== null && isPasado(dia);
          return (
            <TouchableOpacity
              key={i}
              disabled={dia === null || passado}
              onPress={() => dia && !passado && onSelectDia(String(dia))}
              style={[cal.cell, selected && { backgroundColor: accent, borderRadius: 999 }]}
            >
              <Text style={[cal.dayTxt, passado && { color: Colors.border }, selected && { color: Colors.white, fontWeight: '700' }]}>
                {dia ?? ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const cal = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  navBtn: { padding: 8 },
  navTxt: { fontSize: 20, color: Colors.ink, fontWeight: '600' },
  mesAno: { fontSize: 15, fontWeight: '700', color: Colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%` as any, alignItems: 'center', paddingVertical: 6 },
  weekDay: { fontSize: 11, fontWeight: '700', color: Colors.muted },
  dayTxt: { fontSize: 13, color: Colors.ink },
});

// ─── Estilos ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: Colors.cream },
  sidebar: { width: 210, paddingTop: 40, paddingHorizontal: 16, paddingBottom: 24 },
  sidebarLogo: { fontSize: 28, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  sidebarLogoEm: { fontStyle: 'italic' },
  sidebarName: { color: Colors.white, fontWeight: '600', marginTop: 16, fontSize: 14 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
  roleBadge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  roleBadgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  navItems: { marginTop: 32, gap: 4 },
  navItem: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  navItemActive: { backgroundColor: Colors.white + '22' },
  navItemText: { color: Colors.white, fontSize: 14, fontWeight: '500' },
  signOutBtn: { marginTop: 'auto' as any, paddingVertical: 10 },
  signOutText: { color: Colors.white, opacity: 0.7, fontSize: 13 },
  main: { flex: 1 },
  content: { padding: 32, paddingBottom: 64 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: Colors.ink },
  pageSubtitle: { fontSize: 13, color: Colors.muted, marginBottom: 24, marginTop: 4 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: Colors.muted, letterSpacing: 1, marginBottom: 10 },
  card: { backgroundColor: Colors.white, borderRadius: 12, padding: 20, marginBottom: 16, borderLeftWidth: 4 },
  cardTitle: { fontSize: 11, fontWeight: '700', color: Colors.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
  dataRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  dataIcon: { fontSize: 16, width: 24 },
  dataValue: { fontSize: 14, color: Colors.ink, fontWeight: '500' },
  avisoBlocoCard: {
    backgroundColor: Colors.white, borderRadius: 12, padding: 16, marginBottom: 12,
    borderLeftWidth: 4, gap: 10,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  avisoBlocoHover: { backgroundColor: Colors.creamD },
  avisoBlocoTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avisoBlocoIcon: { fontSize: 28, marginTop: 2 },
  avisoBlocoTitulo: { fontSize: 15, fontWeight: '700', color: Colors.ink, marginBottom: 4 },
  avisoBlocoMsg: { fontSize: 13, color: Colors.muted, lineHeight: 18 },
  avisoBlocoFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  noticeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8,
    padding: 8, borderRadius: 8,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  noticeRowHover: { backgroundColor: Colors.cream },
  noticeDot: { fontSize: 10 },
  noticeTitle: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  noticeMsg: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  noticeChevron: { fontSize: 20, fontWeight: '300' },
  emptyText: { fontSize: 13, color: Colors.muted, fontStyle: 'italic' },
  permRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  permPath: { fontSize: 13, color: Colors.ink, flex: 1 },
  permBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  permBadgeText: { fontSize: 12, fontWeight: '600' },
  blockedRow: { flexDirection: 'row', gap: 16 },
  blockedPanel: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 12, padding: 24,
    alignItems: 'center', gap: 8, borderWidth: 2, borderColor: 'transparent',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  blockedPanelHover: { borderColor: Colors.red, backgroundColor: Colors.redL, transform: [{ scale: 1.02 }] },
  blockedIcon: { fontSize: 28 },
  blockedTitle: { fontSize: 14, fontWeight: '700', color: Colors.red },
  blockedSub: { fontSize: 12, color: Colors.muted },
  blockedHint: { fontSize: 11, color: Colors.muted, opacity: 0.4, marginTop: 4 },
  // CRUD
  input: {
    backgroundColor: Colors.cream, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: Colors.ink, marginBottom: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  rowInputs: { flexDirection: 'row' },
  catChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginRight: 8, marginBottom: 4,
    backgroundColor: Colors.sand,
  },
  catChipText: { fontSize: 12, fontWeight: '600', color: Colors.muted },
  btnSave: { borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  btnSaveText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  btnCancel: { borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 4, marginLeft: 8, backgroundColor: Colors.sand },
  btnCancelText: { color: Colors.muted, fontWeight: '600', fontSize: 14 },
  crudRow: { flexDirection: 'row', marginTop: 12, gap: 8 },
  crudHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  crudTitle: { fontSize: 15, fontWeight: '700', color: Colors.ink },
  crudMsg: { fontSize: 13, color: Colors.muted, marginTop: 4 },
  crudDate: { fontSize: 11, color: Colors.muted },
  btnEdit: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: Colors.cream },
  btnEditText: { fontWeight: '600', fontSize: 13 },
  btnDelete: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: Colors.redL },
  btnDeleteText: { color: Colors.red, fontWeight: '600', fontSize: 13 },
  // Modal
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 24, zIndex: 999 },
  modalBox: { backgroundColor: Colors.white, borderRadius: 16, padding: 28, width: '100%', maxWidth: 440, gap: 10 },
  modalIcon: { fontSize: 36, textAlign: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  modalBody: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 22 },
  modalEm: { fontWeight: '700', color: Colors.ink },
  modalBtn: { marginTop: 8, paddingVertical: 12, alignItems: 'center', borderRadius: 999 },
  modalBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  reservaLabel: { fontSize: 11, fontWeight: '700', color: Colors.muted, letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' as const },
  avisosListItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  // Mobile
  mobileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 48 },
  mobileHeaderLogo: { fontSize: 22, fontWeight: '800', color: Colors.white },
  mobileSignOut: { color: Colors.white, opacity: 0.8, fontSize: 14 },
  mobileTabs: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  mobileTab: { paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center' },
  mobileTabText: { fontSize: 14, fontWeight: '600', color: Colors.muted },
});
