from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import Post
import json
from django.http import JsonResponse
from datetime import datetime
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


def _reading_time(text):
    # approximate reading time: 200 words per minute
    words = len(text.split()) if text else 0
    minutes = max(1, int(words / 200) if words >= 200 else 1)
    return minutes


# Simple JSON API root
def api_root(request):
    return JsonResponse({"message": "Welcome to the Blog API"})


# Create post (API)
@csrf_exempt
def create_post(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        post = Post.objects.create(title=data.get('title', ''),
                                   content=data.get('content', '')
                                   )
        return JsonResponse({'id': post.id, 'title': post.title, 'content': post.content}, status=201)
    return JsonResponse({'message': 'Method not allowed'}, status=405)


# READ all posts (API)
def list_posts(request):
    posts = Post.objects.all().values()
    return JsonResponse(list(posts), safe=False)


# UPDATE a post (API)
@csrf_exempt
def update_post(request, post_id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        try:
            post = Post.objects.get(id=post_id)
            post.title = data.get('title', post.title)
            post.content = data.get('content', post.content)
            post.save()
            return JsonResponse({'message': 'Post updated successfully'})
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)
    return JsonResponse({'message': 'Method not allowed'}, status=405)


# DELETE a post (API)
@csrf_exempt  # to exempt this view from CSRF verification for simplicity
def delete_post(request, post_id):
    if request.method == 'DELETE':
        try:
            post = Post.objects.get(id=post_id)
            post.delete()
            return JsonResponse({'message': 'Post deleted successfully'})
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)
    return JsonResponse({'message': 'Method not allowed'}, status=405)


# Template views
def home(request):
    posts_list = Post.objects.all().order_by('-created_at')  # latest first
    paginator = Paginator(posts_list, 6)  # 6 posts per page
    page = request.GET.get('page', 1)
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(1)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)

    # add reading_time attribute for each post in page
    for p in posts:
        p.reading_time = _reading_time(p.content)

    return render(request, 'blog/home.html', {"posts": posts, "year": datetime.now().year})


def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)  # fetch single post or show 404
    post.reading_time = _reading_time(post.content)
    return render(request, 'blog/post_detail.html', {"post": post, "year": datetime.now().year})
