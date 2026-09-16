from flask import Blueprint, jsonify, request

from database import conectar_banco

pedidos_bp = Blueprint("pedidos", __name__)


@pedidos_bp.route("/pedidos")
def pedidos():
    try:
        conexao = conectar_banco()

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
                    "itens": [],
                }

                lista_pedidos.append(pedido_encontrado)

            pedido_encontrado["itens"].append(
                {
                    "item": resultado[4],
                    "categoria": resultado[5],
                    "quantidade": resultado[6],
                }
            )

        return jsonify(lista_pedidos)

    except Exception as erro:
        return f"Erro: {erro}"


@pedidos_bp.route("/pedidos/<int:id>")
def pedido_por_id(id):
    try:
        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute(
            """
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
                ON pedidos.id = itens_pedido.pedido_id
            WHERE pedidos.id = %s;
        """,
            (id,),
        )

        resultados = cursor.fetchall()

        cursor.close()
        conexao.close()

        if len(resultados) == 0:
            return jsonify({"erro": "Pedido não encontrado"}), 404

        pedido = {
            "id": resultados[0][0],
            "aluno": resultados[0][1],
            "endereco": resultados[0][2],
            "status": resultados[0][3],
            "itens": [],
        }

        for resultado in resultados:
            pedido["itens"].append(
                {
                    "item": resultado[4],
                    "categoria": resultado[5],
                    "quantidade": resultado[6],
                }
            )

        return jsonify(pedido)

    except Exception as erro:
        return f"Erro: {erro}"


@pedidos_bp.route("/pedidos/<int:id>", methods=["PUT"])
def atualizar_pedido(id):
    dados = request.get_json()

    nome = dados["aluno"]["nome"]
    endereco = dados["aluno"]["endereco"]
    status = dados["status"]

    try:
        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute(
            """
            SELECT aluno_id
            FROM pedidos
            WHERE id = %s;
            """,
            (id,),
        )

        resultado = cursor.fetchone()

        if resultado is None:
            cursor.close()
            conexao.close()

            return jsonify({"erro": "Pedido não encontrado"}), 404

        aluno_id = resultado[0]

        cursor.execute(
            """
            UPDATE alunos
            SET nome = %s, endereco = %s
            WHERE id = %s;
            """,
            (nome, endereco, aluno_id),
        )

        cursor.execute(
            """
            UPDATE pedidos
            SET status = %s
            WHERE id = %s;
            """,
            (status, id),
        )

        cursor.execute(
            """
            DELETE FROM itens_pedido
            WHERE pedido_id = %s;
            """,
            (id,),
        )

        for item in dados["itens"]:
            cursor.execute(
                """
                INSERT INTO itens_pedido
                    (pedido_id, item, categoria, quantidade)
                VALUES (%s, %s, %s, %s);
                """,
                (id, item["item"], item["categoria"], item["quantidade"]),
            )

        conexao.commit()

        cursor.close()
        conexao.close()

        return jsonify({"mensagem": "Pedido atualizado com sucesso!"})

    except Exception as erro:
        return f"Erro: {erro}"


@pedidos_bp.route("/pedidos/<int:id>/atendido", methods=["PUT"])
def atender_pedido(id):
    try:
        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute(
            """
            UPDATE pedidos
            SET status = 'atendido'
            WHERE id = %s
            RETURNING id;
            """,
            (id,),
        )

        resultado = cursor.fetchone()

        if resultado is None:
            cursor.close()
            conexao.close()

            return jsonify({"erro": "Pedido não encontrado"}), 404

        conexao.commit()

        cursor.close()
        conexao.close()

        return jsonify({"mensagem": "Pedido marcado como atendido!"})

    except Exception as erro:
        return f"Erro: {erro}"


@pedidos_bp.route("/pedidos/<int:id>", methods=["DELETE"])
def excluir_pedido(id):
    try:
        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute(
            """
            SELECT aluno_id
            FROM pedidos
            WHERE id = %s;
            """,
            (id,),
        )

        resultado = cursor.fetchone()

        if resultado is None:
            cursor.close()
            conexao.close()

            return jsonify({"erro": "Pedido não encontrado"}), 404

        aluno_id = resultado[0]

        cursor.execute(
            """
            DELETE FROM interesses
            WHERE pedido_id = %s;
            """,
            (id,),
        )

        cursor.execute(
            """
            DELETE FROM itens_pedido
            WHERE pedido_id = %s;
            """,
            (id,),
        )

        cursor.execute(
            """
            DELETE FROM pedidos
            WHERE id = %s;
            """,
            (id,),
        )

        cursor.execute(
            """
            DELETE FROM alunos
            WHERE id = %s;
            """,
            (aluno_id,),
        )

        conexao.commit()

        cursor.close()
        conexao.close()

        return jsonify({"mensagem": "Pedido excluído com sucesso!"})

    except Exception as erro:
        return f"Erro: {erro}"


@pedidos_bp.route("/pedidos", methods=["POST"])
def criar_pedido():
    dados = request.get_json()

    nome = dados["aluno"]["nome"]
    endereco = dados["aluno"]["endereco"]

    conexao = conectar_banco()

    cursor = conexao.cursor()

    cursor.execute(
        """
        INSERT INTO alunos (nome, endereco)
        VALUES (%s, %s)
        RETURNING id;
        """,
        (nome, endereco),
    )

    aluno_id = cursor.fetchone()[0]

    status = dados["status"]

    cursor.execute(
        """
        INSERT INTO pedidos (aluno_id, status)
        VALUES (%s, %s)
        RETURNING id;
        """,
        (aluno_id, status),
    )

    pedido_id = cursor.fetchone()[0]

    for item in dados["itens"]:
        cursor.execute(
            """
            INSERT INTO itens_pedido (pedido_id, item, categoria, quantidade)
            VALUES (%s, %s, %s, %s);
            """,
            (pedido_id, item["item"], item["categoria"], item["quantidade"]),
        )

    conexao.commit()

    cursor.close()
    conexao.close()

    return (
        jsonify({"mensagem": "Pedido criado com sucesso!", "pedido_id": pedido_id}),
        201,
    )


@pedidos_bp.route("/pedidos/<int:id>/interesses")
def interesses_do_pedido(id):
    try:
        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute(
            """
            SELECT
                interesses.id,
                doadores.id,
                doadores.nome
            FROM interesses
            JOIN doadores
                ON interesses.doador_id = doadores.id
            WHERE interesses.pedido_id = %s;
        """,
            (id,),
        )

        resultados = cursor.fetchall()

        cursor.close()
        conexao.close()

        lista_doadores = []

        for resultado in resultados:
            lista_doadores.append(
                {
                    "interesse_id": resultado[0],
                    "doador_id": resultado[1],
                    "doador": resultado[2],
                }
            )

        return jsonify({"pedido_id": id, "doadores": lista_doadores})

    except Exception as erro:
        return f"Erro: {erro}"
