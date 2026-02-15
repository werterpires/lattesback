import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './src/app/shared/login/entities/user.entity';
import { TagEntity } from './src/app/tags/entities/tag.entity';
import { CurriculumEntity } from './src/app/curriculum/entities/curriculum.entity';
import { QuallisEntity } from './src/app/quallis/entities/quallis.entity';

config();

async function createAdminUser() {
  console.log('🔧 Conectando ao SQL Server...');
  
  const dataSource = new DataSource({
    type: 'mssql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    username: process.env.DB_USERNAME || 'sa',
    password: process.env.DB_PASSWORD || 'YourStrong@Passw0rd',
    database: process.env.DB_DATABASE || 'lates_project',
    synchronize: true, // Cria as tabelas automaticamente
    logging: false,
    entities: [UserEntity, TagEntity, CurriculumEntity, QuallisEntity],
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conectado ao SQL Server!');
    console.log('📋 Criando tabelas se necessário...');

    const userRepository = dataSource.getRepository(UserEntity);

    // Verificar se já existe
    const existingUser = await userRepository.findOne({
      where: { email: 'admin@lates.com' },
    });

    if (existingUser) {
      console.log('⚠️  Usuário admin já existe!');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Nome: ${existingUser.name}`);
      await dataSource.destroy();
      return;
    }

    // Criar novo usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = userRepository.create({
      name: 'Administrador',
      email: 'admin@lates.com',
      password: hashedPassword,
      role: 'admin',
    });

    await userRepository.save(adminUser);

    console.log('');
    console.log('🎉 Usuário admin criado com sucesso!');
    console.log('');
    console.log('📧 Email: admin@lates.com');
    console.log('🔑 Senha: admin123');
    console.log('');
    console.log('Use estas credenciais para fazer login no endpoint:');
    console.log('   POST /login/sql');
    console.log('   Body: { "email": "admin@lates.com", "password": "admin123" }');
    console.log('');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createAdminUser();
