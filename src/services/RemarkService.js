// services/remark.service.js
import { toString } from "hast-util-to-string";
import * as yaml from "js-yaml";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import slugify from "slugify";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export class RemarkService {
  constructor() {
    this.context = {};
    this.pipeline = unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ["yaml"])
      .use(this._remarkExtractFrontmatter())
      .use(remarkDirective)
      .use(this._remarkCustomComponents())
      .use(remarkRehype)
      .use(this._rehypeCollectH3Ids())
      .use(rehypeFormat)
      .use(rehypeStringify);
  }

  async render(markdown) {
    const vfile = await this.pipeline.process(markdown);
    return {
      ...this.context,
      rawHtml: vfile.value,
    };
  }

  _remarkCustomComponents() {
    return () => {
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
              throw new Error("No class attribute found for note directive.");
            }
            className = ["note", `note--${attributes.class}`];
          }

          data.hName = "div";
          data.hProperties = { className };
        });
      };
    };
  }

  _rehypeCollectH3Ids() {
    return () => {
      return (tree) => {
        this.context.h3Ids = [];

        visit(tree, "element", (node) => {
          if (node.tagName !== "h3") return;

          const text = toString(node);
          const id = slugify(text, { lower: true, strict: true });

          node.properties = node.properties || {};
          node.properties.id = id;

          this.context.h3Ids.push({ text, id });
        });
      };
    };
  }

  _remarkExtractFrontmatter() {
    return () => {
      return (tree) => {
        visit(tree, "yaml", (node) => {
          try {
            const data = yaml.load(node.value);
            Object.assign(this.context, data);
          } catch (err) {
            throw new Error(`YAML frontmatter parse error: ${err.message}`);
          }
        });
      };
    };
  }
}
