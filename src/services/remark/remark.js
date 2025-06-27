import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkNotePlugin from "./plugins/remark.note.palgin.js";
import remarkPanelPlugin from "./plugins/remark.panel.plugin.js";

export default unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkPanelPlugin)
  .use(remarkNotePlugin)
  .use(remarkRehype)
  .use(rehypeFormat)
  .use(rehypeStringify);
