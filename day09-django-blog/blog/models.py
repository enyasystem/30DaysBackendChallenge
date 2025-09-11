from django.db import models

# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=200) # blog post title
    content = models.TextField()              # blog post content
    created_at = models.DateTimeField(auto_now_add=True) # timestamp when created

    def __str__(self): # string representation of the model
        return self.title # return the title of the post as its string representation
