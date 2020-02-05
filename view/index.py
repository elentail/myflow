from flask import Blueprint, render_template
from flask import current_app as my_app

index_blueprint = Blueprint('index', __name__, url_prefix="/hello")

@index_blueprint.route("/")
def index():
    my_app.logger.info('hello restful')
    return render_template("main.html")