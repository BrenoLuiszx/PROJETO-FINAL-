-- =============================================
-- LEARNLY PLATFORM - MODELO FÍSICO SQL SERVER
-- =============================================

-- Criar banco de dados
CREATE DATABASE LearnlyDB;
GO

USE LearnlyDB;
GO

-- =============================================
-- TABELA: Usuarios
-- =============================================
CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    senha NVARCHAR(255) NOT NULL,
    foto NVARCHAR(500) NULL,
    role NVARCHAR(20) NOT NULL DEFAULT 'user',
    data_criacao DATETIME2 DEFAULT GETDATE(),
    ativo BIT DEFAULT 1,
    
    CONSTRAINT CK_Usuario_Role CHECK (role IN ('admin', 'user')),
    CONSTRAINT CK_Usuario_Email CHECK (email LIKE '%@%')
);

-- =============================================
-- TABELA: Categorias
-- =============================================
CREATE TABLE Categorias (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(50) NOT NULL UNIQUE,
    descricao NVARCHAR(200) NULL,
    ativo BIT DEFAULT 1
);

-- =============================================
-- TABELA: Instrutores
-- =============================================
CREATE TABLE Instrutores (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    bio NVARCHAR(500) NULL,
    foto NVARCHAR(500) NULL,
    ativo BIT DEFAULT 1
);

-- =============================================
-- TABELA: Cursos
-- =============================================
CREATE TABLE Cursos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(200) NOT NULL,
    descricao NVARCHAR(1000) NOT NULL,
    url NVARCHAR(500) NOT NULL,
    categoria_id INT NOT NULL,
    instrutor_id INT NOT NULL,
    duracao INT NOT NULL, -- em minutos
    data_criacao DATETIME2 DEFAULT GETDATE(),
    ativo BIT DEFAULT 1,
    
    CONSTRAINT FK_Curso_Categoria FOREIGN KEY (categoria_id) REFERENCES Categorias(id),
    CONSTRAINT FK_Curso_Instrutor FOREIGN KEY (instrutor_id) REFERENCES Instrutores(id),
    CONSTRAINT CK_Curso_Duracao CHECK (duracao > 0)
);

-- =============================================
-- TABELA: Inscricoes (Relacionamento Usuario-Curso)
-- =============================================
CREATE TABLE Inscricoes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    data_inscricao DATETIME2 DEFAULT GETDATE(),
    progresso DECIMAL(5,2) DEFAULT 0.00, -- percentual de 0 a 100
    concluido BIT DEFAULT 0,
    data_conclusao DATETIME2 NULL,
    
    CONSTRAINT FK_Inscricao_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    CONSTRAINT FK_Inscricao_Curso FOREIGN KEY (curso_id) REFERENCES Cursos(id),
    CONSTRAINT UK_Inscricao_Usuario_Curso UNIQUE (usuario_id, curso_id),
    CONSTRAINT CK_Inscricao_Progresso CHECK (progresso >= 0 AND progresso <= 100)
);



-- Progresso do usuário por curso
CREATE TABLE Progresso (
  id INT IDENTITY PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES Usuarios(id),
  curso_id INT NOT NULL REFERENCES Cursos(id),
  concluido BIT DEFAULT 0,
  data_conclusao DATETIME2 NULL,
  UNIQUE(usuario_id, curso_id)
);

-- Avaliações de cursos
CREATE TABLE Avaliacoes (
  id INT IDENTITY PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES Usuarios(id),
  curso_id INT NOT NULL REFERENCES Cursos(id),
  nota INT CHECK (nota BETWEEN 1 AND 5),
  comentario NVARCHAR(500),
  data_criacao DATETIME2 DEFAULT GETDATE(),
  UNIQUE(usuario_id, curso_id)
);

