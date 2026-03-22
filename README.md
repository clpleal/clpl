# FastFix

FastFix é um marketplace mobile-first para micro-serviços locais sob demanda com a proposta **"Chamou, resolveu."**.

Este repositório agora contém um starter kit técnico para transformar o documento de produto em uma base implementável com Firebase + Flutter/FlutterFlow.

## O que está incluído

- `docs/fastfix-prd.md`: PRD consolidado a partir do documento enviado.
- `docs/architecture.md`: arquitetura, fluxos e roadmap técnico do MVP.
- `firebase/firestore.rules`: regras iniciais de segurança para usuários, pedidos, ofertas, avaliações e disputas.
- `firestore.indexes.json`: índices sugeridos para consultas principais.
- `functions/`: esqueleto de Cloud Functions em TypeScript para automações centrais.

## MVP previsto

1. Autenticação por telefone com Firebase Auth.
2. Perfis híbridos de cliente e prestador.
3. Criação de pedidos com categoria, perguntas dinâmicas, urgência e localização.
4. Ofertas estruturadas sem chat livre.
5. Expiração automática de pedidos.
6. Avaliação bidirecional.
7. Disputas com evidências.

## Estrutura sugerida de produto

### Coleções principais

- `users`
- `requests`
- `requests/{requestId}/offers`
- `ratings`
- `disputes`

### Eventos automatizados

- criação de pedido
- criação de oferta
- mudança de status para `in_progress`
- mudança de status para `completed`
- scheduler para expiração de pedidos

## Próximos passos

- Inicializar o app Flutter/FlutterFlow consumindo esse contrato de dados.
- Configurar projeto Firebase, Auth por telefone e FCM.
- Substituir as funções placeholder por integrações reais de geolocalização, notificações e pagamentos.
