# Desafio Fullstack Grupo Parvi
Olá queremos te desafiar a participar do nosso time de Inovação do Grupo Parvi.\
Para isso queremos saber um pouco mais sobre você e para isso temos um pequeno desafio onde,\
você pode construir uma aplicação simples e mostrar seu conhecimento e no final receberá um feedback
sobre a sua aplicação, e aí achou interessante?\
Podemos começar?

## Regra de negócio da aplicação
Você deve construir uma aplicação de listagem de carros a venda.
A aplicação deve possibilitar que um usuário faça as seguintes ações:
  - Listar todos carros cadastrados para venda
  - Adicionar um novo carro
  - Editar um carro já existente
  - Remover um carro já cadastrado
  - Cada carro só poderá pertencer a loja que for relativa a marca, abaixo a relação:
    - <details>
      <summary>Relação Marca/Loja</summary>
    
      | Marca | Lojas |
      | -------- | -------- |
      | BYD | BYD Recife, BYD Salvador |
      | Hyundai | Pateo Afogados, Pateo São Luis |
      | Toyota | Toyolex Ibiribeira, Toyolex Natal |
      | Volkswagen | Bremen Recife, Bremen João Pessoa |
    </details>


## O Desafio
O desafio consiste em contruir uma aplicação, onde:
- **Backend**:
  - Deve ser construído para rodar em NodeJs
  - Deve utilizar o TypeScript
  - Deve conter um CRUD (Create,Read,Update,Delete) dos carros
  - Deve ter um endpoint para cada select do formulário (marca/loja) de cadastro/edição dos carros
  - Deve persistir os dados, utilizando alguma banco de dados Relacional
  - Deve validar se a relação loja/marca estão corretos
    
- **Frontend**:
  - Deve construir utilizando SPA
  - Deve ter toda sua interface contruita baseada em nosso protótipo que disponibilizamos para você no [Figma](https://www.figma.com/proto/1B8n8RWXjAUfZKOVBY6gFd/Desafio?t=M7jMf7flv60rJfjk-1&node-id=7-1918&starting-point-node-id=7%3A1918)
  - Deve consumir os endpoints do Backend para poder realizar as ações previstas na regra
  - Deve alertar o usuário em caso de sucesso ou falha ao consumir o backend

#### O que seria legal se você fizesse
(Essa parte aqui não é obrigatória mas seria bastante legal se você fizesse)
- **Backend**:
  - Configurar e padronizar o seu código utilizando ESLint
  - Usar o paradigma e Orientação a Objetos
  - Utilizar o framework NestJS
  - Validar todos os dados recebidos nos endpoints
  - Tratar todos os possíveis erros e retornar uma mensagem padronizada e amigável
  - Realizar testes unitários
- **Frontend**:
  - Utilizar o Angular
  - Usar o paradigma e Orientação a Objetos
  - Configurar e padronizar seu código utilizando ESLint
  - Realizar testes unitários
  - Mostrar um loading ao realizar os consumos

## O que vamos avaliar
 - Seu código
 - Boas práticas
 - Organização
 - Usabilidade

## Como enviar a resolução
- Realize o fork desse repositório
- Crie uma branch com o nome desafio/SEU_NOME (Onde está `SEU_NOME` você coloca seu nome)
- Code a vontade
- No final Solicite um Pull Request
- Nos envie um link com seu pull request

## Observação
O mais importante nesse desafio é que você entregue ele a tempo, mesmo que você não tenha feito tudo que queria.

Boa sorte no desafio!\
Estamos animado com sua participação!\
Ficamos no aguardo!\
