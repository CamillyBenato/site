from django.shortcuts import render
from django.shortcuts import render
from .cart import Cart  # ajuste se estiver em outro lugar

def carrinho_view(request):
    cart = Cart(request)
    return render(request, 'carrinho.html', {'cart': cart})

# Create your views here.
