"""
URL configuration for Hotel project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from reservation import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('creation_compte/',views.compte_hotel, name='compte_hotel'),
    path('connexion/', views.connexion, name='connexion'),
    path('deconnexion/', views.deconnexion, name='deconnexion'),
    path('ajouter_chambre/', views.add_chambre, name='add_chambre'),
    path('modifier_chambre/', views.mod_chambre, name='mod_chambre'),
    path('supprimer_chambre/', views.supp_chambre, name='supp_chambre'),
    path('reservation/<int:k>', views.reserver_chambre, name='reserver_chambre'),
    path('', views.acceuil, name='acceuil'),
    path('login/', views.logine, name='login'),
    path('recherche/', views.rechercher, name="rechercher"),
    path('affichage/', views.affichage, name='affichage'),
    path('profiles/', views.profiles, name='profiles')

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
