from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.list_posts, name='list_posts'),
    path('', views.home, name='home_blog'),
    path('posts/create/', views.create_post, name='create_post'),
    path('posts/update/<int:post_id>/', views.update_post, name='update_post'),
    path('posts/delete/<int:post_id>/', views.delete_post, name='delete_post'),
]
