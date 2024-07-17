import requests

API_BASE_URL = 'https://production-general.topfuntek.com/production_line/spc/products/'

def fetch_customers_and_products():
    response = requests.get(API_BASE_URL)
    if response.status_code == 200:
        return response.json().get('data', [])
    return []

def fetch_bin_map(product_id):
    response = requests.get(f"{API_BASE_URL}{product_id}/")
    if response.status_code == 200:
        return response.json().get('data', [])
    return []
