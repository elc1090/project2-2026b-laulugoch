CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(200) NOT NULL
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL,
    item VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    quantidade INTEGER NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

CREATE TABLE doadores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE interesses (
    id SERIAL PRIMARY KEY,
    doador_id INTEGER NOT NULL,
    pedido_id INTEGER NOT NULL,
    FOREIGN KEY (doador_id) REFERENCES doadores(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);