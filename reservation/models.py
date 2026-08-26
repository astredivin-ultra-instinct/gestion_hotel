from django.db import models
from django.contrib.auth.models import User 
# Create your models here.

class Hotel(models.Model):
    nom = models.CharField(max_length=30)
    ville = models.CharField(max_length=20)
    secteur = models.CharField(max_length=20)
    localisation = models.CharField(max_length=200)
    tel = models.IntegerField()
    email = models.EmailField()
    photo = models.ImageField(upload_to='photos_dhotel/')
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.nom} {self.email}"
    
class Chambre(models.Model):
    numero = models.IntegerField()
    photo = models.ImageField(upload_to='photos_dhotel/')
    etage = models.IntegerField()
    nombre = models.IntegerField()
    prix_heure =models.IntegerField()
    prix_jour = models.IntegerField()
    prix_mois =models.IntegerField()
    commentaire = models.TextField(max_length=201,null=True,blank = True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    reserver = models.BooleanField(default=False)

class Reservation(models.Model):
    nom = models.CharField(max_length=30)
    prenom = models.CharField(max_length=40)
    tel = models.IntegerField()
    temps = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    TARIF = (
        ('jour', 'par jour'),
        ('heure', 'par heure'),
        ('mois', 'par mois'),
    )
    tarif = models.CharField(max_length=10, choices=TARIF, default ='jour')
    total = models.DecimalField(max_digits=15,decimal_places=0)
    chambre = models.ForeignKey(Chambre, on_delete=models.CASCADE)
    util = models.OneToOneField(User, on_deletemodels.CASCADE)
    #date_debut = models.DateTime()
    #date_fin = models.DateTime()