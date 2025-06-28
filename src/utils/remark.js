import { toString } from "hast-util-to-string";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import slugify from "slugify";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export default function remarkFabric() {
  const obj = {};
  const remark = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkCustomComponents)
    .use(remarkRehype)
    .use(rehypeCollectH3Ids, obj)
    .use(rehypeFormat)
    .use(rehypeStringify);

  return async (markdown) => {
    obj.rawHtml = await remark.process(markdown);
    return obj;
  };
}

function remarkCustomComponents() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type !== "containerDirective" ||
        (node.name !== "panel" && node.name !== "note")
      ) {
        return;
      }

      const data = node.data || (node.data = {});
      const attributes = node.attributes || {};
      let className;

      if (node.name === "panel") {
        className = [node.name];
      } else {
        if (!attributes.class) {
          throw new Error("Not class attribute was found for none derective.");
        }
        className = ["note", `note--${attributes.class}`];
      }

      data.hName = "div";
      data.hProperties = { className };
    });
  };
}

function rehypeCollectH3Ids(contextObj) {
  return (tree) => {
    contextObj.h3Ids = [];

    visit(tree, "element", (node) => {
      if (node.tagName !== "h3") return;

      const text = toString(node);
      const id = slugify(text, { lower: true, strict: true });

      node.properties = node.properties || {};
      node.properties.id = id;

      contextObj.h3Ids.push({ text, id });
    });
  };
}
