from flask import Flask
from view.index import index_blueprint
from view.welcome import welcome_blueprint
from config import config_by_name, get_logger, db


def create_app():
    app = Flask(__name__, template_folder="template", static_folder="static")
    app.config.from_object(config_by_name['dev'])
    app.register_blueprint(index_blueprint)
    app.register_blueprint(welcome_blueprint)
    
    app.logger.handlers = get_logger()
    db.init_app(app)

    with app.app_context():
        db.create_all()
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)