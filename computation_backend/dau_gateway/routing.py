from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/tasks/(?P<task_id>[^/]+)/$', consumers.TaskConsumer.as_asgi()),
]