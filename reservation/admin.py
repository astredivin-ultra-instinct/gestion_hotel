from django.contrib import admin
from .models import Hotel, Reservation, Chambre

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('nom','ville','secteur','tel','email')
    search_fields = ('nom', 'ville')

@admin.register(Chambre)
class Chambre(admin.ModelAdmin):
    list_display = ('numero','etage','photo','prix_heure','prix_jour','prix_mois','commentaire')
    search_fields = ('numero','etage')
# Register your models here.
