"""
URL configuration for blog_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('posts/', views.list_posts, name='list_posts'), # List all posts
    path('posts/create/', views.create_post, name='create_post'), # Create a new post
    path('posts/<int:post_id>/update/', views.update_post, name='update_post'), # Update a post
    path('posts/<int:post_id>/delete/', views.delete_post, name='delete_post'), # Delete a post
    
]

