# Migração MongoDB → SQL Server

Este projeto agora suporta **MongoDB e SQL Server simultaneamente**. Você pode usar ambos os bancos de dados em paralelo para testar e migrar gradualmente.

## 🚀 Como Começar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (use `.env.example` como referência):

```env
# MongoDB (existente)
DATABASECONECT=mongodb://localhost:27017/lates-project

# JWT
JWT_SECRET=your-secret-key-here

# SQL Server (novo)
DB_TYPE=mssql
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourStrong@Passw0rd
DB_DATABASE=lates_project
DB_SYNCHRONIZE=true
DB_LOGGING=true
```

### 3. Setup Automatizado SQL Server

**Forma mais simples (recomendada):**
```bash
npm run setup:sql
# ou
./setup-sql.sh
```

Este script faz tudo automaticamente:
- Para containers antigos
- Sobe o SQL Server via Docker
- Aguarda estar pronto
- Cria o banco `lates_project`

**Ou manualmente:**
```bash
# Subir SQL Server
docker compose up -d

# Aguardar 30-40 segundos

# Criar banco
docker exec lates-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong@Passw0rd' -C \
  -Q "CREATE DATABASE lates_project"
```

### 4. Iniciar a Aplicação

```bash
npm run start:dev
```

O TypeORM criará automaticamente as tabelas no SQL Server (se `DB_SYNCHRONIZE=true`).

## 📋 Estrutura de Endpoints

Todos os módulos agora possuem **dois conjuntos de endpoints**:

### MongoDB (Endpoints Originais)
- `POST /curriculum` - Criar/atualizar curriculum
- `GET /curriculum` - Listar curriculums
- `PUT /curriculum` - Atualizar curriculum

### SQL Server (Endpoints Novos - sufixo `/sql`)
- `POST /curriculum/sql` - Criar/atualizar curriculum
- `GET /curriculum/sql` - Listar curriculums
- `PUT /curriculum/sql` - Atualizar curriculum

## 🗂️ Módulos Migrados

### 1. **Curriculum**
| Ação | MongoDB | SQL Server |
|------|---------|------------|
| Criar/Atualizar | `POST /curriculum` | `POST /curriculum/sql` |
| Listar | `GET /curriculum` | `GET /curriculum/sql` |
| Atualizar Metadados | `PUT /curriculum` | `PUT /curriculum/sql` |

### 2. **Tags**
| Ação | MongoDB | SQL Server |
|------|---------|------------|
| Criar | `POST /tags` | `POST /tags/sql` |
| Listar | `GET /tags` | `GET /tags/sql` |
| Atualizar | `PUT /tags` | `PUT /tags/sql` |
| Deletar | `DELETE /tags/:id` | `DELETE /tags/sql/:id` |

### 3. **Login/Usuários**
| Ação | MongoDB | SQL Server |
|------|---------|------------|
| Registrar | `POST /logon` | `POST /logon/sql` |
| Login | `POST /login` | `POST /login/sql` |
| Listar Usuários | `GET /users` | `GET /users/sql` |
| Atualizar Usuário | `PUT /users` | `PUT /users/sql` |
| Deletar Usuário | `DELETE /users/:userId` | `DELETE /users/sql/:userId` |

### 4. **Quallis**
| Ação | MongoDB | SQL Server |
|------|---------|------------|
| Buscar Estrato | `GET /quallis/:issn/:title` | `GET /quallis/sql/:issn/:title` |

## 🗄️ Modelo de Dados SQL Server

### Tabelas Criadas

#### `curriculums`
```sql
- id (uuid, PK)
- lattesId (varchar 255, unique)
- active (bit)
- serviceYears (varchar 255, nullable)
- curriculum (varchar MAX) -- Campo JSON grande
- updatedDate (varchar 255)
- createdAt (datetime)
- updatedAt (datetime)
```

#### `tags`
```sql
- id (uuid, PK)
- tagName (varchar 255)
- createdAt (datetime)
- updatedAt (datetime)
```

#### `curriculum_tags` (Tabela de Junção)
```sql
- curriculum_id (uuid, FK → curriculums.id)
- tag_id (uuid, FK → tags.id)
```

#### `users`
```sql
- id (uuid, PK)
- name (varchar 255)
- email (varchar 255, unique)
- password (varchar 255) -- hash bcrypt
- role (varchar 50)
- createdAt (datetime)
- updatedAt (datetime)
```

