#!/bin/bash

# Parar containers antigos
echo "Parando containers antigos..."
docker compose down

# Iniciar apenas o Ngrok
echo "Iniciando Ngrok..."
docker compose up -d ngrok

# Aguardar o Ngrok iniciar
echo "Aguardando Ngrok iniciar..."
sleep 5

# Obter a URL pública do túnel 'frontend'
echo "Obtendo URL do Ngrok..."
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | select(.name=="frontend") | .public_url')

if [ -z "$NGROK_URL" ] || [ "$NGROK_URL" == "null" ]; then
  echo "Erro: Não foi possível obter a URL do Ngrok."
  exit 1
fi

echo "URL do Ngrok encontrada: $NGROK_URL"

# Exportar a variável WEBHOOK_URL para o N8N e VITE_N8N_WEBHOOK_URL para o Frontend
export WEBHOOK_URL="$NGROK_URL/webhook"
export VITE_N8N_WEBHOOK_URL="$NGROK_URL/webhook"

# Atualizar o arquivo .env com a nova URL
if grep -q "VITE_N8N_WEBHOOK_URL=" .env; then
  sed -i "s|VITE_N8N_WEBHOOK_URL=.*|VITE_N8N_WEBHOOK_URL=$VITE_N8N_WEBHOOK_URL|g" .env
else
  echo "VITE_N8N_WEBHOOK_URL=$VITE_N8N_WEBHOOK_URL" >> .env
fi

echo "Iniciando os demais serviços com WEBHOOK_URL=$WEBHOOK_URL"

# Iniciar o restante dos serviços
docker compose up -d

echo "Tudo pronto!"
echo "Frontend: $NGROK_URL"
echo "N8N Editor: $NGROK_URL/n8n/"
echo "N8N Webhook: $WEBHOOK_URL"