CREATE TABLE Certificados (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    nome_usuario NVARCHAR(100) NULL,
    titulo_curso NVARCHAR(200) NULL,
    url_certificado NVARCHAR(500) NULL,
    data_emissao DATETIME2 DEFAULT GETDATE(),
    publico BIT DEFAULT 1,
    CONSTRAINT FK_Certificado_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    CONSTRAINT FK_Certificado_Curso FOREIGN KEY (curso_id) REFERENCES Cursos(id),
    CONSTRAINT UK_Certificado UNIQUE (usuario_id, curso_id)
);
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Avaliacoes') AND name = 'nome_usuario')
    ALTER TABLE Avaliacoes ADD nome_usuario NVARCHAR(100) NULL;
GO

SELECT 'Certificados criados com sucesso!' AS status;

-- Colunas extras nos cursos
ALTER TABLE Cursos ADD imagem NVARCHAR(500) NULL;
ALTER TABLE Cursos ADD descricao_detalhada NVARCHAR(MAX) NULL;
ALTER TABLE Cursos ADD links_externos NVARCHAR(MAX) NULL; -- JSON
ALTER TABLE Cursos ADD anexos NVARCHAR(MAX) NULL;         -- JSON


-- =============================================
-- INSERIR DADOS INICIAIS
-- =============================================

-- Inserir categorias
INSERT INTO Categorias (nome, descricao) VALUES 
('Frontend', 'Desenvolvimento de interfaces de usuário'),
('Backend', 'Desenvolvimento de servidores e APIs'),
('Data Science', 'Ciência de dados e análise'),
('Database', 'Banco de dados e SQL'),
('DevOps', 'Operações e infraestrutura');

-- Inserir instrutores
INSERT INTO Instrutores (nome, bio) VALUES 
('Matheus Battisti', 'Desenvolvedor Full Stack especialista em React'),
('Rocketseat', 'Plataforma de educação em tecnologia'),
('Curso em Video', 'Canal educacional do Professor Gustavo Guanabara'),
('Cod3r', 'Escola de programação online'),
('DevDojo', 'Canal focado em Java e Spring'),
('Origamid', 'Escola de design e front-end'),
('Fabricio Veronez', 'Especialista em DevOps e containers');

