import json 
from core.models import SaleItem

class FileSalesFeed:
    def __init__(self, path: str): 
        self.path = path
    def all(self) -> list[SaleItem]:
        with open(self.path) as f: data = json.load(f)
        return [SaleItem(
            name=d["name"], category=d["category"],
            original_price=d["originalPrice"], sale_price=d["salePrice"],
            url=d["url"]
        ) for d in data]
