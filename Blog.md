---
layout: page
title: Blog
---

<!-- This loops through the paginated posts -->
{% for post in site.posts %}
  <h1><a href="{{ post.url }}">{{ post.title }}</a></h1>
  <p class="author">
    <span class="date">{{ post.date | date: "%-d %B %Y" }}</span>
  </p>
  <div class="content">
    {{ post.content }}
  </div>
{% endfor %}



