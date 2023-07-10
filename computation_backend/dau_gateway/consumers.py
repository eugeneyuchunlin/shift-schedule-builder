import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from .tasks import solve_nsp

from computation_backend.celery import app

class TaskConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.task_id = self.scope['url_route']['kwargs']['task_id']
        self.task_group_name = 'task_%s' % self.task_id

        await self.channel_layer.group_add(
            self.task_group_name, self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.task_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        # print(json.dumps(data, indent=4))
        with open("data.json", "w") as outfile:
            json.dump(data, outfile, indent=4, ensure_ascii=False)

        await self.channel_layer.group_send(
            self.task_group_name, {'type': 'chat.message', 'message' : 'Received'}
        )
        solve_nsp.delay(data, self.task_group_name) 
        

        

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({'message': message}))
        pass