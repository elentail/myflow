from flask import Blueprint, render_template, request
from flask import current_app as my_app
from model.model import History
from config import db
import json
import os
from werkzeug.utils import secure_filename

welcome_blueprint = Blueprint('welcome', __name__)

@welcome_blueprint.route("/")
def welcome():
    return "welcome"

@welcome_blueprint.route('/add')
def add_history():
    row = History(proejct="mywork", flow_id="myflow", train_r2=0.33)
    db.session.add(row)
    db.session.commit()
    return json.dumps({'success' : True})


@welcome_blueprint.route('/layout')
def layout():
    return render_template('layout.html')


@welcome_blueprint.route('/upload')
def upload_file():
   return render_template('upload.html')
	
    
@welcome_blueprint.route('/uploader', methods = ['GET', 'POST'])
def upload_service():
   if request.method == 'POST':
      f = request.files['file']

      f.save('temp'+os.path.sep + secure_filename(f.filename))
      return 'file uploaded successfully'
		