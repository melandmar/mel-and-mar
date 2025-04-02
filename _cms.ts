import lumeCMS from "lume/cms/mod.ts";
import { Field } from "lume/cms/types.ts";
import GitHub from "lume/cms/storage/github.ts";
import { Octokit } from "npm:octokit";

const username = Deno.env.get("USERNAME");
const password = Deno.env.get("PASSWORD");

const cms = lumeCMS({
  site: {
    name: "Mel & Mar CMS",
    description: "To write and edit the short story cycle \"Mel & Mar\"",
    //url: "https://melandmar",
  },
  auth: {
    method: "basic",
    users: {
      [username ?? "test"]: password ?? "test",
    },
  },
});

cms.storage(
  "src",
  new GitHub({
    client: new Octokit({ auth: Deno.env.get("GITHUB_TOKEN") }),
    owner: "username",
    repo: "example",
  }),
);

const url: Field = {
  name: "url",
  type: "text",
  description: "The public URL of the page. Leave empty to use the file path.",
  transform(value) {
    if (!value) {
      return;
    }

    if (!value.endsWith("/")) {
      value += "/";
    }
    if (!value.startsWith("/")) {
      value = "/" + value;
    }

    return value;
  },
};

cms.collection(
  "Stories",
  "src:stories/*.md",
  [
    "title: text",
    url,
    "date: date",
    {
      name: "draft",
      type: "checkbox",
    },
    {
      name: "tags",
      type: "list",
      init(field, { data }) {
        field.options = data.site?.search.values("tags");
      },
    },
    {
      name: "content",
      type: "markdown",
    },
  ],
);

cms.collection(
  "Pages",
  "src:pages/*.md",
  [
    "title: text",
    url,
    {
      name: "menu",
      type: "object",
      label: "Whether to include in the menu",
      fields: [
        {
          name: "visible",
          type: "checkbox",
          label: "Show in menu",
        },
        {
          name: "order",
          type: "number",
          label: "Order",
        },
      ],
    },
    {
      name: "content",
      type: "markdown",
      label: "Content",
    },
  ],
);

export default cms;
