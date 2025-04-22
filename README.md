# SongsAPI

API RESTful para gerenciamento de usuários, músicas e playlists, com suporte a upload e streaming de arquivos de áudio.

## Tecnologias Utilizadas

- Node.js
- Express
- Sequelize (PostgreSQL)
- JWT para autenticação
- bcrypt para criptografia de senhas
- Multer para upload de arquivos
- dotenv para gerenciamento de variáveis de ambiente
- mime-types e fs para leitura/streaming de arquivos

## Funcionalidades

### Usuários
- Cadastro de usuário
- Login e geração de token JWT com versionamento
- Atualização de dados com revalidação do token
- Exclusão de conta com remoção de músicas associadas

### Músicas
- Upload de arquivos de áudio
- Stream de áudio com validação de tipo MIME
- Atualização e exclusão de músicas
- Busca com filtros por nome, artista e gênero
- Paginação nos resultados
- Validações centralizadas com mensagens padronizadas

### Playlists
- Criação, edição e exclusão de playlists
- Adição e remoção de músicas da playlist
- Busca de músicas de uma playlist
- Proteção de acesso via token (usuário só pode modificar sua própria playlist)

  ### DotEnv.
  - O dotenv deve conter os seguintes campos:
  - - JWT_SECRET=your_jwt_secret
  - - DB_USER=your_database_user
  - - DB_PASS=your_database_password
  - - DB_NAME=your_database_name
  - - DB_HOST=localhost
  - - PORT=porta
