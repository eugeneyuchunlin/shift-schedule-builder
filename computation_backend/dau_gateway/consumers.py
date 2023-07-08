import json

from channels.generic.websocket import WebsocketConsumer

class TaskConsumer(WebsocketConsumer):

    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        print(text_data)

        pass