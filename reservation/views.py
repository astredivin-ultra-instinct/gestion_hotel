from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from .models import Hotel, Reservation, Chambre
from django.http import JsonResponse
from .models import Hotel, Chambre, Reservation
from django.contrib.auth.forms import AuthenticationForm
import json
from django.db.models import Q
from django.urls import reverse
from .forms import CompteForm, ChambreForm, ReservationForm


# Create your views here.

@login_required
def profil(request):
    p = Hotel.objects.get(user = request.user)
    data = {
            'id': p.id,
            'nom': p.nom,
            'ville': p.ville,
            'secteur': p.secteur,
            'localisation': p.localisation,
            'tel': p.tel,
            'email': p.email,
            'photo': p.photo.url if p.photo else ''
        }
    return JsonResponse(data, safe=False)

def affichage(request):
    #data = json.loads(request.body)
    chambres = Chambre.objects.all()
    data = []
    for c in chambres:
        data.append({
            'id': c.id,
            'numero' : c.numero,
            'etage' : c.etage,
            'photo': c.photo.url if c.photo else '',
            'prix_heure' : c.prix_heure,
            'prix_jour' : c.prix_jour,
            'prix_mois' : c.prix_mois,
            'hotel' : c.hotel.nom,
            'localisation': c.hotel.localisation,
            'tel': c.hotel.tel,
            'email': c.hotel.email,
            'ville': c.hotel.ville,
            'secteur': c.hotel.secteur,
        })
    return JsonResponse(data, safe = False)

def profiles(request):
    return render(request, 'profiles.html')


def compte_hotel(request):
    if request.method == 'POST':
        #data = json.loads(request.body) 
        form = CompteForm(request.POST, request.FILES)
        exist = Hotel.objects.all()
        if form.is_valid():
            email = form.cleaned_data['email']
            for e in exist:
                if e.email == email :
                    return JsonResponse({'success':False,'error':'Cet email exist déjà !'})
            password = form.cleaned_data['password']
            user = User.objects.create_user(username=email, email=email, password=password)
            user.first_name = form.cleaned_data['nom']
            user.save()
            hotel = form.save(commit=False)
            hotel.user = user
            hotel.save()
            login(request, user)
            return JsonResponse({'success':True,'message':"Compte créer avec succès",'redirect_url':reverse('login')})
            print(reverse('login'))
        else:
            return JsonResponse({'success':False,'error':form.errors.as_json()})
    else:
        return JsonResponse({'success':False,'message': "Methodes non valide"})

def connexion(request):
    if request.method == 'POST':
        #data = json.loads(request.body)
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return JsonResponse({'success':True, 'message':"Connexion reussie",'redirect_url': reverse('profiles')})
        else:
            return JsonResponse({'success':False,'message':"identifiants incorrects, Verifier bien vos informations!",'error':form.errors.as_json()})

@login_required
def add_chambre(request):
    if request.method == 'POST':
        #data = json.loads(request.body)
        exist = Chambre.objects.filter(user = request.user)
        form = ChambreForm(request.POST, request.FILES)
        if form.is_valid():
            numero = form.cleaned_data['numero']
            #if Chambre.objects.filter(user= request.user,numero=numero).exist():
            for e in exist:
                if e.numero == numero:
                    return JsonResponse({'success': False,'message':'Ce numéro de chambre à déjà été ajouté !'} )
            chambre = form.save(commit=False)
            chambre.user = request.user
            chambre.hotel = request.user.hotel
            chambre.save()
            return JsonResponse({'success':True,'message':"Chambre ajouté avec succès",'redirect_url':reverse('profiles')})
        else:
            return JsonResponse({'success':False,'error':form.errors.as_json()})

@login_required
def supp_chambre(request, k):
    chambre = get_object_or_404(Chambre,id = k,user=request.user)
    if request.method == 'POST':
        if chambre.reserver:
            return JsonResponse({'success': False, 'message': "Suppression impossible! Cette chambre à été reservée"})
        else:
            chambre.delete()
        if not chambre:
            return JsonResponse({'success':True, 'message':"Supprimé avec succès", 'redirect_url': reverse('profiles')})
        else :
            return JsonResponse({'success':False, 'message':"Une erreur est survenue lors de suppression veuillez reessayer plutard!"})
    else:
        return JsonResponse({'success':False, 'error':"Methode non autorisé"})
