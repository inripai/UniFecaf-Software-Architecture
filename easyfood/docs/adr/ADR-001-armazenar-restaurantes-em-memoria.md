# ADR-001 - Armazenar restaurantes em memória

## Status

Substituída

## Contexto

Na primeira versão da EasyFood, era necessário testar rapidamente as rotas de consulta e cadastro de restaurantes.

## Alternativas consideradas

1. Array em memória
2. Banco PostgreSQL
3. Arquivo JSON

## Decisão

No começo, os restaurantes foram guardados em um array dentro da aplicação.

## Justificativa

O array não precisava de instalação ou configuração. Assim, era possível criar e testar as primeiras rotas com menos etapas.

## Consequências

O desenvolvimento inicial ficou mais simples. Por outro lado, os dados eram perdidos quando o servidor era reiniciado.

## Critérios de revisão

Esta decisão seria revisada quando fosse necessário manter os restaurantes salvos depois de reiniciar a aplicação.
