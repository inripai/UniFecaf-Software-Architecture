# ADR-003 - Autenticação com JWT

## Status

Aceita

## Contexto

O cadastro de restaurantes precisa saber qual usuário está fazendo a ação. Também não é seguro guardar senhas em texto puro.

## Alternativas consideradas

1. JWT com bcryptjs
2. Sessão salva no servidor
3. Login por conta Google

## Decisão

Usar bcryptjs para transformar a senha em hash e JWT para identificar o usuário nas rotas protegidas.

## Justificativa

Essa opção funciona bem para uma API pequena e permite que o navegador envie o token no header `Authorization` ao cadastrar um restaurante.

## Consequências

As senhas não ficam visíveis no banco e a rota de cadastro fica protegida. Em troca, é necessário guardar uma chave secreta no `.env` e tratar token inválido ou expirado.

## Critérios de revisão

A decisão pode ser revista se a EasyFood precisar de login com redes sociais, recuperação de senha ou controle mais detalhado de sessões.
