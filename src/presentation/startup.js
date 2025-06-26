import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import LessonService from "../services/lessonServices/lessonService.js";
import App from "./app.js";

const pipe = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify);

const app = new App();

const lessonService = new LessonService(pipe);

app.configureMiddlewares();
app.configureEndpoints(lessonService);
app.listen();
