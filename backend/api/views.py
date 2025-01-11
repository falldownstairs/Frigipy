from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .util import getFoodItems, getRecipe
import json
# Create your views here.

class HelloWorld(APIView):
    def post(self, request, format=None):
        print(request.data)
        return Response({'ur stuff': request.data})
        
    def get(self, request, fornat=None):
        return Response({request.data['img']}, status=status.HTTP_200_OK)

@api_view(["POST"])
def processImg(request):
    # print(request.data)
    nutrition = getFoodItems(request.data['img'])
    print(nutrition)
    return Response(nutrition)
@api_view(["POST"])
def processIngredients(request):
    response = getRecipe(request.data)
    return Response(response)
