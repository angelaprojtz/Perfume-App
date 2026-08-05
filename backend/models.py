#db models
from config import db

class Perfume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fragella_id = db.Column(db.String(120), unique=True, nullable=True)
    name = db.Column(db.String(200), nullable=False)
    brand = db.Column(db.String(120), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    notes = db.Column(db.Text, nullable=True)  # stored as comma-separated text
    purchased_at = db.Column(db.String(80), nullable=True)  # e.g. 2024-03-15
    would_buy_again = db.Column(db.Boolean, nullable=True)  # True/False/None

    def to_json(self):
        return {
            "id": self.id,
            "fragellaId": self.fragella_id,
            "name": self.name,
            "brand": self.brand,
            "imageUrl": self.image_url,
            "notes": self.notes,
            "purchasedAt": self.purchased_at,
            "wouldBuyAgain": self.would_buy_again,
        }
