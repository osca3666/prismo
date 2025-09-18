from .models import SaleItem, Preference

def matches(item: SaleItem, pref: Preference) -> bool:
    if pref.categories and item.category.lower() not in map(str.lower, pref.categories):
        return False
    if pref.keywords and not any(k.lower() in item.name.lower() for k in pref.keywords):
        return False
    return True

def preview_for_email(sales: list[SaleItem], prefs: list[Preference]) -> list[SaleItem]:
    if not prefs: return []
    return [i for i in sales if any(matches(i, p) for p in prefs)]