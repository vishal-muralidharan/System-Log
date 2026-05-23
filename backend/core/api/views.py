from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def ApiOverview(RequestInstance):
    MessageData = {"Message": "Backend system is active and routing correctly."}
    return Response(MessageData)
