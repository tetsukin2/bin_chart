from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('bin_map/<int:product_id>/', views.get_bin_map, name='get_bin_map'),
    path('generate_chart/', views.generate_chart, name='generate_chart'),
]
