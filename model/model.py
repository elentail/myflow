from config import db


class students(db.Model):
   id = db.Column('student_id', db.Integer, primary_key=True)
   name = db.Column(db.String(100))
   city = db.Column(db.String(50))
   addr = db.Column(db.String(200))
   pin = db.Column(db.String(10))

   def __init__(self, name, city, addr, pin):
       self.name = name
       self.city = city
       self.addr = addr
       self.pin = pin


class History(db.Model):
    __table_anem__ = "history"

    id = db.Column(db.Integer, primary_key=True)
    project = db.Column(db.String(50))
    flow_id = db.Column(db.String(30))
    train_r2 = db.Column(db.Float)

    def __init__(self, proejct, flow_id, train_r2):
        self.project = proejct
        self.flow_id = flow_id
        self.train_r2 = train_r2

    def __repr__(self):
        return "<History id={}>, project={}".format(self.id, self.project)
