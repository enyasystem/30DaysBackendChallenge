from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import Post
import json

# Create post
@csrf_exempt
def create_post(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        post = Post.objects.create(title=data['title'],
                                   content = data['content']
                                   )
        return JsonResponse({'id': post.id, 'title': post.title, 'content': post.content})

#READ all posts
def list_posts(request):
    posts = Post.objects.all().values()
    return JsonResponse(list(posts), safe=False)

#UPDATE a post
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
        
#DELETE a post
@csrf_exempt # to exempt this view from CSRF verification for simplicity
def delete_post(request, post_id):
    if request.method == 'DELETE':
        try:
            post = Post.objects.get(id=post_id)
            post.delete()
            return JsonResponse({'message': 'Post deleted successfully'})
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)
