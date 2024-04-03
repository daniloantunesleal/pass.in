# pass.in

O pass.in é uma aplicação de **gestão de participantes em eventos presenciais**. 

A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.

Os participantes inscritos podem emitir uma credencial para check-in no dia do evento.

O sistema fará um scan da credencial do participante para permitir a entrada no evento.

## Requisitos

### Requisitos funcionais

- [ ] O organizador deve poder cadastrar um novo evento;
- [ ] O organizador deve poder visualizar dados de um evento;
- [ ] O organizador deve poser visualizar a lista de participantes; 
- [ ] O participante deve poder se inscrever em um evento;
- [ ] O participante deve poder visualizar seu crachá de inscrição;
- [ ] O participante deve poder realizar check-in no evento;

### Regras de negócio (https://rseat.in/regrasdenegócios-nlw)

- [x] O participante só pode se inscrever em um evento uma única vez;
- [x] O participante só pode se inscrever em eventos com vagas disponíveis;
- [x] O participante só pode realizar check-in em um evento uma única vez;

### Requisitos não-funcionais

- [ ] O check-in no evento será realizado através de um QRCode;

# Antoações
Métodos HTTP: GET, POST, DELETE, PATCH, HEAD, OPTIONS, ...
Corpo da requisição (Request Body)
Paramentros de busca (Search Params / Query Params) `http://localhost:3333/users?name=Danilo`
Parametros de rota (Route Params) -> Identificação de recursos
Cabeçalho (Headers) -> Contexto

Driver nativo / Query Builderss / ORMs

20x => Sucesso
30x => Redirecionamento
40x => Erro do cliente (Erro em alguma informação enviada por quem esta fazendo a chamada para api)
50x => Erro do servidor (Erro que está acontecendo independente do que está sendo enviado para oservidor)