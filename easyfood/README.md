# EasyFood

Projeto desenvolvido para as atividades de Arquitetura de Software da UniFECAF.

A aplicação permite consultar restaurantes, criar uma conta, fazer login, cadastrar restaurantes e manter o cardápio de cada restaurante. O cadastro e a manutenção do cardápio exigem um token JWT válido e somente o dono pode alterar seu restaurante.

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
│   │   ├── dishes/         # Cardápio e autorização por proprietário
│   │   ├── restaurants/    # Rotas e regras de restaurantes
│   │   └── shared/         # Atividades, notificações e processamento de imagens
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
| GET | `/restaurants/:restaurantId/dishes` | Não | Lista o cardápio de um restaurante |
| POST | `/restaurants/:restaurantId/dishes` | Sim, dono | Adiciona um prato ao cardápio |
| GET | `/dishes/:dishId` | Não | Mostra um prato |
| PUT | `/dishes/:dishId` | Sim, dono | Atualiza um prato |
| DELETE | `/dishes/:dishId` | Sim, dono | Remove um prato |
| POST | `/auth/me/image` | Sim | Envia a foto do perfil autenticado |
| POST | `/dishes/:dishId/image` | Sim, dono | Envia a imagem de um prato |

Para usar uma rota protegida, envie o header abaixo:

```text
Authorization: Bearer SEU_TOKEN
```

### Notificações opcionais

Todo cadastro de restaurante fica registrado em `Activity`. Se as variáveis `MAILERSEND_API_KEY`, `MAIL_FROM` e `COMMERCIAL_EMAIL` forem configuradas, a aplicação também envia avisos por e-mail. Sem essas variáveis, a notificação é apenas registrada no console e o cadastro continua funcionando.

### Upload de imagens

As rotas de upload usam `multipart/form-data` com o campo `image`. São aceitos JPEG, PNG e WebP de até 5 MB. A imagem é validada, corrigida quanto à orientação, redimensionada sem ampliação para no máximo 800 × 800 px e convertida para WebP. O caminho público resultante é salvo no PostgreSQL e pode ser aberto diretamente no navegador.
