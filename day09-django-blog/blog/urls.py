from django.urls import path
from . import views
from .feeds import LatestPostsFeed

urlpatterns = [
    # Template routes
    path('', views.home, name='blog-home'),
    path('post/<int:pk>/', views.post_detail, name='post-detail'),

    # Simple JSON API routes (kept under /api/ for clarity)
    path('api/', views.api_root, name='api-root'),
    path('api/posts/', views.list_posts, name='list_posts'),
    path('api/posts/create/', views.create_post, name='create_post'),
    path('api/posts/update/<int:post_id>/', views.update_post, name='update_post'),
    path('api/posts/delete/<int:post_id>/', views.delete_post, name='delete_post'),
    # RSS feed
    path('feeds/latest/', LatestPostsFeed(), name='posts_feed'),
]
