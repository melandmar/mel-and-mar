import lume from "lume/mod.ts";
import date from "lume/plugins/date.ts";
import postcss from "lume/plugins/postcss.ts";
import terser from "lume/plugins/terser.ts";
import prism from "lume/plugins/prism.ts";
import basePath from "lume/plugins/base_path.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import metas from "lume/plugins/metas.ts";
import pagefind from "lume/plugins/pagefind.ts";
import sitemap from "lume/plugins/sitemap.ts";
import feed from "lume/plugins/feed.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.8.0/toc.ts";
import image from "https://deno.land/x/lume_markdown_plugins@v0.8.0/image.ts";
import footnotes from "https://deno.land/x/lume_markdown_plugins@v0.8.0/footnotes.ts";
import { alert } from "npm:@mdit/plugin-alert@0.14.0";

const site = lume({
  //location: new URL("https://melandmar."),
});

site.use(postcss())
  .use(basePath())
  .use(toc())
  .use(prism())
  .use(readingInfo())
  .use(date({
    formats: {
      "DEFAULT": "dd.MM.yyyy",
    },
  }))
  .use(metas())
  .use(image())
  .use(footnotes())
  .use(resolveUrls())
  .use(slugifyUrls())
  .use(terser())
  .use(pagefind())
  .use(sitemap())
  .use(feed({
    output: ["/feed.xml", "/feed.json"],
    query: "type=story",
    info: {
      title: "=metas.site",
      description: "=metas.description",
    },
    items: {
      title: "=title",
    },
  }))
  .copy("fonts")
  .copy("js")
  .copy("favicon.png")
  .copy("uploads")
  .mergeKey("extra_head", "stringArray")
  .preprocess([".md"], (pages) => {
    for (const page of pages) {
      page.data.excerpt ??= (page.data.content as string).split(
        /<!--\s*more\s*-->/i,
      )[0];
    }
  });

// Alert plugin
site.hooks.addMarkdownItPlugin(alert);

// Mastodon comment system
site.remoteFile(
  "/js/comments.js",
  "https://cdn.jsdelivr.net/npm/@oom/mastodon-comments@0.3.2/src/comments.js",
);

export default site;
