# McSmart Locker

McSmart Locker é uma aplicação de simulação de armário inteligente (Smart Locker) integrada com WhatsApp e IA. O projeto demonstra um fluxo completo de pedidos, desde o onboarding até a retirada do produto, utilizando tecnologias modernas e orquestração de microsserviços.

## 🚀 Funcionalidades Principais

### 🔐 Simulação de Locker (Smart Locker)
Uma interface imersiva de quiosque que replica a experiência física de retirada em um armário inteligente.
- **Validação Segura**: O usuário insere o ID do Pedido e um Código de Retirada único (gerado pelo backend).
- **Feedback Visual**: Animação realista das portas do armário se abrindo automaticamente após a validação bem-sucedida via webhook.
- **Integração Real-time**: A interface se comunica diretamente com o workflow n8n para verificar as credenciais instantaneamente.

### ⏱️ Jornada "Just-in-Time" com IA
O sistema elimina filas e garante que o lanche esteja sempre fresco.
- **Sincronização de Preparo**: Utiliza a geolocalização do usuário para calcular o tempo estimado de chegada à loja. O preparo na cozinha só inicia quando o cliente está próximo o suficiente.
- **Tracking Detalhado**: O cliente acompanha cada etapa em tempo real:
  1.  **Pedido Confirmado**: Recebimento do pedido.
  2.  **IA Sincronizando**: Aguardando o momento ideal baseada na distância.
  3.  **Preparando**: O pedido entra em produção na cozinha.
  4.  **Pronto para Retirada**: O cliente recebe o código para abrir o locker.

### 🤖 Integração MéquiZap (Ronald)
Um assistente virtual inteligente ("Ronald") que vive no WhatsApp.
- **Pedidos via Chat**: Os usuários podem interagir com o bot para realizar pedidos de forma conversacional.
- **Notificações Ativas**: O sistema envia automaticamente atualizações de status e o código de retirada para o WhatsApp do cliente via **Evolution API**.
- **IA Conversacional**: Utiliza **Flowise** e **Qdrant** (RAG) para entender contextos e responder dúvidas de forma natural.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** (via Vite)
- **TypeScript**
- **Tailwind CSS** & **shadcn/ui** (Estilização e Componentes)
- **React Router DOM** (Navegação)
- **TanStack Query** (Gerenciamento de Estado Assíncrono)

### Backend & Serviços (Docker)
- **Nginx**: Proxy reverso para expor a aplicação e webhooks.
- **Evolution API**: API para integração com WhatsApp.
- **n8n**: Ferramenta de automação de fluxo de trabalho.
- **Flowise**: Interface drag-and-drop para construir fluxos de LLM (Large Language Models).
- **Qdrant**: Banco de dados vetorial para IA.
- **PostgreSQL**: Banco de dados relacional (usado pelo n8n e Evolution API).
- **MongoDB**: Banco de dados NoSQL (usado pelo n8n).
- **Redis**: Armazenamento em cache e filas.
- **Ngrok**: Tunelamento para expor os serviços locais (webhooks) para a internet.

## 🏁 Como Iniciar

### Pré-requisitos
- **Docker** e **Docker Compose** instalados.
- **Node.js** e **npm** (para desenvolvimento local fora do container, opcional).

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd mcsmart-locker
    ```

2.  **Configure as variáveis de ambiente:**
    - Copie o arquivo `.env.example` para `.env` e preencha as credenciais necessárias (banco de dados, senhas, etc.).
    ```bash
    cp .env.example .env
    ```

3.  **Inicie a aplicação com Ngrok:**
    O projeto inclui um script utilitário `start-with-ngrok.sh` que facilita a inicialização de todos os serviços e a configuração automática da URL pública do Ngrok para os webhooks.

    **Execute o script:**
    ```bash
    chmod +x start-with-ngrok.sh
    ./start-with-ngrok.sh
    ```

    Este script irá:
    - Parar containers antigos.
    - Iniciar o Ngrok.
    - Capturar a URL pública gerada pelo Ngrok.
    - Atualizar o arquivo `.env` com a nova `VITE_N8N_WEBHOOK_URL`.
    - Iniciar todos os outros serviços (Frontend, APIs, Bancos de Dados) via Docker Compose.
    - Exibir as URLs de acesso no final.

4.  **Acesse a aplicação:**
    Após o script finalizar, a aplicação estará acessível através da URL pública do Ngrok fornecida no terminal (ex: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`).

## 📁 Estrutura do Projeto

- **/src**: Código fonte do frontend (React).
  - **/pages**: Telas da aplicação (Onboarding, Menu, LockerSimulation, etc.).
  - **/components**: Componentes reutilizáveis.
  - **/contexts**: Contextos do React (Carrinho, Usuário).
- **docker-compose.yml**: Definição de todos os serviços e redes do Docker.
- **start-with-ngrok.sh**: Script de automação para inicialização com Ngrok.
- **nginx/**: Configurações do proxy reverso.
