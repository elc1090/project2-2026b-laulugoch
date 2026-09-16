from flask import Flask

from routes.pedidos import pedidos_bp
from routes.doadores import doadores_bp
from routes.interesses import interesses_bp


app = Flask(__name__)

app.register_blueprint(pedidos_bp)
app.register_blueprint(doadores_bp)
app.register_blueprint(interesses_bp)

@app.route("/")
def inicio():
    return "Servidor funcionando!"


if __name__ == "__main__":
    app.run(debug=True)