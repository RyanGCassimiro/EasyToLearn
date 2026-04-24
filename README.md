# 🔐 Sistema de Login e Cadastro com Firebase

## 📌 Sobre o Projeto

Este projeto consiste em uma aplicação web simples que implementa um sistema de **login e cadastro de usuários**, utilizando autenticação baseada em e-mail e senha. O objetivo é demonstrar, de forma prática, como integrar autenticação, armazenamento de dados e controle de acesso utilizando serviços do Firebase.

---

## 🚀 Tecnologias Utilizadas

* Firebase Authentication (e-mail e senha)
* Firebase Realtime Database
* Firebase Security Rules
* HTML + CSS + TypeScrip

---

## 🎯 Funcionalidades

* Cadastro de usuários
* Login com e-mail e senha
* Logout
* Persistência de sessão
* Armazenamento de dados no banco
* Controle de acesso com regras de segurança

---

## 📂 Estrutura de Pastas

Com base na organização atual do projeto:

```
/projeto
│
├── app
│   ├── _layout.tsx
│   ├── cadastro.tsx
│   ├── dashboard.tsx
│   ├── index.tsx
│   └── landing.tsx
│
├── assets
│   └── prototypes
│
├── components
│
├── constants
│
├── context
│
├── lib
│
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── app.json
├── eslint.config.js
├── package-lock.json
├── package.json
└── tsconfig.json
```

---

## 🧭 Descrição da Estrutura

* **app/**
  Contém as páginas principais da aplicação:

  * `index.tsx`: tela inicial / login
  * `cadastro.tsx`: tela de registro de usuários
  * `dashboard.tsx`: área logada do usuário
  * `landing.tsx`: página pública de apresentação
  * `_layout.tsx`: layout base da aplicação

* **assets/prototypes/**
  Arquivos de prototipação e design (wireframes, layouts, etc.)

* **components/**
  Componentes reutilizáveis da interface

* **constants/**
  Constantes globais da aplicação

* **context/**
  Contextos (ex: autenticação, estado global)

* **lib/**
  Configurações e integrações (ex: Firebase)

---

## ▶️ Como Executar

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
```

2. Acesse a pasta:

```bash
cd nome-do-projeto
```

3. Instale as dependências:

```bash
npm install
```

4. Inicie o projeto:

```bash
npm start
```

---

<img width="1512" height="949" alt="dashboard role user I" src="https://github.com/user-attachments/assets/db037201-d49c-45c0-a303-97a00148bcd5" />
<img width="1472" height="1048" alt="dashboard role user" src="https://github.com/user-attachments/assets/938640aa-761a-4d95-b02f-dea00d28edfb" />
<img width="1512" height="949" alt="Dashboard admin" src="https://github.com/user-attachments/assets/211378cd-ef05-4696-9c1f-ed85704d66c8" />
<img width="1512" height="949" alt="dashboard admin CRUD" src="https://github.com/user-attachments/assets/f0356576-eb6a-4f7b-97bd-af6860b037ec" />

## 🔒 Segurança

* Autenticação via Firebase
* Controle de acesso com regras no Realtime Database
* Restrição de leitura e escrita por usuário autenticado

---

## 📈 Melhorias Futuras

* Recuperação de senha
* Verificação de e-mail
* Responsividade completa
* Melhor tratamento de erros
* Integração com outros provedores de login

---

## 📄 Licença

Este projeto está sob a licença MIT.
