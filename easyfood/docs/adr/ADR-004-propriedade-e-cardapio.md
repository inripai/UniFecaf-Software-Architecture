# ADR-004 - Cardápio associado ao restaurante e autorizado por proprietário

## Status

Aceita

## Contexto

Com o cadastro de restaurantes pronto, a EasyFood precisava representar os pratos de cada estabelecimento. Também era necessário evitar que uma pessoa autenticada alterasse o cardápio de outro restaurante.

## Decisão

Cada `Dish` pertence a um `Restaurant`. Todo restaurante criado a partir desta versão recebe o identificador do usuário autenticado como `ownerId`. A leitura do cardápio é pública; criar, editar e remover pratos exige autenticação e a confirmação de que o usuário é o proprietário.

O registro de atividades e a notificação de novo restaurante são efeitos secundários: uma falha neles não desfaz um cadastro que já foi concluído no banco.

## Consequências

- A API passa a oferecer um CRUD de pratos e integridade referencial entre restaurante e cardápio.
- O vínculo de dono impede alterações indevidas sem criar uma tabela de permissões antes de ela ser necessária.
- `ownerId` é temporariamente opcional para permitir a migration de bancos que já tinham restaurantes. Registros antigos sem dono não podem ter cardápio alterado até serem associados manualmente a um usuário.
- O e-mail é integrado por HTTP somente quando suas variáveis de ambiente forem configuradas; assim o projeto continua executável em ambiente acadêmico sem credenciais externas.