#### `quallis`
```sql
- id (uuid, PK)
- issn (varchar 255, indexed)
- title (varchar 500, indexed)
- stratum (varchar 100)
- createdAt (datetime)
- updatedAt (datetime)
```

## 🔄 Estratégia de Migração

### Fase 1: Testes Paralelos (ATUAL)
- ✅ Frontend pode chamar endpoints MongoDB (originais)
- ✅ Frontend pode chamar endpoints SQL Server (novos com `/sql`)
- ✅ Ambos os bancos funcionam independentemente
- ⚠️ Dados **não** são sincronizados automaticamente

### Fase 2: Migração de Dados (Manual)
1. Exportar dados do MongoDB
2. Transformar para formato SQL
3. Importar no SQL Server
4. Validar integridade

### Fase 3: Transição do Frontend
1. Atualizar chamadas do frontend para usar endpoints `/sql`
2. Testar em ambiente de homologação
3. Deploy gradual em produção

### Fase 4: Descomissionar MongoDB
1. Remover endpoints MongoDB
2. Remover Mongoose do projeto
3. Simplificar código

## ⚙️ Diferenças de Implementação

### IDs
- **MongoDB**: `_id` (ObjectId)
- **SQL Server**: `id` (UUID/GUID)

### Relacionamentos
- **MongoDB**: Array de ObjectIds + `.populate()`
- **SQL Server**: Tabela de junção + `relations: ['tags']`

### Campo `curriculum`
- Ambos armazenam como **string** (JSON serializado)
- SQL Server usa `VARCHAR(MAX)` (até 2GB)

### Timestamps
- **MongoDB**: Plugin `timestamps: true`
- **SQL Server**: Decorators `@CreateDateColumn` e `@UpdateDateColumn`

## 🐛 Troubleshooting

### SQL Server não conecta
```bash
# Verificar se o container está rodando
docker ps

# Ver logs do SQL Server
docker logs lates-sqlserver

# Testar conexão
docker exec -it lates-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong@Passw0rd' -C -Q "SELECT @@VERSION"

# Criar banco manualmente se necessário
docker exec -it lates-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong@Passw0rd' -C \
  -Q "CREATE DATABASE lates_project"
```

### Container iniciou mas aplicação não conecta
O SQL Server demora ~30 segundos para ficar pronto. Aguarde o healthcheck:
```bash
docker ps  # Deve mostrar "(healthy)" no status
```

Se o erro for "Login failed" ou "database does not exist":
1. Pare o container: `docker-compose down`
2. Remova volumes antigos: `docker volume rm lates-project-back_sqlserver_data`
3. Suba novamente: `docker-compose up -d`
4. Aguarde 30-40 segundos
5. Inicie a aplicação: `npm run start:dev`

### Tabelas não foram criadas
- Verifique se `DB_SYNCHRONIZE=true` no `.env`
- Reinicie a aplicação para forçar sincronização
- Em produção, use migrations: `npm run migration:generate` e `npm run migration:run`

### Erros de autenticação no SQL Server
- O SQL Server no Docker requer senha forte (maiúsculas, minúsculas, números e símbolos)
- Padrão: `YourStrong@Passw0rd`

## 📦 Scripts NPM Adicionados

```json
"typeorm": "typeorm-ts-node-commonjs",
"migration:generate": "npm run typeorm -- migration:generate -d ormconfig.ts",
"migration:run": "npm run typeorm -- migration:run -d ormconfig.ts",
"migration:revert": "npm run typeorm -- migration:revert -d ormconfig.ts"
```

## 🔐 Segurança

⚠️ **IMPORTANTE**: Em produção:
1. Altere `DB_SYNCHRONIZE=false`
2. Use migrations para mudanças no schema
3. Configure senhas fortes
4. Use SSL/TLS para conexões (`encrypt: true`)
5. Não exponha credenciais no código

## 📚 Documentação Técnica

- **TypeORM**: https://typeorm.io/
- **NestJS TypeORM**: https://docs.nestjs.com/techniques/database
- **SQL Server no Docker**: https://hub.docker.com/_/microsoft-mssql-server

---

**Autor**: Sistema de Migração MongoDB → SQL Server  
**Data**: 2026-02-15  
**Versão**: 1.0.0
