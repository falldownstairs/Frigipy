from .views import HelloWorld,processImg,processIngredients
from django.urls import path, include

urlpatterns = [
    path('helloworld/', HelloWorld.as_view()),
    path("processImg/", processImg, name="process"),
    path("processIngredients/", processIngredients, name="processIngredients"),


]