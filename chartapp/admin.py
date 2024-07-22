from django.contrib import admin
from .models import Interaction

@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ('customer', 'product', 'bin_map', 'start_time', 'end_time', 'pass_bin', 'created_at')
    list_filter = ('customer', 'product', 'bin_map', 'pass_bin')
    search_fields = ('customer', 'product', 'bin_map')
    date_hierarchy = 'start_time'
