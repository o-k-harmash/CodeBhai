import { visit } from "unist-util-visit";

export default function remarkNotePlugin() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective" || node.name !== "note") {
        return;
      }

      const data = node.data || (node.data = {});
      const attributes = node.attributes || {};
      const className = attributes.class;

      if (!className) {
        return;
      }

      data.hName = "div";
      data.hProperties = {
        className: ["note", `note--${className}`],
      };
    });
  };
}
