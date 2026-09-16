from flask import Blueprint, jsonify, request

from database import conectar_banco


interesses_bp = Blueprint("interesses", __name__)

@interesses_bp.route("/interesses", methods=["POST"])
def criar_interesse():
    dados = request.get_json()

    doador_id = dados["doador_id"]
    pedido_id = dados["pedido_id"]

    try:
        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute(
            """
            INSERT INTO interesses (doador_id, pedido_id)
            VALUES (%s, %s)
            RETURNING id;
            """,
            (doador_id, pedido_id)
        )

        interesse_id = cursor.fetchone()[0]

        conexao.commit()

        cursor.close()
        conexao.close()

        return jsonify({
            "mensagem": "Interesse registrado com sucesso!",
            "interesse_id": interesse_id
        }), 201

    except Exception as erro:
        return f"Erro: {erro}"


@interesses_bp.route("/interesses")
def interesses():
    try:
        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute("""
            SELECT
                interesses.id,
                doadores.nome,
                interesses.pedido_id
            FROM interesses
            JOIN doadores
                ON interesses.doador_id = doadores.id;
        """)

        resultados = cursor.fetchall()

        cursor.close()
        conexao.close()

        lista_interesses = []

        for resultado in resultados:
            lista_interesses.append({
                "id": resultado[0],
                "doador": resultado[1],
                "pedido_id": resultado[2]
            })

        return jsonify(lista_interesses)

    except Exception as erro:
        return f"Erro: {erro}"