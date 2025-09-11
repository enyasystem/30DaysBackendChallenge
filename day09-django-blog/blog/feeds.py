from django.contrib.syndication.views import Feed
from django.urls import reverse
from .models import Post

class LatestPostsFeed(Feed):
    title = "My Blog - Latest Posts"
    link = "/blog/"
    description = "Updates on the latest posts from My Blog."

    def items(self):
        return Post.objects.order_by('-created_at')[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.content[:200]

    def item_link(self, item):
        return reverse('post-detail', args=[item.pk])
