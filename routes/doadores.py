from flask import Blueprint, jsonify, request

from database import conectar_banco


doadores_bp = Blueprint("doadores", __name__)

@doadores_bp.route("/doadores")
def doadores():
    try:
        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute("""
            SELECT id, nome
            FROM doadores;
        """)

        resultados = cursor.fetchall()

        cursor.close()
        conexao.close()

        lista_doadores = []

        for resultado in resultados:
            lista_doadores.append({
                "id": resultado[0],
                "nome": resultado[1]
            })

        return jsonify(lista_doadores)

    except Exception as erro:
        return f"Erro: {erro}"


@doadores_bp.route("/doadores", methods=["POST"])
def criar_doador():
    dados = request.get_json()

    nome = dados["nome"]

    try:
        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute(
            """
            INSERT INTO doadores (nome)
            VALUES (%s)
            RETURNING id;
            """,
            (nome,)
        )

        doador_id = cursor.fetchone()[0]

        conexao.commit()

        cursor.close()
        conexao.close()

        return jsonify({
            "mensagem": "Doador criado com sucesso!",
            "doador_id": doador_id
        }), 201

    except Exception as erro:
        return f"Erro: {erro}"