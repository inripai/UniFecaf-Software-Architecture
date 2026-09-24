# ADR-002 - Persistência com PostgreSQL

## Status

Aceita

## Contexto

O array em memória ajudou no início, mas não mantinha os dados entre uma execução e outra do servidor.

## Alternativas consideradas

1. PostgreSQL com Prisma
2. Arquivo JSON
3. MongoDB
4. SQLite

## Decisão

Usar PostgreSQL como banco de dados e Prisma para acessar os dados pela aplicação Node.js.

## Justificativa

O PostgreSQL atende bem aos dados organizados da EasyFood, como usuários e restaurantes. O Prisma ajuda a criar os modelos e as migrations sem escrever todas as consultas SQL no código da API.

## Consequências

Os dados continuam existindo após reiniciar a aplicação e o banco ajuda a manter o e-mail do usuário único. Como troca, agora é preciso instalar e configurar o PostgreSQL e guardar a URL de conexão no `.env`.

## Critérios de revisão

Essa escolha pode ser revista se a aplicação precisar de outro tipo de banco ou se a quantidade de dados crescer muito.
