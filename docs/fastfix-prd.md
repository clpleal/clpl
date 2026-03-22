# FastFix — PRD consolidado

## Proposta de valor

FastFix é um app de serviços locais rápidos para clientes que precisam resolver pequenos problemas com agilidade e para prestadores que querem captar demanda próxima em tempo real.

**Tagline:** `Chamou, resolveu.`

## Papéis

- **Cliente**: abre pedidos de serviço.
- **Prestador**: aceita ou negocia pedidos.
- **Usuário híbrido**: pode atuar nos dois papéis.

## Autenticação e perfil

- Login por telefone com SMS via Firebase Auth.
- Sessão persistente e sem senha.
- Perfil com:
  - nome
  - telefone
  - papéis
  - nota média
  - total de serviços concluídos
  - categorias atendidas

## Fluxo do cliente

1. Escolher categoria (`Elétrica`, `Reparos/Montagem`, `Limpeza`, etc.).
2. Responder perguntas dinâmicas da categoria.
3. Informar descrição, fotos e urgência.
4. Visualizar preço sugerido e complexidade.
5. Publicar pedido para prestadores próximos.

## Fluxo do prestador

Ao receber um pedido próximo, o prestador pode:

- aceitar o preço sugerido;
- enviar contra-oferta única;
- recusar.

Se o cliente aceitar a contra-oferta, o pedido passa a `in_progress`. Se rejeitar, o pedido continua disponível para outros prestadores.

## Regras operacionais

- Chat livre não faz parte do MVP.
- O pedido expira automaticamente após janela configurável, sugerida em 6 horas.
- O primeiro aceite confirmado no banco vence concorrência simultânea.
- O prestador marca o serviço como concluído.
- Após conclusão, cliente e prestador se avaliam mutuamente.

## Confiança e reputação

- Avaliações públicas de 1 a 5 estrelas.
- Priorização de usuários bem avaliados.
- Estratégia de cold start para novos prestadores.
- Disputas com análise humana e evidências anexadas.

## Monetização

- Comissão por serviço.
- Plano premium para prestadores.
- Destaque pago para pedidos urgentes.
- Split de pagamento via gateway externo.

## Stack alvo

- **Frontend**: Flutter ou FlutterFlow.
- **Backend**: Firebase.
  - Auth
  - Firestore
  - Storage
  - FCM
  - Cloud Functions

## KPI iniciais

- GMV
- tempo médio até aceite
- taxa de conversão de pedidos
- DAU/MAU
- retenção
- avaliação média
- churn
