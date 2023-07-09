from celery import shared_task
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .solver import DAUSolver

import time

channel_layer = get_channel_layer()

@shared_task
def add(x, y, task_group_name):
    time.sleep(5)
    async_to_sync(channel_layer.group_send)(
        task_group_name, {'type': 'chat.message', 'message' : '8'}
    )
    return x + y


@shared_task
def solve_nsp(data, task_group_name):

    pass