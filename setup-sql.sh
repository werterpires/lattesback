#!/bin/bash

echo "🔧 Configurando SQL Server para o projeto..."

# Verificar se o Docker está rodando
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

# Parar containers antigos
echo "📦 Parando containers existentes..."
docker compose down

# Subir SQL Server
echo "🚀 Iniciando SQL Server..."
docker compose up -d

# Aguardar SQL Server estar pronto
echo "⏳ Aguardando SQL Server inicializar (30 segundos)..."
sleep 30

# Verificar se está rodando
if ! docker ps | grep -q lates-sqlserver; then
    echo "❌ SQL Server não conseguiu iniciar. Verifique os logs:"
    echo "   docker logs lates-sqlserver"
    exit 1
fi

# Verificar se está healthy
echo "🔍 Verificando saúde do container..."
for i in {1..10}; do
    if docker inspect lates-sqlserver | grep -q '"Status": "healthy"'; then
        echo "✅ SQL Server está saudável!"
        break
    fi
    echo "   Tentativa $i/10..."
    sleep 3
done

# Criar banco de dados
echo "🗄️  Criando banco de dados 'lates_project'..."
docker exec lates-sqlserver /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P 'YourStrong@Passw0rd' -C \
    -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'lates_project') CREATE DATABASE lates_project" \
    2>/dev/null

# Verificar se foi criado
if docker exec lates-sqlserver /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P 'YourStrong@Passw0rd' -C \
    -Q "SELECT name FROM sys.databases WHERE name = 'lates_project'" 2>/dev/null | grep -q "lates_project"; then
    echo "✅ Banco de dados 'lates_project' criado com sucesso!"
else
    echo "❌ Erro ao criar banco de dados"
    exit 1
fi

echo ""
echo "🎉 Setup completo! Agora você pode:"
echo "   1. npm install"
echo "   2. cp .env.example .env  (se ainda não fez)"
echo "   3. npm run start:dev"
echo ""
