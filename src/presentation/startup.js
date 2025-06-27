import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import LessonService from "../services/lessonServices/lessonService.js";

import App from "./app.js";

const pipe = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkNoteDirective)
  .use(remarkPanelDirective)
  .use(remarkRehype)
  .use(rehypeFormat)
  .use(rehypeStringify);

const app = new App();

const lessonService = new LessonService(pipe);

app.configureMiddlewares();
app.configureEndpoints(lessonService);
app.listen();

export function remarkNoteDirective() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective" || node.name !== "note") return;

      const data = node.data || (node.data = {});
      const attributes = node.attributes || {};
      const className = attributes.class;

      if (!className) {
        // file.fail('Unexpected missing `className` on `note` directive', node)
        return;
      }

      data.hName = "div";
      data.hProperties = {
        className: ["note", `note--${className}`],
      };
    });
  };
}

export function remarkPanelDirective() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective" || node.name !== "panel") return;

      const data = node.data || (node.data = {});

      data.hName = "div";
      data.hProperties = {
        className: ["panel"],
      };
    });
  };
}
