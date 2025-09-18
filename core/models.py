from dataclasses import dataclass

@dataclass
class SaleItem:
    name: str
    category: str
    original_price: float
    sale_price: float
    url: str
    def to_dict(self): return vars(self)

@dataclass
class Preference:
    email: str
    categories: list[str]
    keywords: list[str]