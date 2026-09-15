import os

import psycopg
from dotenv import load_dotenv
from flask import Flask, jsonify, request

load_dotenv()

app = Flask(__name__)


@app.route("/")
def inicio():
    return "Servidor funcionando!"


@app.route("/pedidos")
def pedidos():
    try:
        conexao = psycopg.connect(
            host=os.environ["DB_HOST"],
            port=os.environ["DB_PORT"],
            dbname=os.environ["DB_NAME"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASSWORD"]
        )

        cursor = conexao.cursor()

        cursor.execute("""
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
        """)

        resultados = cursor.fetchall()

        cursor.close()
        conexao.close()

        lista_pedidos = []

        for resultado in resultados:
            pedido_encontrado = None

            for pedido in lista_pedidos:
                if pedido["id"] == resultado[0]:
                    pedido_encontrado = pedido

            if pedido_encontrado is None:
                pedido_encontrado = {
                    "id": resultado[0],
                    "aluno": resultado[1],
                    "endereco": resultado[2],
                    "status": resultado[3],
                    "itens": []
                }

                lista_pedidos.append(pedido_encontrado)

            pedido_encontrado["itens"].append({
                "item": resultado[4],
                "categoria": resultado[5],
                "quantidade": resultado[6]
            })

        return jsonify(lista_pedidos)

    except Exception as erro:
        return f"Erro: {erro}"


@app.route("/pedidos", methods=["POST"])
def criar_pedido():
    dados = request.get_json()

    nome = dados["aluno"]["nome"]
    endereco = dados["aluno"]["endereco"]

    conexao = psycopg.connect(
        host=os.environ["DB_HOST"],
        port=os.environ["DB_PORT"],
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"]
    )

    cursor = conexao.cursor()

    cursor.execute(
        """
        INSERT INTO alunos (nome, endereco)
        VALUES (%s, %s)
        RETURNING id;
        """,
        (nome, endereco)
    )

    aluno_id = cursor.fetchone()[0]

    status = dados["status"]

    cursor.execute(
        """
        INSERT INTO pedidos (aluno_id, status)
        VALUES (%s, %s)
        RETURNING id;
        """,
        (aluno_id, status)
    )

    pedido_id = cursor.fetchone()[0]

    for item in dados["itens"]:
        cursor.execute(
            """
            INSERT INTO itens_pedido (pedido_id, item, categoria, quantidade)
            VALUES (%s, %s, %s, %s);
            """,
            (
                pedido_id,
                item["item"],
                item["categoria"],
                item["quantidade"]
            )
        )

        conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({
        "mensagem": "Pedido criado com sucesso!",
        "pedido_id": pedido_id
    }), 201


if __name__ == "__main__":
    app.run(debug=True)