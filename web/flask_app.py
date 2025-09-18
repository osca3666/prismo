from flask import Flask, request, jsonify
from flask_cors import CORS
from core.matching import preview_for_email
from adapters.file_sales import FileSalesFeed
from adapters.sqlite_repo import SqlitePrefsRepo



app = Flask(__name__)
CORS(app) # lets a front end on another origin call this app

sales = FileSalesFeed("data/costco-sales.json")
repo = SqlitePrefsRepo() # will swap later for DynamoDB

@app.get("/")
def hello_world():
    return "<p> Hellow, world! </p>"

@app.get("/api/sales")
def list_sales():
    return jsonify([s.to_dict() for s in sales.all()])

@app.post("/api/preferences")
def create_pref():
    b = request.get_json(force=True)
    repo.save(b["email"], b.get("categories", []), b.get("keywords", []))
    return {"ok": True}, 201

@app.get("/api/alerts/preview")
def preview():
    email = request.args.get("email")
    matches = preview_for_email(sales.all(), repo.find_by_email(email))
    return jsonify([m.to_dict() for m in matches])

if __name__ == "__main__":
    app.run(debug=True)

# @app.route("/")
# def hello_world():
#     return "<p>Hello, World!</p>"