# ADR-005 - Processamento de imagens como serviço compartilhado

## Status

Aceita

## Contexto

Usuários e pratos precisam receber imagens. Copiar a validação, otimização e gravação de arquivos em cada rota criaria comportamentos diferentes e tornaria mudanças futuras mais caras.

## Decisão

Usar `Multer` em memória somente como middleware de entrada e concentrar o processamento no `image.service.js`. O serviço usa `Sharp` para corrigir orientação, limitar a imagem a 800 × 800 px e converter o resultado para WebP. Os arquivos ficam em `public/uploads`, expostos pelo Express, e o banco armazena apenas o caminho público.

## Consequências

- A rota decide quem pode enviar; o controller traduz HTTP; o serviço aplica regra de negócio e reutiliza o processamento de imagem.
- Perfil e prato têm o mesmo padrão de qualidade, formato e limpeza de arquivo substituído.
- O upload aceita somente JPEG, PNG e WebP, com limite de 5 MB. Arquivos inválidos recebem resposta HTTP adequada antes de chegar ao banco.
- Processar uma imagem antes de atualizar o banco permite remover o arquivo gerado caso a persistência falhe.
