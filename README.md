# Prismo 
Save preferences (email, categories, keywords) and preview matching sale items.

## Run
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python web/flask_app.py

## Test
curl http://localhost:5000/api/sales
curl -X POST http://localhost:5000/api/preferences -H "Content-Type: application/json" \
  -d '{"email":"me@example.com","categories":["eggs"],"keywords":["kirkland"]}'
curl "http://localhost:5000/api/alerts/preview?email=me@example.com"
