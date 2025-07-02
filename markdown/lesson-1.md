---
title: "Getting Started"
img: "badge-javascript-43bfdf7b.svg"
authors:
  - name: "John Doe"
    link: "https://example.com"
module: "intro"
nextLesson: "lesson-2"
---

### Understanding Asynchronous JavaScript

JavaScript is single-threaded but supports **asynchronous operations** via callbacks, promises, and `async/await`.

:::note{.important}
This lesson introduces different styles of handling asynchronous tasks in JavaScript.
:::

#### The Event Loop

The **event loop** is at the heart of asynchronous behavior.

- Executes synchronous code in the call stack.
- Queues async callbacks (e.g., `setTimeout`, I/O) in the task queue.
- Uses the event loop to push tasks back to the call stack when it's free.

:::note{.tip}

#### Tip

Remember: JavaScript’s concurrency model uses an event loop, not multiple threads.

:::

```javascript
// Example: Promise usage
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("Start");
  await delay(1000);
  console.log("One second later");
}

main();
```

:::note{.warning}

#### Warning

Avoid blocking the event loop with heavy computations; it freezes UI and delays async callbacks.
:::

### Callbacks vs Promises vs Async/Await

:::panel

1. Callbacks: Oldest method but leads to "callback hell".

```javascript
// Callback example
setTimeout(() => {
  console.log("Callback fired!");
}, 1000);
```

2. Promises: Cleaner chaining and error handling.

```javascript
// Promise example
fetch("/data.json")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

3. Async/Await: Syntactic sugar on top of Promises, easier to read.

```javascript
// Async/Await example
async function fetchData() {
  const response = await fetch("/data.json");
  const data = await response.json();
  console.log(data);
}
```

:::

:::note{.tip}

#### Remember

Always handle errors in async code to avoid uncaught exceptions.
:::
