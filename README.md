# Projeto: Aplicação com persistência de dados em backend


![Substitua a imagem ao lado por um GIF/WEBP animado mostrando seu projeto](./moho_follow_through2.gif "GIF animado do projeto. Imagem temporária de Moho Animation https://moho.lostmarble.com/products/moho-pro-special-halls-head-college")



## Acesso

https://project2-2026b-laulugoch.onrender.com


## Desenvolvedor(a)
Lauren Auth Lugoch - Sistemas de Informação



## Proposta
Aplicação web para conectar alunos de escolas públicas a pessoas interessadas em ajudá-los, permitindo cadastrar, consultar, atualizar e excluir pedidos de materiais escolares, uniformes, mochilas e outros recursos. Os alunos podem cadastrar suas necessidades, enquanto os doadores podem consultar os pedidos disponíveis e demonstrar interesse em realizar uma doação.

Modalidade: A


## Parceria/cliente/usuário
Renata de Souza da Fonseca

## Feedback/comentário da parceria/cliente/usuário
Substitua este texto por um feedback produzido pelo(a) colega parceiro(a). Na modalidade A (parceria dev), o foco principal do feedback/comentário estará nas diferenças percebidas no código. Na modalidade B (parceria cliente/usuário), o foco principal do feedback/comentário estará nas funcionalidades/interface.

## Desenvolvimento

### Processo

Comecei o desenvolvimento pesquisando um pouco mais sobre as tecnologias que havia escolhido para o projeto, principalmente sobre Flask e Python, pois eu nunca havia utilizado. Primeiro criei um ambiente virtual com `venv` e fiz alguns testes simples com o Flask para verificar se o servidor estava funcionando e entender melhor como as rotas funcionavam.

Depois, comecei a trabalhar com o banco de dados e precisei instaler a biblioteca `psycopg`, que permite fazer a conexão entre o Python e o PostgreSQL. Antes de integrar tudo com o Flask, fiz alguns testes diretamente no banco utilizando dados fictícios. No início, criei uma tabela mais simples para testar pedidos, inserindo alguns itens e verificando se o Flask conseguia buscar essas informações no PostgreSQL. Esse processo também me ajudou a entender melhor como as tabelas precisavam ser organizadas.

A partir desses testes, fui definindo uma estrutura mais completa para o banco, separando as informações em tabelas para alunos, pedidos, itens dos pedidos, doadores e interesses. Também passei a utilizar um arquivo `schema.sql` para criar as tabelas, em vez de fazer toda a criação manualmente pelo terminal. Nesse processo, aprendi a utilizar `JOIN` nas consultas SQL, que foi necessário para reunir informações que estavam em tabelas diferentes, como os dados do aluno, do pedido e dos itens solicitados.

Depois de testar a estrutura do banco, comecei a desenvolver as rotas da API. Primeiro fiz testes com requisições `POST`, verificando se o Flask recebia corretamente os dados em formato JSON e conseguia inseri-los no banco. Aos poucos, fui adicionando as outras operações necessárias para o sistema, como consulta, edição e exclusão de pedidos, além do cadastro de doadores e do registro de interesse em um pedido.

Durante o desenvolvimento, fui revendo algumas decisões que eu havia tomado e implementado. Por exemplo, inicialmente o sistema permitia que o mesmo doador fosse cadastrado novamente sempre que demonstrasse interesse em outro pedido. Para resolver isso, passei a identificar o doador pelo e-mail e reutilizar o seu cadastro quando ele já existisse. Também percebi que o mesmo doador poderia demonstrar interesse mais de uma vez no mesmo pedido, então fiz alterações na estrutura do banco e nas rotas para impedir essa situação. Também adicionei o status "atendido", juntamente com um botão para identificar o andamento do pedido.

Depois, comecei a desenvolver o frontend com HTML, CSS e JavaScript e a conectá-lo ao backend. Depois de criar a estrutura básica das páginas, fui melhorando a interface, os botões, as mensagens e o fluxo de utilização. Também precisei adaptar o banco e as rotas para permitir que um pedido tivesse mais de um item, em vez de limitar cada pedido a apenas um item.

Durante a implementação das funções de edição e exclusão, percebi uma limitação relacionada à ausência de login e autenticação. Como não implementei usuários autenticados, atualmente essas operações podem ser realizadas sem verificar a identidade de quem está utilizando o sistema. Considerei essa uma possível melhoria futura, caso o projeto fosse ampliado.

Por fim, fiz os testes das principais funcionalidades e publiquei a aplicação utilizando o Render, com o Flask funcionando no backend e o PostgreSQL como banco de dados do servidor. Também precisei adaptar as requisições do JavaScript para utilizar caminhos relativos, o que estava causando problemas no deploy, e isso permitiu que o frontend funcionasse corretamente tanto durante o desenvolvimento quanto depois da publicação.


### Trechos de código

Indique pelo menos 3 trechos de código que você queira destacar para a turma (por exemplo, para explicar algo que aprendeu, para alertar sobre alguma dificuldade de compreensão, para mostrar uma curiosidade, etc).


## Tecnologias

### Linguagens e afins

- Python com Flask
- PostgreSQL
- HTML, CSS e JavaScript
- Render

### Ambiente de desenvolvimento

- VS Code + Live Preview
- Chat GPT gratuito
- Render

## Referências e créditos

Substitua este trecho por uma lista bem detalhada de todo material que você consultou para ajudar no projeto, por exemplo:  URLs de vídeos ou outro material consultado, créditos para colegas que colaboraram, geradores de código, etc.
- Tutorial introdução ao Python com Flask: https://www.youtube.com/watch?v=Z1RJmh_OqeA
- Tutorial Python: https://docs.python.org/pt-br/3.15/tutorial/index.html
- Aplicação com Flask: https://flask.palletsprojects.com/en/stable/quickstart/
- Chat GPT para geração de código e correção de erros




---
Projeto entregue para a disciplina de [Desenvolvimento de Software para a Web](http://github.com/andreainfufsm/elc1090-2026b) em 2026b