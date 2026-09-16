from flask import Flask

from routes.pedidos import pedidos_bp


app = Flask(__name__)

app.register_blueprint(pedidos_bp)

@app.route("/")
def inicio():
    return "Servidor funcionando!"


if __name__ == "__main__":
    app.run(debug=True)