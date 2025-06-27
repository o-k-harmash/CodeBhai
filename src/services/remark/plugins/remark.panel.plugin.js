import { visit } from "unist-util-visit";

export default function remarkPanelPlugin() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective" || node.name !== "panel") {
        return;
      }

      const data = node.data || (node.data = {});

      data.hName = "div";
      data.hProperties = {
        className: ["panel"],
      };
    });
  };
}
