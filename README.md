# shermans-shih-tzu-puppies

## Blog

Shih Tzu notes only. The tree matches [desanya.tech/blog](https://desanya.tech/blog/): `blog/posts.json` is the catalog (topics, then posts), `blog/index.html` lists published posts grouped A to Z by topic, and each post is `blog/<slug>/index.html`. Topics are the categories. A post can also list `tags` in `posts.json`; those show on the post and in `BlogPosting` keywords. There are no tag archive pages. desanya.tech has no RSS feed, so this site does not add one. Published posts belong in `sitemap.xml`. Each post page includes `BlogPosting` JSON-LD.

`blog/_template/index.html` is the copy to start from. Do not publish that template.

To add a post:

1. Copy `blog/_template/` to `blog/<slug>/` (the folder name is the slug).
2. Replace the title, date, topic, description, and body. Remove the template banner. Keep the page about Shih Tzus.
3. In `blog/posts.json`, add an object to `posts` with `draft` set to `false`. Use a `topic` id from `topics`. Add a topic there first if you need a new one (id, name, serviceHref, serviceLabel), and keep topics A to Z by name. Add a `tags` array if the post has tags. Leave `image` empty until there is a real photo.
4. On `blog/index.html`, list only posts that are not drafts. Group them under the topic, topics A to Z, using the same post-card markup as the first post. Add the post to the CollectionPage ItemList.
5. Add the post URL to `sitemap.xml`. Do not add a post while `draft` is true.

