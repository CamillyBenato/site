from django.urls import path
from . import views

urlpatterns = [
     path('categorias/', views.CategoriaList.as_view(), name = 'categoria-list'),
     path('categorias/<int:pk>/', views.CategoriaDetail.as_view(), name = 'categoria-detail'),
     path('produtos/', views.ProdutoList.as_view(), name = 'produto-list'),
     path('produtos/<int:pk>/', views.ProdutoDetail.as_view(), name = 'produto-detail'),

     path('presente/', views.presente_view, name='presente'),
     path('cestas/', views.cestas_view, name='cestas'),
     path('buques/', views.buques_view, name='buques'),
     path('flores/', views.flores_view, name='flores'),
     path('jardinagem/', views.jardinagem_view, name='jardinagem'),
     path('suculentas/', views.suculentas_view, name='suculentas'),
    path('sobrenos/', views.sobrenos_view, name='sobrenos'),

]