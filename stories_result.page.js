export const layout = "layouts/stories_result.vto";

export default function* ({ search }) {
  // Generate a page for each tag
  for (const tag of search.values("tags")) {
    yield {
      url: `/stories/${tag}/`,
      title: `Tagged “${tag}”`,
      type: "tag",
      search_query: `type=story '${tag}'`,
      tag,
    };
  }
}
