from sqlalchemy import create_engine, text
from core.models import Preference

class SqlitePrefsRepo:
    def __init__(self, url="sqlite:///app.db"):
        self.eng = create_engine(url, future=True)
        with self.eng.begin() as c:
            c.execute(text("""CREATE TABLE IF NOT EXISTS preference(
              id INTEGER PRIMARY KEY, email TEXT NOT NULL)"""))
            c.execute(text("""CREATE TABLE IF NOT EXISTS pref_category(
              id INTEGER PRIMARY KEY, pref_id INT, category TEXT)"""))
            c.execute(text("""CREATE TABLE IF NOT EXISTS pref_keyword(
              id INTEGER PRIMARY KEY, pref_id INT, keyword TEXT)"""))
    def save(self, email, categories, keywords):
        with self.eng.begin() as c:
            pref_id = c.execute(text(
              "INSERT INTO preference(email) VALUES (:e)"), {"e": email}
            ).lastrowid
            for cat in categories:
                c.execute(text(
                  "INSERT INTO pref_category(pref_id,category) VALUES(:p,:c)"),
                  {"p": pref_id, "c": cat})
            for kw in keywords:
                c.execute(text(
                  "INSERT INTO pref_keyword(pref_id,keyword) VALUES(:p,:k)"),
                  {"p": pref_id, "k": kw})
    def find_by_email(self, email) -> list[Preference]:
        with self.eng.begin() as c:
            prefs = c.execute(text(
              "SELECT id,email FROM preference WHERE email=:e"), {"e": email}
            ).all()
            results = []
            for pid, em in prefs:
                cats = [r[0] for r in c.execute(text(
                  "SELECT category FROM pref_category WHERE pref_id=:p"), {"p": pid})]
                keys = [r[0] for r in c.execute(text(
                  "SELECT keyword FROM pref_keyword WHERE pref_id=:p"), {"p": pid})]
                results.append(Preference(email=em, categories=cats, keywords=keys))
            return results
