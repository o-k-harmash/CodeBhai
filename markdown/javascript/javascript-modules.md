---
authors:
  - name: "Jane Smith"
    link: "https://dev.example.com"
---

### Introduction to JavaScript Modules

JavaScript modules help organize code by splitting it into reusable pieces.

:::note{.important}
This lesson covers the basics of ES Modules and CommonJS, explaining how to structure and import/export code effectively.
:::

#### Why Use Modules?

Modules promote better code organization and reuse:

- Encapsulate functionality
- Avoid global scope pollution
- Enable lazy loading and code splitting

:::note{.tip}

#### Tip

Think of modules as Lego blocks — each file does one thing well and fits with others to form a complete system.

:::

```javascript
// ES Module example
// utils/math.js
export function add(a, b) {
  return a + b;
}
```

```javascript
// app.js
import { add } from "./utils/math.js";

console.log(add(2, 3));
```

:::note{.warning}

#### Warning

Mixing CommonJS (`require`) and ES Modules (`import`) can lead to compatibility issues.

:::

### ES Modules vs CommonJS

:::panel

1. ES Modules: Native in modern browsers and supported in Node.js with `.mjs` or `type: "module"`.

```javascript
// ESM
import fs from "node:fs/promises";
```

2. CommonJS: Traditional Node.js format, still widely used.

```javascript
// CommonJS
const fs = require("node:fs");
```

3. Interop is possible, but requires configuration and attention.

```javascript
// Interop example (Node.js ESM importing CJS)
import cjsModule from "./legacy.cjs";
```

:::

:::note{.tip}

#### Remember

Stick to one module system per project for consistency and fewer surprises.

:::
