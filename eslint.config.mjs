import antfu from "@antfu/eslint-config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default antfu(
  {
    stylistic: true,
    formatters: {
      /**
       * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
       * By default uses Prettier
       */
      css: true,
      /**
       * Format HTML files
       * By default uses Prettier
       */
      html: true,
    },
  },
  eslintConfigPrettier,
);
