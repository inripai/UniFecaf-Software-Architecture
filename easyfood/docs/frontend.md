# Frontend da EasyFood

O frontend é servido pelo próprio Express. Por isso, não é preciso iniciar outro servidor.

As páginas principais são:

- `index.html`: mostra os restaurantes e contém o formulário de cadastro;
- `login.html`: permite criar conta e fazer login.

O navegador guarda o token e os dados básicos do usuário no `localStorage`. Quando o usuário tenta cadastrar um restaurante, o JavaScript envia o token no header `Authorization`.

Para abrir o frontend, inicie a API e acesse `http://localhost:3000`.
