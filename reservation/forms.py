from django import forms
from django.contrib.auth.forms import AuthenticationForm
from .models import Hotel, Chambre, Reservation

class CompteForm(forms.ModelForm):
    password = forms.CharField(widget = forms.PasswordInput(attrs = {'placeholder':'Mot de passe'} ),label='Mot de passe')
    conf_pass = forms.CharField(widget = forms.PasswordInput(attrs = {'placeholder':'Confirmer'}),label = 'Confirmer le mot de passe')
    class Meta:
        model = Hotel
        fields = ['nom','ville', 'secteur','localisation','tel','email','photo']
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        conf_pass = cleaned_data.get('conf_pass')
        if password and conf_pass and password != conf_pass:
            raise forms.ValidationError("Les mots de passe ne correspondent pas!")
            return cleaned_data

class ChambreForm(forms.ModelForm):
    class Meta:
        model = Chambre
        fields = ['numero','etage','nombre','prix_heure','prix_jour','prix_mois']

class ReservationForm(forms.ModelForm):
    class Meta:
        model = Reservation
        fields = ['nom','prenom','tel','temps']



