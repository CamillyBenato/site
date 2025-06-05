from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as login_django
from django.contrib.auth.decorators import login_required

def cadastro(request):
    if request.method == 'GET':
        return render(request, 'cadastro.html')
    else:
        username = request.POST.get('username')
        email = request.POST.get('email')
        senha = request.POST.get('password')

        if User.objects.filter(username=username).exists():
            return HttpResponse('Já existe um usuário com esse username')

        User.objects.create_user(username=username, email=email, password=senha)
        return redirect('/auth/login/')  # Redireciona após cadastro

def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    else:
        username = request.POST.get('username')
        senha = request.POST.get('password')

        user = authenticate(request, username=username, password=senha)

        if user:
            login_django(request, user)
            return redirect('/static/frontend/index.html')  # Redireciona para a home
        else:
            return HttpResponse('Usuário ou senha inválidos')  # Mantém mensagem de erro

@login_required(login_url='/auth/login/')
def plataforma(request):
    return HttpResponse('Bem-vindo à plataforma! Você está logado.')
