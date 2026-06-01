# Sincronização na nuvem (Firebase) — passo a passo

Para sincronizar automaticamente entre PC e celular, crie um projeto **Firebase** grátis (só uma vez). Leva ~5 minutos.

## 1. Criar o projeto
1. Acesse <https://console.firebase.google.com> e clique em **Adicionar projeto**.
2. Dê um nome (ex.: `meu-treino`), avance e conclua. Pode **desativar o Google Analytics** (não é necessário).

## 2. Ativar o login por e-mail
1. No menu lateral: **Criação → Authentication → Vamos começar**.
2. Aba **Sign-in method** → habilite **E-mail/senha** → Salvar.

## 3. Criar o banco de dados
1. No menu: **Criação → Firestore Database → Criar banco de dados**.
2. Escolha o modo de **produção**, selecione a região (ex.: `southamerica-east1`) e confirme.
3. Abra a aba **Regras (Rules)**, apague o conteúdo, cole o texto abaixo e clique em **Publicar**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /treino/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

> Essas regras garantem que **só você** (logado) acessa os seus dados.

## 4. Copiar a configuração (firebaseConfig)
1. Clique na engrenagem ⚙️ ao lado de "Visão geral do projeto" → **Configurações do projeto**.
2. Role até **Seus apps** e clique no ícone **`</>`** (Web).
3. Dê um apelido (ex.: `treino-web`), **não** marque "Firebase Hosting", e registre.
4. Vai aparecer um bloco assim — **copie o objeto `firebaseConfig` inteiro**:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "meu-treino.firebaseapp.com",
  projectId: "meu-treino",
  storageBucket: "meu-treino.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
```

## 5. Conectar no app
1. No app **Treino**, vá em **⚙️ Ajustes → ☁️ Sincronização entre aparelhos**.
2. Cole a configuração (pode colar o bloco inteiro ou só o `{ ... }`) e toque em **Salvar e conectar**.
3. Toque em **Criar conta**, defina e-mail e senha. Pronto!
4. No outro aparelho, repita os passos 5.1–5.2 e use **Entrar** com a **mesma conta**.

## Observações
- **Configure primeiro no aparelho que já tem seus dados** — eles sobem para a nuvem. Depois entre com a mesma conta no segundo aparelho (que vai baixar os dados).
- Precisa de internet para sincronizar. Offline o app funciona normal e atualiza quando reconectar.
- As **fotos de progresso ficam só no aparelho** (não vão para a nuvem, para não estourar o limite gratuito). Para movê-las, use Exportar/Importar em Ajustes.
- O plano gratuito do Firebase (**Spark**) é mais que suficiente para uso pessoal.

## Arquivos do projeto (para o deploy no Vercel)
O repositório deve conter **apenas**:
```
index.html
manifest.webmanifest
sw.js
icon-192.png
icon-512.png
apple-touch-icon.png
```
(e, se quiser, `README.md` e este `CONFIGURAR-SYNC.md`). Não inclua `package.json`, `node_modules` nem arquivos `_…`.
