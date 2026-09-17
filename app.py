from flask import Flask, send_from_directory

from routes.pedidos import pedidos_bp
from routes.doadores import doadores_bp
from routes.interesses import interesses_bp


app = Flask(__name__, static_folder="frontend", static_url_path="")

app.register_blueprint(pedidos_bp)
app.register_blueprint(doadores_bp)
app.register_blueprint(interesses_bp)

@app.route("/")
def inicio():
    return send_from_directory("frontend", "index.html")


if __name__ == "__main__":
    app.run(debug=True)