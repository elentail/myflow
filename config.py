import os
import logging
from logging.handlers import RotatingFileHandler
from flask_sqlalchemy import SQLAlchemy

basedir = os.path.abspath(os.path.dirname(__file__))
db = SQLAlchemy()


class Config:
	SECRET_KEY = os.getenv('SECRET_KEY', 'roadcom_api_incredible')
	DEBUG = False


class DevelopmentConfig(Config):
	DEBUG = True
	SQLALCHEMY_DATABASE_URI = 'sqlite:///web_flow.db'
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	# UPLOAD_FOLDER = 'temp'


class TestingConfig(Config):
	DEBUG = True
	TESTING = True
	SQLALCHEMY_DATABASE_URI = 'sqlite:///' + \
		os.path.join(basedir, 'flask_myflow_test.db')
	PRESERVE_CONTEXT_ON_EXCEPTION = False
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	# UPLOAD_FOLDER = 'temp'


class ProductionConfig(Config):
	DEBUG = False


config_by_name = dict(
	dev=DevelopmentConfig,
	test=TestingConfig,
	prod=ProductionConfig
)


def get_logger():

    loggers = []
    LOG_FILENAME = 'log/myflow_event.log'
    formatter = logging.Formatter(
        "[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
    fileHandler = RotatingFileHandler(
    	LOG_FILENAME, maxBytes=10000000, backupCount=5)
    fileHandler.setLevel(logging.DEBUG)
    fileHandler.setFormatter(formatter)
    loggers.append(fileHandler)
    return loggers
