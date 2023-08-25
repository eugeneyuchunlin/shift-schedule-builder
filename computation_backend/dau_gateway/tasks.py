from celery import shared_task
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .solver import DAUSolver, MockSolver, SASolver
from . import db_client

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
    print(data) 
    if(data['algorithm'] == 0):
        solver = SASolver(data)
    elif data['algorithm'] == 1:
        solver = DAUSolver(data)
    else:
        solver = MockSolver(data)

    time.sleep(1)
    async_to_sync(channel_layer.group_send)(
        task_group_name, {'type': 'chat.message', 'message' : 'Compile'}
    )
    solver.compile()
    time.sleep(1)
    async_to_sync(channel_layer.group_send)(
        task_group_name, {'type': 'chat.message', 'message' : 'Solve'}
    )
    shfit_tables = solver.solve()
    time.sleep(1)
    async_to_sync(channel_layer.group_send)(
        task_group_name, {'type': 'chat.message', 'message' : 'Done'}
    )
    scores = solver.evaluates_all(shfit_tables)

    saved_result = solver.save_result(shfit_tables, scores)
    if saved_result:
        message = "Saved"
    else:
        message = "Failed to save"

    time.sleep(1)
    async_to_sync(channel_layer.group_send)(
        task_group_name, {'type': 'chat.message', 'message' : message}
    )
    pass