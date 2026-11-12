# Atividade 8 - Evolução do cadastro de pratos e imagens

## Correção analisada

O cadastro de pratos deve aceitar os dados de domínio (`name`, `category`, `description` e `price`) antes de existir uma imagem. A imagem é enviada depois por uma rota multipart específica. Misturar `imageUrl` no corpo do cadastro fazia a criação depender de um valor que só existe após o upload, além de permitir gravar caminhos arbitrários.

No projeto, `validateDish` passou a validar somente os campos do prato e `createDish` cria `imageUrl` como `null`. Dessa forma, `POST /restaurants/:restaurantId/dishes` devolve `201 Created` sem precisar receber arquivo, e a associação com o restaurante é preservada por `restaurantId`.

## Uploads implementados

- `POST /auth/me/image`: usa o usuário do JWT e grava o caminho em `User.profileImage`.
- `POST /dishes/:dishId/image`: verifica o proprietário do restaurante do prato antes de gravar `Dish.imageUrl`.
- `upload.middleware.js`: recebe apenas JPEG, PNG e WebP de até 5 MB.
- `image.service.js`: é reutilizado pelos dois módulos e produz WebP otimizado em `public/uploads`.

## Como testar

1. Crie uma conta e faça login para obter um token.
2. Crie um restaurante autenticado e anote o `id`.
3. Crie um prato com `POST /restaurants/:restaurantId/dishes` e anote o `id` do prato.
4. Envie um arquivo em `form-data`, campo `image`, para as duas rotas de upload com `Authorization: Bearer TOKEN`.
5. Consulte `GET /auth/me` e `GET /dishes/:dishId`; os campos `profileImage` e `imageUrl` devem conter URL públicas que podem ser abertas no navegador.
