import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

// ═══════════════════════════════════════════════════════════════════════════
// PALETA DE CORES
// ═══════════════════════════════════════════════════════════════════════════
const C = {
  cream:    "#F5F0E8",
  creamD:   "#EDE5D8",
  sand:     "#E4D9C8",
  sandD:    "#D5C8B4",
  teal:     "#2A9D8F",
  tealD:    "#1d7a6e",
  tealL:    "#E4F4F2",
  blue:     "#2C6E8A",
  blueL:    "#E3EEF4",
  ink:      "#1A1714",
  brown:    "#7A5C45",
  muted:    "#8C7B6B",
  border:   "#DDD0BF",
  white:    "#FDFAF6",
  green:    "#16A34A",
  greenL:   "#DCFCE7",
  red:      "#D62839",
  redL:     "#FEE2E2",
  amber:    "#F59E0B",
  amberL:   "#FEF3C7",
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function Landing() {
  const router = useRouter();
  const [activeReq, setActiveReq] = useState<string | null>(null);


const sketches: Record<string, any> = {
  login: require('../assets/prototypes/login.png'),
  cadastro: require('../assets/prototypes/cadastro.png'),
  morador: require('../assets/prototypes/dashboard-morador.png'),
  comerciante: require('../assets/prototypes/dashboard-comerciante.png'),
};

  const scrollToSection = (reqId: string) => {
    setActiveReq(reqId);
  };

  return (
    <View style={s.root}>
      {/* ══════════════════════════════════════════════════════════════
          NAV
      ══════════════════════════════════════════════════════════════ */}
      <View style={s.nav}>
        <Text style={s.navLogo}>
          E<Text style={s.navLogoEm}>a</Text>sy
        </Text>
        <View style={s.navLinks}>
          <TouchableOpacity onPress={() => scrollToSection("req1")}>
            <Text style={s.navLink}>Modelagem</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection("req2")}>
            <Text style={s.navLink}>Security Rules</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection("req3")}>
            <Text style={s.navLink}>Autenticação</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection("decisoes")}>
            <Text style={[s.navLink, { color: C.amber, fontWeight: "700" }]}>
              ⚑ Decisões
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection("req4")}>
            <Text style={s.navLink}>Interface</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection("req5")}>
            <Text style={s.navLink}>Docs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.navLink, { backgroundColor: C.teal, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, marginLeft: 16 }]}
            onPress={() => router.push("/login")}
          >
            <Text style={{ color: C.white, fontWeight: "700", fontSize: 13 }}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* ══════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════ */}
        <View style={s.hero}>
          <View style={s.heroBadge}>
            <View style={s.badgeDot} />
            <Text style={s.badgeText}>
              Plataforma de gestão condominial · Maceió, AL
            </Text>
          </View>

          <Text style={s.heroTitle}>
            Nunca foi tão{"\n"}fácil<Text style={s.heroTitleEm}>se conectar</Text>
            {"\n"}com pessoas
          </Text>

          <Text style={s.heroTag}>
            Easy conecta moradores e comércios do mesmo bairro.
          </Text>

          <View style={s.heroChips}>
            {[
              { label: "Firebase Auth", color: C.teal },
              { label: "Realtime Database", color: C.blue },
              { label: "Security Rules", color: C.teal },
              { label: "Morador · Comércio", color: C.blue },
            ].map((chip, i) => (
              <View key={i} style={s.chip}>
                <View style={[s.chipDot, { backgroundColor: chip.color }]} />
                <Text style={s.chipText}>{chip.label}</Text>
              </View>
            ))}
          </View>

          <View style={s.heroScore}>
            {[
              { pts: "8", lbl: "Modelagem" },
              { pts: "10", lbl: "Security Rules" },
              { pts: "6", lbl: "Autenticação" },
              { pts: "4", lbl: "Interface" },
              { pts: "2", lbl: "Docs" },
            ].map((item, i) => (
              <View
                key={i}
                style={[s.hsItem, i < 4 && { borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.08)" }]}
              >
                <Text style={s.hsPts}>{item.pts}</Text>
                <Text style={s.hsLbl}>{item.lbl}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════════
            REQ 1 — MODELAGEM DO BANCO
        ══════════════════════════════════════════════════════════════ */}
        <View style={s.fullLine} />
        <View style={s.chapter}>
          <View style={s.chPts}>
            <Text style={s.chpN}>8</Text>
            <Text style={s.chpL}>pontos</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.chLbl}>Requisito 01</Text>
            <Text style={s.chTitle}>Modelagem do banco</Text>
            <Text style={s.chSub}>
              Árvore JSON com pelo menos /users e /admin-data
            </Text>
          </View>
        </View>

        <View style={s.section}>
          <View style={s.profAsked}>
            <Text style={s.paLabel}>O professor pediu</Text>
            <Text style={s.paText}>
              Estrutura do banco modelada — árvore JSON com pelo menos os nós
              /users e /admin-data
            </Text>
          </View>

          <View style={s.hwd}>
            <Text style={s.hwdLabel}>No Easy</Text>
            <Text style={s.hwdText}>
              O Easy já separa naturalmente <Text style={s.bold}>Morador</Text> e{" "}
              <Text style={s.bold}>Comércio</Text> como dois perfis de acesso.
              Modelamos o banco com três nós: <Text style={s.code}>/users</Text>{" "}
              para todos os cadastros, <Text style={s.code}>/admin-data</Text>{" "}
              exclusivo para o Comércio, e <Text style={s.code}>/public-data</Text>{" "}
              com os avisos da comunidade — visíveis para todos. O campo{" "}
              <Text style={s.code}>role</Text> dentro de{" "}
              <Text style={s.code}>/users/{"{uid}"}</Text> é o discriminador:{" "}
              <Text style={s.bold}>"user"</Text> para Morador,{" "}
              <Text style={s.bold}>"admin"</Text> para Comércio.
            </Text>
          </View>

          <View style={s.evidence}>
            <View style={s.evHd}>
              <Text style={s.evTitle}>
                database.model.json — árvore completa do Easy
              </Text>
              <View style={[s.evBadge, { backgroundColor: C.greenL }]}>
                <Text style={[s.evBadgeText, { color: C.green }]}>Entregue</Text>
              </View>
            </View>
            <View style={s.evBody}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={s.codeBlock}>
                  <Text style={s.codeText}>
{`{ // Firebase Realtime Database — Easy

  "users": {
    "UID_COMERCIO": {
      "name": "Mercado do Bairro",
      "email": "admin@easy.com",
      "role": "admin",  // Comércio = admin
      "createdAt": 1713139200000
    },
    "UID_MORADOR": {
      "name": "Bruno Morador",
      "email": "user@easy.com",
      "role": "user",  // Morador = user
      "createdAt": 1713139200000
    }
  },

  "admin-data": {  // só o Comércio acessa
    "settings": { "maxUsers": 100, "maintenance": false },
    "logs": { "log_001": { "action": "admin_created", "ts": 1713139200000 } }
  },

  "public-data": {  // todos os autenticados leem
    "announcement": {
      "title": "Bem-vindo ao Easy!",
      "version": "1.0.0"
    }
  }
}`}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════════
            REQ 2 — SECURITY RULES
        ══════════════════════════════════════════════════════════════ */}
        <View style={s.fullLine} />
        <View style={s.chapter}>
          <View style={s.chPts}>
            <Text style={s.chpN}>10</Text>
            <Text style={s.chpL}>pontos</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.chLbl}>Requisito 02 — maior peso</Text>
            <Text style={s.chTitle}>Firebase Security Rules</Text>
            <Text style={s.chSub}>Controle de acesso separado por cargo</Text>
          </View>
        </View>

        <View style={s.section}>
          <View style={s.profAsked}>
            <Text style={s.paLabel}>O professor pediu</Text>
            <Text style={s.paText}>
              Firebase Security Rules configuradas separando o acesso por cargo
            </Text>
          </View>

          <View style={s.hwd}>
            <Text style={s.hwdLabel}>No Easy</Text>
            <Text style={s.hwdText}>
              O coração da segurança do Easy está nas Security Rules. Moradores não
              acessam <Text style={s.code}>/admin-data</Text> (dados do síndico).
              Comerciantes gerenciam apenas <Text style={s.code}>/announcements</Text>{" "}
              próprios. As Rules verificam o campo <Text style={s.code}>role</Text>{" "}
              <Text style={s.bold}>no banco</Text>, não no front-end. Qualquer tentativa
              de acesso sem permissão retorna{" "}
              <Text style={s.code}>PERMISSION_DENIED</Text> no backend.
            </Text>
          </View>

          <Text style={s.sectionLabel}>Matriz de permissões completa</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.permTable}>
              <View style={[s.ptH3, { backgroundColor: C.ink }]}>
                <Text style={[s.ptHText3, { flex: 2 }]}>Nó do banco</Text>
                <Text style={s.ptHText3}>Síndico</Text>
                <Text style={s.ptHText3}>Morador</Text>
                <Text style={s.ptHText3}>Comerciante</Text>
              </View>
              {[
                { node: "/users/{uid} (próprio)", sindico: "R/W", morador: "R/W", comerciante: "R/W" },
                { node: "/users (todos)", sindico: "Read", morador: "negado", comerciante: "negado" },
                { node: "/announcements", sindico: "Read", morador: "Read", comerciante: "R/W próprios" },
                { node: "/bulletin-board", sindico: "R/W", morador: "Read", comerciante: "Read" },
                { node: "/lost-and-found", sindico: "R/W todos", morador: "R/W próprios", comerciante: "negado" },
                { node: "/pet-corner", sindico: "R/W todos", morador: "R/W próprios", comerciante: "negado" },
                { node: "/space-reservations", sindico: "R/W todos", morador: "R/W próprios", comerciante: "negado" },
                { node: "/visitor-permissions", sindico: "R/W todos", morador: "R/W próprios", comerciante: "negado" },
                { node: "/admin-data", sindico: "R/W", morador: "negado", comerciante: "negado" },
              ].map((row, i) => (
                <View key={i} style={s.ptR3}>
                  <Text style={[s.ptNd3, { flex: 2 }]}>{row.node}</Text>
                  {[row.sindico, row.morador, row.comerciante].map((perm, j) => (
                    <View
                      key={j}
                      style={[
                        s.ptv3,
                        {
                          backgroundColor: perm === "negado" ? "transparent" :
                            j === 0 ? C.tealL : j === 1 ? C.blueL : C.amberL,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          s.ptvText3,
                          {
                            color: perm === "negado" ? C.sandD :
                              j === 0 ? C.tealD : j === 1 ? C.blue : C.amber,
                            fontSize: perm.includes("próprios") ? 9 : 10,
                          },
                        ]}
                      >
                        {perm}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>

          <Text style={s.sectionLabel}>database.rules.json</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.codeBlock}>
              <Text style={s.codeText}>
{`// database.rules.json
{ "rules": {

  "users": {
    ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'",
    "$uid": {
      ".read": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
      ".write": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')"
    }
  },

  "admin-data": {
    ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'",
    ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
  },

  "public-data": {
    ".read": "auth != null",
    ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
  }
}}`}
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* ══════════════════════════════════════════════════════════════
            REQ 3 — AUTENTICAÇÃO
        ══════════════════════════════════════════════════════════════ */}
        <View style={s.fullLine} />
        <View style={s.chapter}>
          <View style={s.chPts}>
            <Text style={s.chpN}>6</Text>
            <Text style={s.chpL}>pontos</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.chLbl}>Requisito 03</Text>
            <Text style={s.chTitle}>Autenticação + cargo no banco</Text>
            <Text style={s.chSub}>
              Firebase Auth salvando o role em /users/{"{uid}"} ao criar a conta
            </Text>
          </View>
        </View>

        <View style={s.section}>
          <View style={s.profAsked}>
            <Text style={s.paLabel}>O professor pediu</Text>
            <Text style={s.paText}>
              Autenticação com Firebase Auth, salvando o cargo do usuário no banco
              ao criar a conta
            </Text>
          </View>

          <View style={s.hwd}>
            <Text style={s.hwdLabel}>No Easy</Text>
            <Text style={s.hwdText}>
              Na tela de cadastro do Easy, o usuário escolhe entre{" "}
              <Text style={s.bold}>Morador</Text> e <Text style={s.bold}>Comerciante</Text>.
              Essa escolha não é apenas visual — ela define o{" "}
              <Text style={s.code}>role</Text> que é gravado no banco imediatamente
              após o Firebase Auth criar a conta. O síndico é um morador com role{" "}
              <Text style={s.code}>"admin"</Text>, definido separadamente. A partir daí,
              as Security Rules passam a controlar tudo automaticamente.
            </Text>
          </View>

          <View style={s.steps3}>
            {[
              {
                n: "01",
                emoji: "🎯",
                title: "Toggle na tela de cadastro",
                desc: "O usuário escolhe Morador ou Comerciante. A cor da tela muda. O campo role é definido nesse momento.",
                color: C.tealL,
              },
              {
                n: "02",
                emoji: "🔑",
                title: "Firebase Auth cria a conta",
                desc: "createUserWithEmailAndPassword() retorna o user.uid único gerado pelo Firebase.",
                color: C.blueL,
              },
              {
                n: "03",
                emoji: "💾",
                title: "Role salvo em /users/{uid}",
                desc: "set(ref(db, 'users/'+uid), { role }) — o cargo fica no banco. As Rules passam a controlar o acesso.",
                color: C.sandD,
              },
            ].map((step) => (
              <View key={step.n} style={[s.stepCard, { borderTopColor: step.color }]}>
                <Text style={s.stn}>PASSO {step.n}</Text>
                <Text style={s.sti}>{step.emoji}</Text>
                <Text style={s.stt}>{step.title}</Text>
                <Text style={s.stb}>{step.desc}</Text>
              </View>
            ))}
          </View>

          <Text style={s.sectionLabel}>
            Código — cadastro Easy com salvamento de cargo
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.codeBlock}>
              <Text style={s.codeText}>
{`// Cadastro Easy: Auth + role no banco na mesma operação
const { user } = await createUserWithEmailAndPassword(auth, email, pass);

await set(ref(db, \`users/\${user.uid}\`), {
  name, email,
  role,      // "morador" | "comerciante" | "admin" (síndico)
  createdAt: Date.now()
});

// A partir daqui, as Security Rules controlam o acesso.`}
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* ══════════════════════════════════════════════════════════════
            ⚑ DECISÕES DE DESIGN — OS 4 PONTOS IMPORTANTES
        ══════════════════════════════════════════════════════════════ */}
        <View style={s.fullLine} />
        <View style={s.chapter}>
          <View style={[s.chPts, { backgroundColor: C.amber }]}>
            <Text style={[s.chpN, { color: C.white }]}>⚑</Text>
            <Text style={[s.chpL, { color: "rgba(255,255,255,0.8)" }]}>IMPORTANTE</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.chLbl, { color: C.amber }]}>Decisões de Design</Text>
            <Text style={s.chTitle}>4 Pontos sobre o Login do Easy</Text>
            <Text style={s.chSub}>
              Escolhas de arquitetura que fundamentam o sistema de autenticação
            </Text>
          </View>
        </View>

        <View style={s.section}>
          <View style={[s.callout, { backgroundColor: C.amberL, borderColor: C.amber }]}>
            <Text style={[s.calloutTitle, { color: C.amber }]}>
              ⚠️ Leia antes da apresentação
            </Text>
            <Text style={[s.calloutBody, { color: C.amber }]}>
              Estes pontos fundamentam as decisões de UX e segurança do Easy. Cada um
              tem impacto direto na estrutura do banco e nas Security Rules.
            </Text>
          </View>

          {/* PONTO 1 */}
          <View style={[s.decisaoCard, { borderLeftColor: C.teal }]}>
            <View style={s.decisaoHeader}>
              <View style={[s.decisaoNum, { backgroundColor: C.tealL }]}>
                <Text style={[s.decisaoNumText, { color: C.tealD }]}>01</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.decisaoTitulo}>Tela de login única</Text>
                <Text style={[s.decisaoResumo, { color: C.tealD }]}>
                  Morador e comércio
                </Text>
              </View>
            </View>
            <Text style={s.decisaoCorpo}>
              O sistema possui apenas uma tela de login compartilhada entre os perfis
              Morador e Comércio. Não há rotas de entrada separadas por tipo de
              usuário. A simplicidade reduz confusão e centraliza a autenticação em
              um único ponto.
            </Text>
          </View>

          {/* PONTO 2 */}
          <View style={[s.decisaoCard, { borderLeftColor: C.blue }]}>
            <View style={s.decisaoHeader}>
              <View style={[s.decisaoNum, { backgroundColor: C.blueL }]}>
                <Text style={[s.decisaoNumText, { color: C.blue }]}>02</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.decisaoTitulo}>Síndico loga como morador</Text>
                <Text style={[s.decisaoResumo, { color: C.blue }]}>
                  Identificação via UID único
                </Text>
              </View>
            </View>
            <Text style={s.decisaoCorpo}>
              O administrador (síndico) usa o mesmo fluxo de login que qualquer
              morador. A distinção acontece no backend: ao autenticar, o sistema
              consulta o campo <Text style={s.code}>role</Text> associado ao UID e, se
              for <Text style={s.code}>admin</Text>, a interface administrativa é
              desbloqueada automaticamente. Não há credenciais ou telas separadas.
            </Text>
          </View>

          {/* PONTO 3 */}
          <View style={[s.decisaoCard, { borderLeftColor: C.amber }]}>
            <View style={s.decisaoHeader}>
              <View style={[s.decisaoNum, { backgroundColor: C.amberL }]}>
                <Text style={[s.decisaoNumText, { color: C.amber }]}>03</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.decisaoTitulo}>Diferença por perfil, não por tela</Text>
                <Text style={[s.decisaoResumo, { color: C.amber }]}>
                  Sem painel com cadeado para usuários comuns
                </Text>
              </View>
            </View>
            <Text style={s.decisaoCorpo}>
              A tela administrativa não existe como rota acessível por URL ou
              navegação direta. O que muda é o conjunto de componentes renderizados
              após o login: usuários comuns nunca veem nem recebem no payload os
              elementos do painel de gestão. A interface reflete as permissões reais
              do backend.
            </Text>
          </View>

          {/* PONTO 4 */}
          <View style={[s.decisaoCard, { borderLeftColor: C.red }]}>
            <View style={s.decisaoHeader}>
              <View style={[s.decisaoNum, { backgroundColor: C.redL }]}>
                <Text style={[s.decisaoNumText, { color: C.red }]}>04</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.decisaoTitulo}>Sem rota de login administrativo</Text>
                <Text style={[s.decisaoResumo, { color: C.red }]}>
                  Decisão de segurança por obscuridade complementar
                </Text>
              </View>
            </View>
            <Text style={s.decisaoCorpo}>
              Optamos por não expor uma rota <Text style={s.code}>/admin/login</Text>{" "}
              separada. A validação real é sempre feita no backend (Firebase Security
              Rules + verificação de role), mas a ausência de uma tela administrativa
              visível reduz a superfície de ataques de força bruta e a curiosidade de
              usuários não autorizados que, por conhecimento limitado, procuram
              primeiramente um painel de login dedicado. Sim, a validação é feita no
              backend, mas nem todo mundo entende isso, e eliminar o vetor de ataque
              mais óbvio adiciona uma camada extra de proteção.
            </Text>
          </View>

          <View style={[s.callout, { backgroundColor: C.sand, borderColor: C.border }]}>
            <Text style={[s.calloutTitle, { color: C.brown }]}>🔒 Resumindo</Text>
            <Text style={[s.calloutBody, { color: C.brown }]}>
              Uma tela de login → o backend lê o <Text style={s.code}>role</Text> →
              renderiza a interface correta. O síndico não tem porta separada, e isso
              é intencional. A validação é sempre feita no backend via Security Rules.
            </Text>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════════
            REQ 4 — INTERFACE VISUAL
        ══════════════════════════════════════════════════════════════ */}
        <View style={s.fullLine} />
        <View style={s.chapter}>
          <View style={s.chPts}>
            <Text style={s.chpN}>4</Text>
            <Text style={s.chpL}>pontos</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.chLbl}>Requisito 04</Text>
            <Text style={s.chTitle}>Interface visual</Text>
            <Text style={s.chSub}>
              Mostrando o que cada cargo pode ou não acessar
            </Text>
          </View>
        </View>

        <View style={s.section}>
          <View style={s.profAsked}>
            <Text style={s.paLabel}>O professor pediu</Text>
            <Text style={s.paText}>
              Interface visual mostrando o que cada cargo pode ou não acessar
            </Text>
          </View>

          <View style={s.hwd}>
            <Text style={s.hwdLabel}>No Easy</Text>
            <Text style={s.hwdText}>
              O dashboard do Easy muda completamente dependendo do cargo. O{" "}
              <Text style={s.bold}>Comerciante</Text> vê estatísticas de acesso e
              curtidas dos próprios anúncios, pode criar, editar, pausar e deletar posts.
              O <Text style={s.bold}>Morador</Text> vê o feed de anúncios dos comerciantes,
              eventos e áreas comunitárias do condomínio. O{" "}
              <Text style={s.bold}>Síndico</Text> acessa o painel administrativo que{" "}
              <Text style={s.bold}>nunca aparece</Text> para usuários comuns, a interface
              simplesmente não renderiza componentes sem permissão.
            </Text>
          </View>

          <Text style={s.sectionLabel}>Protótipos de baixa fidelidade</Text>
          <View style={s.protoGrid}>
            {["Login", "Cadastro", "Dashboard Morador", "Dashboard Comércio"].map(
              (label, i) => {
                const imageKey = ['login', 'cadastro', 'morador', 'comerciante'][i];
                return (
                  <View key={i} style={s.protoCard}>
                    <View style={s.pcBar}>
                      <View style={[s.pcd, { backgroundColor: "#ff5f57" }]} />
                      <View style={[s.pcd, { backgroundColor: "#febc2e" }]} />
                      <View style={[s.pcd, { backgroundColor: "#28c840" }]} />
                      <Text style={s.pcLbl}>{label}</Text>
                    </View>
                    <View style={s.pcBody}>
                      <Image 
                        source={sketches[imageKey]} 
                        style={{ width: '100%', height: 150 }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                );
              }
            )}
          </View>

          <View style={s.cargoGrid}>
            {/* MORADOR */}
            <View style={[s.cargoCard, { borderTopColor: C.blue, flex: 1 }]}>
              <View style={s.ccHead}>
                <View style={[s.ccAv, { backgroundColor: C.blueL }]}>
                  <Text style={{ fontSize: 20 }}>🏠</Text>
                </View>
                <View>
                  <Text style={s.ccName}>Morador</Text>
                  <View style={[s.ccRole, { backgroundColor: C.blueL }]}>
                    <Text style={[s.ccRoleText, { color: C.blue }]}>cargo: morador</Text>
                  </View>
                </View>
              </View>
              <View style={s.perms}>
                <View style={[s.pr, { backgroundColor: C.blueL }]}>
                  <Text>✓</Text>
                  <Text style={s.prKey}>/users/{"{uid}"}</Text>
                  <Text style={[s.prVal, { color: C.blue }]}>leitura / escrita</Text>
                </View>
                <View style={[s.pr, { backgroundColor: C.blueL }]}>
                  <Text>✓</Text>
                  <Text style={s.prKey}>/announcements</Text>
                  <Text style={[s.prVal, { color: C.blue }]}>leitura</Text>
                </View>
                <View style={s.locked}>
                  <Text>🔒</Text>
                  <Text style={s.lkey}>/users (lista)</Text>
                  <View style={s.lval}>
                    <Text style={s.lvalText}>NEGADO</Text>
                  </View>
                </View>
                <View style={s.locked}>
                  <Text>🔒</Text>
                  <Text style={s.lkey}>/admin-data</Text>
                  <View style={s.lval}>
                    <Text style={s.lvalText}>NEGADO</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* COMERCIANTE */}
            <View style={[s.cargoCard, { borderTopColor: C.amber, flex: 1 }]}>
              <View style={s.ccHead}>
                <View style={[s.ccAv, { backgroundColor: C.amberL }]}>
                  <Text style={{ fontSize: 20 }}>🏪</Text>
                </View>
                <View>
                  <Text style={s.ccName}>Comerciante</Text>
                  <View style={[s.ccRole, { backgroundColor: C.amberL }]}>
                    <Text style={[s.ccRoleText, { color: C.amber }]}>cargo: comerciante</Text>
                  </View>
                </View>
              </View>
              <View style={s.perms}>
                <View style={[s.pr, { backgroundColor: C.amberL }]}>
                  <Text>✓</Text>
                  <Text style={s.prKey}>/users/{"{uid}"}</Text>
                  <Text style={[s.prVal, { color: C.amber }]}>leitura / escrita</Text>
                </View>
                <View style={[s.pr, { backgroundColor: C.amberL }]}>
                  <Text>✓</Text>
                  <Text style={s.prKey}>/announcements</Text>
                  <Text style={[s.prVal, { color: C.amber }]}>R/W próprios</Text>
                </View>
                <View style={s.locked}>
                  <Text>🔒</Text>
                  <Text style={s.lkey}>/users (lista)</Text>
                  <View style={s.lval}>
                    <Text style={s.lvalText}>NEGADO</Text>
                  </View>
                </View>
                <View style={s.locked}>
                  <Text>🔒</Text>
                  <Text style={s.lkey}>/admin-data</Text>
                  <View style={s.lval}>
                    <Text style={s.lvalText}>NEGADO</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* SÍNDICO */}
            <View style={[s.cargoCard, { borderTopColor: C.teal, flex: 1 }]}>
              <View style={s.ccHead}>
                <View style={[s.ccAv, { backgroundColor: C.tealL }]}>
                  <Text style={{ fontSize: 20 }}>🔑</Text>
                </View>
                <View>
                  <Text style={s.ccName}>Síndico</Text>
                  <View style={[s.ccRole, { backgroundColor: C.tealL }]}>
                    <Text style={[s.ccRoleText, { color: C.tealD }]}>cargo: admin</Text>
                  </View>
                </View>
              </View>
              <View style={s.perms}>
                <View style={[s.pr, { backgroundColor: C.tealL }]}>
                  <Text>✓</Text>
                  <Text style={s.prKey}>/users/{"{uid}"}</Text>
                  <Text style={[s.prVal, { color: C.tealD }]}>leitura / escrita</Text>
                </View>
                <View style={[s.pr, { backgroundColor: C.tealL }]}>
                  <Text>✓</Text>
                  <Text style={s.prKey}>/users (lista de moradores)</Text>
                  <Text style={[s.prVal, { color: C.tealD }]}>leitura</Text>
                </View>
                <View style={[s.pr, { backgroundColor: C.tealL }]}>
                  <Text>✓</Text>
                  <Text style={s.prKey}>/admin-data</Text>
                  <Text style={[s.prVal, { color: C.tealD }]}>leitura / escrita</Text>
                </View>
                <View style={[s.pr, { backgroundColor: C.tealL }]}>
                  <Text>✓</Text>
                  <Text style={s.prKey}>/bulletin-board</Text>
                  <Text style={[s.prVal, { color: C.tealD }]}>leitura / escrita</Text>
                </View>
                <View style={[s.pr, { backgroundColor: C.tealL }]}>
                  <Text>✓</Text>
                  <Text style={s.prKey}>/public-data (avisos)</Text>
                  <Text style={[s.prVal, { color: C.tealD }]}>leitura / escrita</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════════
            REQ 5 — DOCUMENTAÇÃO
        ══════════════════════════════════════════════════════════════ */}
        <View style={s.fullLine} />
        <View style={s.chapter}>
          <View style={s.chPts}>
            <Text style={s.chpN}>2</Text>
            <Text style={s.chpL}>pontos</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.chLbl}>Requisito 05</Text>
            <Text style={s.chTitle}>Documentação mínima</Text>
            <Text style={s.chSub}>
              README com setup, estrutura e contas de demonstração
            </Text>
          </View>
        </View>

        <View style={s.section}>
          <View style={s.profAsked}>
            <Text style={s.paLabel}>O professor pediu</Text>
            <Text style={s.paText}>
              Print ou vídeo curto (máx. 2 min) com os dois cargos logados +
              documentação mínima
            </Text>
          </View>

          <View style={s.hwd}>
            <Text style={s.hwdLabel}>No Easy</Text>
            <Text style={s.hwdText}>
              O README documenta a estrutura do banco, o setup do Firebase e as contas
              de demonstração. Na apresentação, abrimos dois navegadores
              simultaneamente, um logado como <Text style={s.bold}>Comércio</Text> e
              outro como <Text style={s.bold}>Morador</Text>, mostrando ao vivo a
              diferença de acesso.
            </Text>
          </View>

          <Text style={s.sectionLabel}>Contas de demonstração</Text>
          <View style={s.demoAccounts}>
            <View>
              <Text style={s.demoAccLabel}>Síndico (admin)</Text>
              <View style={s.demoAccBox}>
                <Text style={s.demoAccText}>
                  email: <Text style={s.demoAccVal}>admin@easy.com</Text>
                  {"\n"}senha: <Text style={s.demoAccVal}>123456</Text>
                  {"\n"}role: <Text style={s.demoAccVal}>"admin"</Text>
                </Text>
              </View>
            </View>
            <View>
              <Text style={s.demoAccLabel}>Morador (user)</Text>
              <View style={s.demoAccBox}>
                <Text style={s.demoAccText}>
                  email: <Text style={s.demoAccVal}>user@easy.com</Text>
                  {"\n"}senha: <Text style={s.demoAccVal}>123456</Text>
                  {"\n"}role: <Text style={s.demoAccVal}>"user"</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════ */}
        <View style={s.footer}>
          <View style={s.footerDivider} />
          <Text style={s.footerLogo}>
            E<Text style={{ color: C.teal, fontStyle: "italic" }}>a</Text>sy
          </Text>
          <Text style={s.footerAuthors}>Wanessa Costa · Ryan Cassimiro</Text>
          <Text style={s.footerInfo}>
            Modelagem de Dados · Prof. Marcos Vinícius · AFYA UNIMA · 2026
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════════════════
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.cream,
  },

  // ── NAV ────────────────────────────────────────────────────────────
  nav: {
    backgroundColor: "rgba(245,240,232,0.94)",
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    paddingBottom: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  navLogo: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 20,
    fontWeight: "700",
    color: C.ink,
  },
  navLogoEm: {
    fontStyle: "italic",
    color: C.teal,
  },
  navLinks: {
    flexDirection: "row",
    gap: 14,
    flexWrap: "wrap",
  },
  navLink: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "500",
  },

  scroll: {
    flex: 1,
  },

  // ── HERO ───────────────────────────────────────────────────────────
  hero: {
    backgroundColor: C.ink,
    paddingTop: 60,
    paddingBottom: 52,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(42,157,143,0.15)",
    borderWidth: 1,
    borderColor: "rgba(42,157,143,0.3)",
    borderRadius: 99,
    paddingVertical: 5,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.teal,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: C.teal,
  },
  heroTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 46,
    letterSpacing: -1,
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  heroTitleEm: {
    fontStyle: "italic",
    color: C.teal,
  },
  heroTag: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 16,
    fontWeight: "400",
    fontStyle: "italic",
    color: "rgba(255,255,255,0.45)",
    textAlign: "center",
    marginBottom: 32,
  },
  heroChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginBottom: 32,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 99,
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  chipText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  heroScore: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  hsItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  hsPts: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 24,
    fontWeight: "700",
    color: C.teal,
    marginBottom: 3,
  },
  hsLbl: {
    fontSize: 10,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 0.4,
  },

  // ── STRUCTURE ──────────────────────────────────────────────────────
  fullLine: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 24,
  },
  chapter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  chPts: {
    width: 80,
    backgroundColor: C.ink,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  chpN: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 34,
    fontWeight: "700",
    color: C.teal,
  },
  chpL: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.3)",
  },
  chLbl: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 11,
    color: C.teal,
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  chTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 24,
    fontWeight: "700",
    color: C.ink,
    letterSpacing: -0.5,
  },
  chSub: {
    fontSize: 13,
    color: C.muted,
    marginTop: 5,
  },

  section: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },

  // ── CALLOUTS ───────────────────────────────────────────────────────
  profAsked: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: C.creamD,
    borderLeftWidth: 3,
    borderLeftColor: C.sandD,
    marginBottom: 16,
  },
  paLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: C.muted,
    flexShrink: 0,
    paddingTop: 1,
  },
  paText: {
    flex: 1,
    fontSize: 13,
    color: C.muted,
    lineHeight: 20,
    fontStyle: "italic",
  },

  hwd: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: C.tealL,
    borderLeftWidth: 3,
    borderLeftColor: C.teal,
    marginBottom: 24,
  },
  hwdLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: C.teal,
    flexShrink: 0,
    paddingTop: 1,
  },
  hwdText: {
    flex: 1,
    fontSize: 13,
    color: C.ink,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "600",
  },
  code: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    backgroundColor: "rgba(42,157,143,0.12)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    fontSize: 12,
    color: C.tealD,
  },

  callout: {
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  calloutTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  calloutBody: {
    fontSize: 13,
    lineHeight: 20,
  },

  // ── EVIDENCE ───────────────────────────────────────────────────────
  evidence: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    backgroundColor: C.white,
    overflow: "hidden",
    marginBottom: 24,
  },
  evHd: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: C.creamD,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  evTitle: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: C.muted,
  },
  evBadge: {
    paddingVertical: 2,
    paddingHorizontal: 9,
    borderRadius: 99,
  },
  evBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  evBody: {
    padding: 20,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 12,
    marginTop: 8,
  },

  // ── CODE ───────────────────────────────────────────────────────────
  codeBlock: {
    backgroundColor: C.ink,
    borderRadius: 10,
    padding: 18,
  },
  codeText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 11,
    lineHeight: 18,
    color: "rgba(255,255,255,0.55)",
  },

  // ── PERM TABLE ─────────────────────────────────────────────────────
  permTable: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  ptH: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: C.ink,
  },
  ptHText: {
    flex: 1,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
  },
  ptR: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: C.border,
    alignItems: "center",
  },
  ptNd: {
    flex: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    color: C.ink,
  },
  ptv: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 5,
  },
  ptvText: {
    fontSize: 10,
    fontWeight: "700",
  },

  // Estilos para tabela de 3 colunas
  ptH3: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  ptHText3: {
    flex: 1,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
  },
  ptR3: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
    alignItems: "center",
  },
  ptNd3: {
    flex: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 10,
    color: C.ink,
  },
  ptv3: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    minHeight: 24,
    justifyContent: "center",
  },
  ptvText3: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },

  // ── STEPS ──────────────────────────────────────────────────────────
  steps3: {
    gap: 14,
    marginBottom: 24,
  },
  stepCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 22,
    borderTopWidth: 2,
  },
  stn: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 10,
    color: C.teal,
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  sti: {
    fontSize: 26,
    marginBottom: 10,
  },
  stt: {
    fontSize: 13,
    fontWeight: "600",
    color: C.ink,
    marginBottom: 6,
  },
  stb: {
    fontSize: 12,
    color: C.muted,
    lineHeight: 18,
  },

  // ── DECISÕES ───────────────────────────────────────────────────────
  decisaoCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
    borderLeftWidth: 4,
  },
  decisaoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  decisaoNum: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  decisaoNumText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  decisaoTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 2,
  },
  decisaoResumo: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  decisaoCorpo: {
    fontSize: 13,
    color: C.brown,
    lineHeight: 20,
  },

  // ── PROTO ──────────────────────────────────────────────────────────
  protoGrid: {
    gap: 12,
    marginBottom: 24,
  },
  protoCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  pcBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 10,
    backgroundColor: C.creamD,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  pcd: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  pcLbl: {
    flex: 1,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: C.muted,
  },
  pcBody: {
    minHeight: 108,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sph: {
    width: "100%",
    minHeight: 96,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: C.border,
    borderRadius: 6,
    backgroundColor: C.cream,
  },
  sphI: {
    fontSize: 18,
    opacity: 0.3,
  },
  sphL: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: C.border,
  },

  // ── CARGO ──────────────────────────────────────────────────────────
  cargoGrid: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  cargoCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 24,
    borderTopWidth: 2,
  },
  ccHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  ccAv: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ccName: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 18,
    fontWeight: "700",
  },
  ccRole: {
    paddingVertical: 2,
    paddingHorizontal: 9,
    borderRadius: 99,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  ccRoleText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  perms: {
    gap: 7,
  },
  pr: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 7,
  },
  prKey: {
    flex: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 10,
    color: C.ink,
  },
  prVal: {
    fontSize: 10,
    fontWeight: "700",
  },
  locked: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 7,
    backgroundColor: C.redL,
    borderWidth: 1,
    borderColor: "rgba(214,40,57,0.12)",
  },
  lkey: {
    flex: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 10,
    color: C.red,
  },
  lval: {
    backgroundColor: "rgba(214,40,57,0.12)",
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  lvalText: {
    fontSize: 9,
    fontWeight: "700",
    color: C.red,
  },

  // ── DEMO ACCOUNTS ──────────────────────────────────────────────────
  demoAccounts: {
    gap: 16,
    marginBottom: 24,
  },
  demoAccLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: C.tealD,
    marginBottom: 8,
  },
  demoAccBox: {
    backgroundColor: C.ink,
    borderRadius: 8,
    padding: 14,
  },
  demoAccText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    lineHeight: 20,
    color: "#60AEDE",
  },
  demoAccVal: {
    color: "#4ECDC4",
  },

  // ── FOOTER ─────────────────────────────────────────────────────────
  footer: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  footerDivider: {
    width: 40,
    height: 2,
    backgroundColor: C.border,
    marginBottom: 16,
    borderRadius: 1,
  },
  footerLogo: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 18,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 8,
  },
  footerAuthors: {
    fontSize: 13,
    fontWeight: "600",
    color: C.ink,
    marginBottom: 4,
  },
  footerInfo: {
    fontSize: 11,
    color: C.muted,
    letterSpacing: 0.3,
    textAlign: "center",
  },
});
