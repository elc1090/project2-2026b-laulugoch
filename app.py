import os

import psycopg
from dotenv import load_dotenv
from flask import Flask, jsonify

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


if __name__ == "__main__":
    app.run(debug=True)