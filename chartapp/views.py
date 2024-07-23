# views.py

from django.shortcuts import render
from django.http import JsonResponse
from .services import fetch_customers_and_products, fetch_bin_map
from .models import Interaction
import requests
import json

from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

def index(request):
    data = fetch_customers_and_products()
    return render(request, 'chartapp/index.html', {'data': data})

def get_bin_map(request, product_id):
    data = fetch_bin_map(product_id)
    return JsonResponse({'data': data})

@csrf_exempt 
@require_POST
def generate_chart(request):
    url = 'https://production-general.topfuntek.com/production_line/spc/normal-distribution/'
    headers = {
        'Content-Type': 'application/json'
    }

    try:
        data = json.loads(request.body)
        print(f"Received data: {data}")

        required_fields = ["product_id", "pass bin", "start_time", "end_time", "bin"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            error_message = f'Missing fields: {", ".join(missing_fields)}'
            print(error_message)
            return JsonResponse({'error': error_message}, status=400)

        if not isinstance(data['bin'], list) or not all(isinstance(bin, (str, int)) for bin in data['bin']):
            error_message = 'Invalid bin format. Expected a list of strings or integers.'
            print(error_message)
            return JsonResponse({'error': error_message}, status=400)

        print(f"Sending data to external API: {data}")

        response = requests.post(url, headers=headers, json=data) 

        if response.status_code == 200:
        
            interaction = Interaction.objects.create(
                customer=data.get('customer', 'Unknown'),
                product=data['product_id'],
                bin_map=", ".join(map(str, data['bin'])),  
                start_time=data['start_time'],
                end_time=data['end_time'],
                pass_bin=data['pass bin']
            )
            return JsonResponse(response.json(), status=response.status_code)
        else:
            error_message = f'Failed to generate chart. API responded with status {response.status_code}. Details: {response.json()}'
            print(error_message)
            return JsonResponse({'error': error_message}, status=response.status_code)

    except json.JSONDecodeError:
        error_message = 'Invalid JSON received in request body.'
        print(error_message)
        return JsonResponse({'error': error_message}, status=400)
    except requests.RequestException as e:
        error_message = f'Request to external API failed: {str(e)}'
        print(error_message)
        return JsonResponse({'error': error_message}, status=500)
