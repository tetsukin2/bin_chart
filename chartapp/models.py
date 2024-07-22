from django.db import models
from django.utils import timezone

class Interaction(models.Model):
    customer = models.CharField(max_length=100)
    product = models.CharField(max_length=100)
    bin_map = models.CharField(max_length=100)
    start_time = models.DateField()
    end_time = models.DateField()
    pass_bin = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Interaction with {self.customer} on {self.product}"
