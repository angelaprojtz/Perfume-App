# we create endpoints here
from flask import request, jsonify
from config import app, db
from models import Perfume
from sqlalchemy import text

import os
import requests

@app.route("/search", methods=["GET"])
def search_fragrances():
    # Get search term from React
    query = request.args.get("q")
    if not query:
        return jsonify({"message": "Missing a search query"}), 400

    # Get personal key from .env
    api_key = os.getenv("FRAGELLA_API_KEY")
    if not api_key:
        return jsonify({"message": "Needs API key!"}), 500
    
    headers = {
        "x-api-key": api_key
        }
    params = {
        "search": query, "limit": 10
        }
    # Call Fragella
    response = requests.get("https://api.fragella.com/api/v1/fragrances", headers=headers, params=params)

    # Convert response to Python
    json_response = response.json()

    # Send it back to React
    return jsonify(json_response)

@app.route("/collection", methods=["GET"])
def get_collection():
    perfumes = Perfume.query.all()
    json_perfumes = list(map(lambda x: x.to_json(), perfumes))
    return jsonify({"perfumes": json_perfumes})

@app.route("/collection", methods=["POST"])
def add_to_collection():
    data = request.json

    perfume = Perfume(
        fragella_id=data.get("fragella_id"),
        name=data.get("name"),
        brand=data.get("brand"),
        image_url=data.get("imageUrl"),
        notes=data.get("notes"),
    )

    try:
        db.session.add(perfume)
        db.session.commit()
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Added to collection!", "perfume": perfume.name}), 201

@app.route("/collection/<int:perfume_id>", methods=["PATCH"])
def update_collection_item(perfume_id):
    perfume = Perfume.query.get(perfume_id)

    data = request.json

    if "purchasedAt" in data:
        perfume.purchased_at = data.get("purchasedAt") or None

    if "wouldBuyAgain" in data:
        value = data.get("wouldBuyAgain")
        if value is None or value == "":
            perfume.would_buy_again = None
        else:
            perfume.would_buy_again = bool(value)

    db.session.commit()
    return jsonify({"message": "Updated!", "perfume": perfume.to_json()}), 200

@app.route("/collection/<int:perfume_id>", methods=["DELETE"])
def delete_from_collection(perfume_id):
    perfume = Perfume.query.get(perfume_id)

    db.session.delete(perfume)
    db.session.commit()
    return jsonify({"message": "Removed from collection"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all() #creates all diff models we defined

    app.run(debug=True) #25 min
