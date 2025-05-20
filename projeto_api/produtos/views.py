from django.shortcuts import render

from rest_framework import generics
from .models import Categoria, Produto
from .serializers import CategoriaSerializer, ProdutoSerializer

class CategoriaList(generics.ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    
class CategoriaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    
class ProdutoList(generics.ListCreateAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    
class ProdutoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

def index(request):
    return render(request, 'index.html')

def presente_view(request):
    return render(request, 'presente.html')

def cestas_view(request):
    return render(request, 'cestas.html')

def buques_view(request):
    return render(request, 'buques.html')

def flores_view(request):
    return render(request, 'flores.html')

def jardinagem_view(request):
    return render(request, 'jardinagem.html')

def suculentas_view(request):
    return render(request, 'suculentas.html')

def sobrenos_view(request):
    return render(request, 'sobrenos.html')