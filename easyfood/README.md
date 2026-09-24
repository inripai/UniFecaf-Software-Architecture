# EasyFood

Projeto desenvolvido para as atividades de Arquitetura de Software da UniFECAF.

A aplicação permite consultar restaurantes, criar uma conta, fazer login e cadastrar restaurantes. O cadastro de restaurantes precisa de um token JWT válido.

## Tecnologias usadas

- Node.js
- Express
- PostgreSQL
- Prisma
- HTML, CSS e JavaScript

## Organização

```text
easyfood/
├── prisma/                 # Modelos, migration e dados iniciais
├── public/                 # Páginas e arquivos do frontend
├── src/
│   ├── database/           # Conexão com o Prisma
│   ├── modules/
│   │   ├── auth/           # Cadastro, login e middleware JWT
│   │   └── restaurants/    # Rotas e regras de restaurantes
│   └── app.js              # Configuração do Express
├── docs/adr/               # Decisões arquiteturais
└── server.js               # Inicialização do servidor
```

## Como executar

É necessário ter o Node.js e o PostgreSQL instalados.

1. Crie um banco chamado `easyfood` no PostgreSQL.
2. Copie `.env.example` para `.env`.
3. Edite o `.env` com a senha do seu PostgreSQL e uma chave para o JWT.
4. No terminal, dentro da pasta `easyfood`, execute:

```bash
npm install
npm exec prisma generate
npm exec prisma migrate deploy
npm run seed
npm start
```

Depois, abra `http://localhost:3000` no navegador.

## Rotas da API

| Método | Rota | Precisa de token? | Descrição |
| --- | --- | --- | --- |
| GET | `/restaurants` | Não | Lista restaurantes |
| POST | `/restaurants` | Sim | Cadastra restaurante |
| POST | `/auth/register` | Não | Cria usuário |
| POST | `/auth/login` | Não | Faz login e devolve um token |
| GET | `/auth/me` | Sim | Mostra o usuário autenticado |

Para usar uma rota protegida, envie o header abaixo:

```text
Authorization: Bearer SEU_TOKEN
```
