-- Criar usuário admin inicial
USE lates_project;
GO

-- Verificar se já existe
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@lates.com')
BEGIN
    INSERT INTO users (id, name, email, password, role, createdAt, updatedAt)
    VALUES (
        NEWID(),
        'Administrador',
        'admin@lates.com',
        '$2b$10$Xqf4XUV3qMJmrKtZOX0dNuSOAchkCExk5uwy38rtw1SvFKSSMf.q6',
        'admin',
        GETDATE(),
        GETDATE()
    );
    PRINT 'Usuário admin criado com sucesso!'
END
ELSE
BEGIN
    PRINT 'Usuário admin já existe.'
END
GO
