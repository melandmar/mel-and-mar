export const layout = "layouts/stories.vto";

export default function* ({ search, paginate }) {
  const stories = search.pages("type=story", "date=desc");

  for (
    const data of paginate(stories, { url, size: 10 })
  ) {
    // Show the first page in the menu
    if (data.pagination.page === 1) {
      data.menu = {
        visible: true,
        order: 1,
      };
    }

    yield {
      ...data,
      title: "Stories",
    };
  }
}

function url(n) {
  if (n === 1) {
    return "/stories/";
  }

  return `/stories/${n}/`;
}