-- Inserir usuários iniciais
INSERT INTO Usuarios (nome, email, senha, foto, role) VALUES 
('Breno', 'admin@teste.com', '123456', 'https://i.pinimg.com/736x/72/21/bf/7221bf32061ed0edec3c4e737532b0c8.jpg', 'admin'),
('User', 'user@teste.com', '123456', 'https://api.dicebear.com/7.x/avataaars/svg?seed=User', 'user'),
('João Silva', 'joao@email.com', '123456', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao', 'user'),
('Maria Santos', 'maria@email.com', '123456', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', 'user');

-- Inserir cursos
INSERT INTO Cursos (titulo, descricao, url, categoria_id, instrutor_id, duracao) VALUES 
('React Completo', 'Curso completo de React do básico ao avançado', 'https://www.youtube.com/watch?v=FXqX7oof0I0', 1, 1, 480),
('Node.js para Iniciantes', 'Aprenda Node.js criando uma API REST', 'https://www.youtube.com/watch?v=LLqq6FemMNQ', 2, 2, 360),
('Python Fundamentos', 'Curso de Python para Data Science', 'https://www.youtube.com/watch?v=S9uPNppGsGo', 3, 3, 720),
('JavaScript ES6+', 'Recursos modernos do JavaScript', 'https://www.youtube.com/watch?v=HN1UjzRSdBk', 1, 4, 300),
('Spring Boot API', 'Criando APIs REST com Spring Boot', 'https://www.youtube.com/watch?v=OHn1jLHGptw', 2, 5, 540),
('MySQL Basico', 'Fundamentos de banco de dados MySQL', 'https://www.youtube.com/watch?v=Ofktsne-utM', 4, 3, 240),
('Git e GitHub', 'Controle de versao com Git', 'https://www.youtube.com/watch?v=xEKo29OWILE', 5, 3, 180),
('CSS Grid e Flexbox', 'Layout moderno com CSS', 'https://www.youtube.com/watch?v=x-4z_u8LcGc', 1, 6, 420),
('Vue.js 3', 'Framework progressivo para interfaces', 'https://www.youtube.com/watch?v=wsAQQioPIJs', 1, 4, 380),
('Docker Essentials', 'Containerizacao de aplicacoes', 'https://www.youtube.com/watch?v=0xxHiOSJVe8', 5, 7, 320);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX IX_Usuarios_Email ON Usuarios(email);
CREATE INDEX IX_Cursos_Categoria ON Cursos(categoria_id);
CREATE INDEX IX_Cursos_Instrutor ON Cursos(instrutor_id);
CREATE INDEX IX_Inscricoes_Usuario ON Inscricoes(usuario_id);
CREATE INDEX IX_Inscricoes_Curso ON Inscricoes(curso_id);

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- View: Cursos com detalhes completos
CREATE VIEW vw_CursosCompletos AS
SELECT 
    c.id,
    c.titulo,
    c.descricao,
    c.url,
    cat.nome AS categoria,
    i.nome AS instrutor,
    c.duracao,
    c.data_criacao
FROM Cursos c
INNER JOIN Categorias cat ON c.categoria_id = cat.id
INNER JOIN Instrutores i ON c.instrutor_id = i.id
WHERE c.ativo = 1;

-- View: Estatísticas de usuários
CREATE VIEW vw_EstatisticasUsuarios AS
SELECT 
    u.id,
    u.nome,
    u.email,
    COUNT(ins.id) AS total_inscricoes,
    COUNT(CASE WHEN ins.concluido = 1 THEN 1 END) AS cursos_concluidos,
    AVG(ins.progresso) AS progresso_medio
FROM Usuarios u
LEFT JOIN Inscricoes ins ON u.id = ins.usuario_id
WHERE u.ativo = 1
GROUP BY u.id, u.nome, u.email;

-- =============================================
-- PROCEDURES ÚTEIS
-- =============================================

-- Procedure: Inscrever usuário em curso
CREATE PROCEDURE sp_InscreverUsuario
    @usuario_id INT,
    @curso_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF NOT EXISTS (SELECT 1 FROM Inscricoes WHERE usuario_id = @usuario_id AND curso_id = @curso_id)
    BEGIN
        INSERT INTO Inscricoes (usuario_id, curso_id)
        VALUES (@usuario_id, @curso_id);
        
        SELECT 'Inscrição realizada com sucesso!' AS Mensagem;
    END
    ELSE
    BEGIN
        SELECT 'Usuário já inscrito neste curso!' AS Mensagem;
    END
END;

-- =============================================
-- CONSULTAS DE EXEMPLO
-- =============================================


SELECT * FROM Cursos;

SELECT * FROM Usuarios;

SELECT * FROM Instrutores;

SELECT * FROM Categorias;

SELECT * FROM 

-- Buscar cursos por categoria
SELECT * FROM vw_CursosCompletos WHERE categoria = 'Frontend';

-- Estatísticas dos usuários
SELECT * FROM vw_EstatisticasUsuarios;

-- Cursos mais populares
SELECT 
    c.titulo,
    COUNT(i.id) AS total_inscricoes
FROM Cursos c
LEFT JOIN Inscricoes i ON c.id = i.curso_id
GROUP BY c.id, c.titulo
ORDER BY total_inscricoes DESC;



UPDATE Usuarios
SET senha = '$2a$10$Ba1rMXrknmeN15NeaLkVn.HcVQ5s0lU9O1.o5acO6I.WYzxtjQhMu'
WHERE email IN ('admin@teste.com', 'user@teste.com', 'joao@email.com', 'maria@email.com');


SELECT email, LEN(senha) as tamanho, senha FROM Usuarios WHERE email = 'admin@teste.com';

SELECT COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Usuarios' AND COLUMN_NAME = 'senha';

SELECT email, DATALENGTH(senha) as bytes, senha FROM Usuarios WHERE email = 'admin@teste.com';

ALTER TABLE Usuarios
ADD justificativa_colaborador NVARCHAR(500) NULL;





UPDATE c SET c.url = a.url
FROM Cursos c
INNER JOIN Aulas a ON c.id = a.curso_id
WHERE a.ordem = 1;


CREATE TABLE ProgressoAula (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    aula_id INT NOT NULL,
    curso_id INT NOT NULL,
    concluido BIT DEFAULT 0,
    data_conclusao DATETIME2 NULL,
    CONSTRAINT FK_ProgressoAula_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    CONSTRAINT FK_ProgressoAula_Aula FOREIGN KEY (aula_id) REFERENCES Aulas(id) ON DELETE CASCADE,
    CONSTRAINT UK_ProgressoAula UNIQUE (usuario_id, aula_id)
);
GO


CREATE TABLE Certificados (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    nome_usuario NVARCHAR(100) NULL,
    titulo_curso NVARCHAR(200) NULL,
    url_certificado NVARCHAR(500) NULL,
    data_emissao DATETIME2 DEFAULT GETDATE(),
    publico BIT DEFAULT 1,
    CONSTRAINT FK_Certificado_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    CONSTRAINT FK_Certificado_Curso FOREIGN KEY (curso_id) REFERENCES Cursos(id),
    CONSTRAINT UK_Certificado UNIQUE (usuario_id, curso_id)
);
GO


CREATE TABLE Aulas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    curso_id INT NOT NULL,
    ordem INT NOT NULL,
    titulo NVARCHAR(200) NOT NULL,
    url NVARCHAR(500) NOT NULL,
    descricao NVARCHAR(1000) NULL,
    CONSTRAINT FK_Aula_Curso FOREIGN KEY (curso_id) REFERENCES Cursos(id) ON DELETE CASCADE
);
GO

-- Criar tabela ProgressoAula
CREATE TABLE ProgressoAula (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    aula_id INT NOT NULL,
    curso_id INT NOT NULL,
    concluido BIT DEFAULT 0,
    data_conclusao DATETIME2 NULL,
    CONSTRAINT FK_ProgressoAula_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    CONSTRAINT FK_ProgressoAula_Aula FOREIGN KEY (aula_id) REFERENCES Aulas(id) ON DELETE CASCADE,
    CONSTRAINT UK_ProgressoAula UNIQUE (usuario_id, aula_id)
);
GO

-- Criar índices para melhor performance
CREATE INDEX IX_Aulas_CursoId ON Aulas(curso_id);
CREATE INDEX IX_Aulas_Ordem ON Aulas(curso_id, ordem);
CREATE INDEX IX_ProgressoAula_Usuario ON ProgressoAula(usuario_id);
CREATE INDEX IX_ProgressoAula_Curso ON ProgressoAula(curso_id);
GO


INSERT INTO Aulas (curso_id, ordem, titulo, url, descricao)
SELECT 
    c.id,
    1,
    'Aula 1 - ' + c.titulo,
    c.url,
    'Aula principal do curso'
FROM Cursos c
WHERE NOT EXISTS (
    SELECT 1 FROM Aulas a WHERE a.curso_id = c.id
);

PRINT '✓ Aulas criadas: ' + CAST(@@ROWCOUNT AS VARCHAR);
GO

-- Verificar resultado
SELECT 
    c.id,
    c.titulo AS curso,
    a.id AS aula_id,
    a.titulo AS aula,
    a.url
FROM Cursos c
LEFT JOIN Aulas a ON a.curso_id = c.id
ORDER BY c.id, a.ordem;
GO


DROP TABLE IF EXISTS ProgressoAula;

DROP TABLE IF EXISTS ProgressoAula;

DROP TABLE IF EXISTS ProgressoAula;

CREATE TABLE progresso_aula (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    aula_id INT NOT NULL,
    curso_id INT NOT NULL,
    concluido BIT NOT NULL DEFAULT 0,
    data_conclusao DATETIME2,
    CONSTRAINT UQ_usuario_aula UNIQUE (usuario_id, aula_id),
    CONSTRAINT FK_progresso_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT FK_progresso_aula FOREIGN KEY (aula_id) REFERENCES Aulas(id) ON DELETE CASCADE,
    CONSTRAINT FK_progresso_curso FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

CREATE INDEX idx_progresso_usuario ON progresso_aula(usuario_id);
CREATE INDEX idx_progresso_curso ON progresso_aula(curso_id);




