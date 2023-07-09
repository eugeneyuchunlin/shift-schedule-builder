from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from django.conf import settings

db_client = MongoClient(settings.MONGODB_URL, server_api=ServerApi('1'))

try:
    db_client.admin.command('ping')
    print('MongoDB connected')
except Exception as e:
    print(e)