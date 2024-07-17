from django.db import models

class Interaction(models.Model):
    customer = models.CharField(max_length=255)
    product = models.CharField(max_length=255)
    bin_map = models.JSONField()
    date_range_start = models.DateField()
    date_range_end = models.DateField()
    pass_bin = models.BooleanField(default=False)
    operation_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer} - {self.product}"
