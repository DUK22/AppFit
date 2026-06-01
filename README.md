# 🏋️ Treino

> Acompanhe seu treino de musculação direto do navegador — no PC ou no celular, **100% offline** e sem instalar nada.

![HTML5](https://img.shields.io/badge/HTML5-vanilla-E34F26?logo=html5&logoColor=white)
![Offline](https://img.shields.io/badge/Offline-100%25-27d07a)
![PWA](https://img.shields.io/badge/PWA-instal%C3%A1vel-ff4d2e)
![Dependências](https://img.shields.io/badge/depend%C3%AAncias-0-444)
![Arquivo único](https://img.shields.io/badge/arquivo-%C3%BAnico-ff8a3d)

App de treino em **um único arquivo HTML**. Abre com dois cliques no computador, ou pode ser adicionado à tela inicial do celular como um aplicativo. Todos os dados ficam salvos no próprio dispositivo — sem servidor, sem cadastro e sem rastreamento.

A divisão de treino segue o modelo **ABCDE + Full Body**, com alternância automática das semanas C1/C2 e D1/D2.

---

## ✨ Funcionalidades

**Treino do dia**
- Divisão semanal A, B, C, D, E + recuperação ativa e descanso.
- Alternância automática de ciclo: quarta e sexta trocam entre **C1/C2** e **D1/D2** a cada semana (com botão para inverter manualmente).
- Marcação de exercícios concluídos e barra de progresso do dia.

**Registro de cargas**
- Anotação de **carga × repetições por série**, com o valor da última sessão como sugestão.
- Estimativa de **1RM** (fórmula de Epley) a cada registro.
- Destaque automático de **recordes pessoais (PRs)**.

**Banco de exercícios e substituição**
- Banco embutido com ~90 exercícios organizados por grupo muscular.
- **Trocar** qualquer exercício por outro do mesmo grupo (ou de todos os grupos), com busca.
- **Editar** nome, grupo, séries e repetições — e restaurar o original quando quiser.

**Vídeos de execução**
- Botão de execução em cada exercício que abre uma busca no YouTube pela técnica correta — sempre atualizada, sem links quebrados.

**Progresso**
- Gráfico de evolução por exercício.
- Lista de recordes, sequência de treinos (streak) e totais (treinos, exercícios e séries).
- Gráfico de adesão das últimas 8 semanas.

**Peso corporal**
- Registro de peso com gráfico de evolução e variação total.

**Ferramentas**
- Calculadora de **1RM** (com tabela de percentuais).
- Calculadora de **anilhas** por lado, configurável conforme as anilhas disponíveis.

**Cronômetro de descanso**
- Inicia automaticamente ao marcar um exercício (configurável), com som e vibração ao terminar.

**Sincronização**
- Exportação e importação dos dados em JSON para sincronizar entre PC e celular.

---

## 🚀 Como usar

**No computador**

1. Baixe o arquivo `Treino.html`.
2. Dê dois cliques para abrir no navegador. Pronto.

**No celular**

1. Abra o `Treino.html` no navegador.
2. No menu do navegador, toque em **"Adicionar à tela de início"**.
3. Ele passa a abrir como um app, em tela cheia e offline.

> 💡 Dica: hospedando o arquivo no **GitHub Pages**, fica fácil abrir no celular e instalar a partir de um link.

---

## 🔄 Sincronizar entre dispositivos

Os dados ficam salvos localmente em cada aparelho. Para usar o mesmo histórico no PC e no celular:

1. Em **⚙️ Ajustes → Exportar**, salve o arquivo de backup `.json`.
2. No outro dispositivo, use **⚙️ Ajustes → Importar** e selecione esse arquivo.

---

## 🛠️ Tecnologia

- HTML, CSS e JavaScript puros (vanilla), em **um único arquivo**.
- Sem frameworks, sem bibliotecas externas e sem build.
- Gráficos desenhados em `<canvas>` nativo.
- Persistência via `localStorage`.
- Funciona totalmente offline.

---

## 🔒 Privacidade

Nenhum dado sai do seu dispositivo. Não há contas, servidores, analytics ou rastreamento — todo o histórico fica apenas no navegador onde você usa o app.

---

## 📁 Estrutura

```
.
└── Treino.html   # o app inteiro (interface + lógica + dados)
```

---

## 📋 Estrutura do treino

Divisão **ABCDE + Full Body**, inspirada na proposta de treino de Laércio Refundini:

| Dia | Treino |
|-----|--------|
| Segunda | A |
| Terça | B |
| Quarta | C1 / C2 (alterna por semana) |
| Quinta | Recuperação ativa |
| Sexta | D1 / D2 (alterna por semana) |
| Sábado | E |
| Domingo | Descanso |

---

## 📄 Licença

Livre para uso pessoal. Sugestão: [MIT](https://choosealicense.com/licenses/mit/).
