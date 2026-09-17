# Projeto: Aplicação com persistência de dados em backend


<img width="1280" height="721" alt="AjudaAluno" src="https://github.com/user-attachments/assets/a2ac8786-1556-4d83-b116-344de8e741a1" />


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

Depois, comecei a trabalhar com o banco de dados e precisei instalar a biblioteca `psycopg`, que permite fazer a conexão entre o Python e o PostgreSQL. Antes de integrar tudo com o Flask, fiz alguns testes diretamente no banco utilizando dados fictícios. No início, criei uma tabela mais simples para testar pedidos, inserindo alguns itens e verificando se o Flask conseguia buscar essas informações no PostgreSQL. Esse processo também me ajudou a entender melhor como as tabelas precisavam ser organizadas.

A partir desses testes, fui definindo uma estrutura mais completa para o banco, separando as informações em tabelas para alunos, pedidos, itens dos pedidos, doadores e interesses. Também passei a utilizar um arquivo `schema.sql` para criar as tabelas, em vez de fazer toda a criação manualmente pelo terminal. Nesse processo, aprendi a utilizar `JOIN` nas consultas SQL, que foi necessário para reunir informações que estavam em tabelas diferentes, como os dados do aluno, do pedido e dos itens solicitados.

Depois de testar a estrutura do banco, comecei a desenvolver as rotas da API. Primeiro fiz testes com requisições `POST`, verificando se o Flask recebia corretamente os dados em formato JSON e conseguia inseri-los no banco. Aos poucos, fui adicionando as outras operações necessárias para o sistema, como consulta, edição e exclusão de pedidos, além do cadastro de doadores e do registro de interesse em um pedido.

Durante o desenvolvimento, fui revendo algumas decisões que eu havia tomado e implementado. Por exemplo, inicialmente o sistema permitia que o mesmo doador fosse cadastrado novamente sempre que demonstrasse interesse em outro pedido. Para resolver isso, passei a identificar o doador pelo e-mail e reutilizar o seu cadastro quando ele já existisse. Também percebi que o mesmo doador poderia demonstrar interesse mais de uma vez no mesmo pedido, então fiz alterações na estrutura do banco e nas rotas para impedir essa situação. Também adicionei o status "atendido", juntamente com um botão para identificar o andamento do pedido.

Depois, comecei a desenvolver o frontend com HTML, CSS e JavaScript e a conectá-lo ao backend. Depois de criar a estrutura básica das páginas, fui melhorando a interface, os botões, as mensagens e o fluxo de utilização. Também precisei adaptar o banco e as rotas para permitir que um pedido tivesse mais de um item, em vez de limitar cada pedido a apenas um item.

Durante a implementação das funções de edição e exclusão, percebi uma limitação relacionada à ausência de login e autenticação. Como não implementei usuários autenticados, atualmente essas operações podem ser realizadas sem verificar a identidade de quem está utilizando o sistema. Considerei essa uma possível melhoria futura, caso o projeto fosse ampliado.

Por fim, fiz os testes das principais funcionalidades e publiquei a aplicação utilizando o Render, com o Flask funcionando no backend e o PostgreSQL como banco de dados do servidor. Também precisei adaptar as requisições do JavaScript para utilizar caminhos relativos, o que estava causando problemas no deploy, e isso permitiu que o frontend funcionasse corretamente tanto durante o desenvolvimento quanto depois da publicação.


### Trechos de código

**1. Busca de resultados com `fetchone()` e `fetchall()`**

```python
cursor.execute("""
    SELECT id
    FROM doadores
    WHERE email = %s;
""", (email,))

resultado = cursor.fetchone()
```

Precisava consultar informações que já estavam armazenadas no PostgreSQL e utilizar esses resultados dentro do Python. Descobri as funções `fetchone()` e `fetchall()`, que permitem recuperar os resultados de uma consulta. O `fetchone()` recupera um único resultado, enquanto o `fetchall()` recupera todos os resultados encontrados. Neste trecho, a aplicação procura um doador pelo e-mail e o `fetchone()` recupera seu `id`. Isso foi utilizado para verificar se o doador já estava cadastrado antes de criar um novo registro.

**2. Persistência das alterações com `commit()`**

```python
conexao = conectar_banco()

cursor = conexao.cursor()

cursor.execute(
    """
    INSERT INTO interesses (doador_id, pedido_id)
    VALUES (%s, %s)
    RETURNING id;
    """,
    (doador_id, pedido_id),
)

interesse_id = cursor.fetchone()[0]

cursor.execute(
    """
    UPDATE pedidos
    SET status = 'em andamento'
    WHERE id = %s;
    """,
    (pedido_id,),
)

conexao.commit()

cursor.close()
conexao.close()
```

Para trabalhar com a persistência de dados no servidor, precisei entender como as alterações feitas pelo Python eram efetivamente salvas no PostgreSQL. Nesse processo, aprendi a utilizar a `conexao` para estabelecer a conexão com o banco e o `cursor` para executar as consultas. Descobri que, após operações como cadastro, edição ou exclusão, é necessário utilizar o `commit()` para confirmar a transação. Neste trecho, o `commit()` confirma as alterações realizadas no banco, enquanto `cursor.close()` e `conexao.close()` encerram o cursor e a conexão com o PostgreSQL.

**3. Utilização de `JOIN`**

```sql
SELECT
    pedidos.id,
    alunos.nome,
    alunos.endereco,
    pedidos.status,
    itens_pedido.item,
    itens_pedido.categoria,
    itens_pedido.quantidade
FROM pedidos
JOIN alunos
    ON pedidos.aluno_id = alunos.id
JOIN itens_pedido
    ON pedidos.id = itens_pedido.pedido_id;
```

Ao organizar o banco, precisei separar as informações em diferentes tabelas, mas depois precisava exibir os dados de um pedido junto com as informações do aluno e dos itens. Para isso, descobri o `JOIN`, que permite relacionar tabelas por meio de campos em comum. Neste trecho, os pedidos são relacionados às tabelas `alunos` e `itens_pedido`, permitindo recuperar todas essas informações em uma única consulta.



## Tecnologias

### Linguagens e afins

- Python com Flask
- PostgreSQL
- HTML, CSS e JavaScript
- Render

### Ambiente de desenvolvimento

- VS Code
- Chat GPT gratuito
- Render

## Referências e créditos

- Tutorial introdução ao Python com Flask: https://www.youtube.com/watch?v=Z1RJmh_OqeA
- Tutorial Python: https://docs.python.org/pt-br/3.15/tutorial/index.html
- Aplicação com Flask: https://flask.palletsprojects.com/en/stable/quickstart/
- Chat GPT para geração de código e correção de erros




---
Projeto entregue para a disciplina de [Desenvolvimento de Software para a Web](http://github.com/andreainfufsm/elc1090-2026b) em 2026b
