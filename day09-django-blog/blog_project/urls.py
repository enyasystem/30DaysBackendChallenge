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
from django.contrib import admin
from django.urls import path, include # include function to include other URLconfs
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Mount the blog app at root and at /home/ so the template-based blog home is shown
    path('', include('blog.urls')),
    path('home/', include('blog.urls')),
    path('blog/', include('blog.urls')),  # legacy mount kept for clarity
    # path('post/<int:pk>/', views.post_detail, name='post-detail'),  # detail page
]

