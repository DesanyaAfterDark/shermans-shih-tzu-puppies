# shermans-shih-tzu-puppies

## Blog

Shih Tzu notes only. The tree matches [desanya.tech/blog](https://desanya.tech/blog/): `blog/posts.json` is the catalog (topics, then posts), `blog/index.html` lists published posts grouped A to Z by topic, and each post is `blog/<slug>/index.html`. Topics are the categories. desanya.tech has no separate tag list and no RSS feed, so this site does not add those. Published posts belong in `sitemap.xml`. Each post page includes `BlogPosting` JSON-LD.

`blog/draft/` is a placeholder, marked draft in `posts.json`. It is not a published article. `blog/_template/index.html` is the copy to start from.

To add a post:

1. Copy `blog/_template/` to `blog/<slug>/` (the folder name is the slug).
2. Replace the title, date, topic, description, and body. Remove the template banner. Keep the page about Shih Tzus.
3. In `blog/posts.json`, add an object to `posts` with `draft` set to `false`, or change the draft entry. Use a `topic` id from `topics`. Add a topic there first if you need a new one (id, name, serviceHref, serviceLabel), and keep topics A to Z by name.
4. On `blog/index.html`, list only posts that are not drafts. Group them under the topic, topics A to Z, using the post-card markup in the HTML comment on that page. Remove the "No posts yet" note when the first post is published.
5. Add the post URL to `sitemap.xml`. Do not add a post while `draft` is true.

