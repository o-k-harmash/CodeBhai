import antfu from "@antfu/eslint-config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default antfu(
  {
    stylistic: true,
  },
  eslintConfigPrettier,
);
