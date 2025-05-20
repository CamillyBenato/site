"""
URL configuration for projeto_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from produtos import views as produtos_views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('produtos.urls')),

    path('', produtos_views.index, name='index'),
    path('presente/', produtos_views.presente_view, name='presente'),
    path('cestas/', produtos_views.cestas_view, name='cestas'),
    path('buques/', produtos_views.buques_view, name='buques'),
    path('flores/', produtos_views.flores_view, name='flores'),
    path('jardinagem/', produtos_views.jardinagem_view, name='jardinagem'),
    path('suculentas/', produtos_views.suculentas_view, name='suculentas'),
    path('sobrenos/', produtos_views.sobrenos_view, name='sobrenos'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
