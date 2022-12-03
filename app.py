
# Modelagem de entidades
# Prototipação do código
# escrever código
# executar primeiro teste

from flask import Flask

app = Flask(__name__)

from views import *

if __name__ == "__main__":
    app.run(port=8098,debug=True)