@login_required
def mod_chambre(request, k):
    chambre = get_object_or_404(Chambre, id=k, user=request.user)
    if request.method == 'POST':
        form = ChambreForm(request.POST,request.FILES, instance=chambre)
        if form.is_valid():
            form.save()
            return JsonResponse({'success':True, 'message': "Modifier avec succèss",'redirect_url': reverse("acceuil")})
        else:
            return JsonResponse({'success':False,'error':forms.error})
    else:
        ChambreForm(instance=chambre)

def reserver_chambre(request, k):
    chambre = get_object_or_404(Chambre, id=k)
    chambre.refresh_from_db()
    print(f"la chambre est réservée ?:{chambre.reserver}")
    if not chambre.reserver:
        if request.method == 'POST':
            #data = json.loads(request.body)
            form = ReservationForm(request.POST)
            if form.is_valid():
                reserve = form.save(commit=False)
                reserve.chambre = chambre
                if reserve.tarif == 'heure':
                    reserve.total = chambre.prix_heure * reserve.temps
                elif reserve.tarif == 'mois':
                    reserve.total = chambre.prix_mois * reserve.temps
                elif reserve.tarif == 'jour':
                    reserve.total = chambre.prix_jour * reserve.temps
                else:
                    reserve.total = chambre.prix_jour * reserve.temps
                reserve.save()
                chambre.reserver = True
                chambre.save()
                return JsonResponse({'success':True, 'message':"Chambre reservée avec succès", 'total':float(reserve.total)})

            else:
                return JsonResponse({'success': False, 'error':form.errors.as_json()})
        else:
            return JsonResponse({'success':False, 'message':"Méthode non autorisée !"})
    else:
        return JsonResponse({'success':False,'message':"Cette chambre à déjà été reservé !"})

@login_required
def reservation(request):
    hotel = Hotel.objects.get(user = request.user)
    reservation = Reservation.objects.filter(chambre__hotel = hotel)
    data = []
    for r in reservation:
        data.append({
        'id': r.id,
        'nom': r.nom,
        'prenom': r.prenom,
        'tel': r.tel,
        'temps': r.temps,
        'total': r.total,
        'numero': r.chambre.numero,
        'etage': r.chambre.etage,
        'tarif': r.tarif,
        'date': r.date.strftime('%d/%m/%Y à %Hh%M')
    })
    return JsonResponse(data, safe=False)




def rechercher(request):
    query = request.GET.get('q', '')
    if query:
        #data = json.loads(request.body)
        mots = query.split()
        filtre = Q()
        for m in mots:
            m_filtrer = (
                Q(hotel__nom__icontains=m) |
                Q(hotel__ville__icontains=m) |
                Q(hotel__secteur__icontains=m)

            )
            filtre &= m_filtrer
        hotels = Chambre.objects.filter(
            filtre
        )
        if not hotels :
            return JsonResponse({'success':False,'message':"Aucun hotel trouvé !"})
        #data = list(hotels.values('hotel','numero','etage','prix_jour','prix_heure','prix_mois','nombre','photo','commentaire'))#('nom','ville','localisation','secteur','photo','tel','email'))
        data = []
        for c in hotels:
            data.append({
                'id': c.id,
                'ville': c.hotel.ville,
                'localisation': c.hotel.localisation,
                'secteur': c.hotel.secteur,
                'nom': c.hotel.nom,
                'tel': c.hotel.tel,
                'numero': c.numero,
                'etage': c.etage,
                'prix_heure': c.prix_heure,
                'prix_jour': c.prix_jour,
                'prix_mois': c.prix_mois,
                'photo': c.photo.url if c.photo else ''
            }) 
        print("hôtel trouvé")
    else:
        print("aucun hôtel trouvé")
        data = []
    return JsonResponse(data, safe=False)

def acceuil(request):
    return render(request, 'Hotel.html')

def logine(request):
    return render(request, 'connexion.html')

@login_required
def deconnexion(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success':True,'message':" Vous avez été déconnecté",'redirect_url':reverse('acceuil')})
    else:
        return JsonResponse({'success':False, 'message':"Méthode non autorisée!"})

@login_required
def chambre_enr(request):
    chambre = Chambre.objects.filter(user = request.user)
    data = []
    for c in chambre:
        data.append({
            'id': c.id,
            'numero': c.numero,
            'etage': c.etage,
            'prix_heure': c.prix_heure,
            'prix_jour': c.prix_jour,
            'prix_mois': c.prix_mois,
            'photo': c.photo.url if c.photo else ''
        })
    return JsonResponse(data, safe=False)

def users(request) :
    return render(request, 'users.html')
