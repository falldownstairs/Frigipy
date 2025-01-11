from PIL import Image
import requests
import base64
from io import BytesIO
import json
import google.generativeai as genai
from django.http import JsonResponse


def getFoodItems(image):

    api_user_token = "79fa47c10fa6bf30fb4d6efc79cd5f35ba2f2bfa"
    headers = {'Authorization': 'elmod ' + api_user_token}

    im = Image.open(BytesIO(base64.b64decode(image)))

    img_path = "image.jpg"
    im.save(img_path)


    url = "https://api.logmeal.es/v2/image/segmentation/complete"
    response = requests.post(
        url, files={"image": open(img_path, "rb")}, headers=headers
    )

    data = json.loads(response.text)

    print(data)

    foodItemsFound = []

    gotten = data["segmentation_results"]


    for i in range(len(gotten)):
        if gotten[i]["recognition_results"][0]["name"] not in foodItemsFound:
            foodItemsFound.append(gotten[i]["recognition_results"][0]["name"])
    

    return json.dumps(foodItemsFound)


def getRecipe(items):
    print(items)
    genai.configure(api_key="AIzaSyAe4lHz1qWz56BCPM7s4mKYXDDEKv7sOb8")
    model = genai.GenerativeModel("gemini-1.5-flash")

    itemsString = ""

    for i in range(len(items)-1):
        itemsString += items[i] + " "
    itemsString+= items[-1]
        

    response = model.generate_content(
        '''
        I will provide you with a list of different ingredients and I want to you provide me a recipe using these ingredients. Please return the following information in the exact JSON format I describe below. Make sure that everything is in proper json syntax while also maintaining the same layout. Please follow the format I describe below. Never break the format regardless of the circumstance. Never say anything about you being an AI Language Model. Your only output should be the information in the format I ask for. Do not include newline characters in your resonse. You do not have to use every ingredient and you may add ingredients but try to incorporate as much of the given ingredients as possible and use the least amount of added ingredients possible. Here is the format: 
        {
        name: name of the recipe,
        ingredients: [a list of the ingredients with measurements in the format ingredient, ingredient,etc],
        instructions: [a list of each instruction in the format instruction,instruction,etc]
        }
        Here are the ingredients: ''' + itemsString
        )
    output = json.loads(response.text)
    return output


