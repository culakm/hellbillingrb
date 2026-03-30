---
name: modern-best-practice-vue-components
description: Build clean, modern Vue components that apply common best practices and avoid common pitfalls
user-invocable: true
---

# Modern Best-Practice Vue Components

When building or reviewing Vue components, apply these rules. They reflect the official Vue 3 style guide (Priority A & B), Composition API idioms, and Pinia conventions.

---

## SFC Structure

Order sections: `<template>`, then `<script setup>`, then `<style scoped>`.

```vue
<template>
	<div>{{ message }}</div>
</template>

<script setup>
import { ref } from "vue";

const message = ref("Hello");
</script>

<style scoped>
div {
	color: inherit;
}
</style>
```

---

## Component Names

Always use multi-word names to avoid conflicts with HTML elements.

```vue
<!-- Bad -->
<Item />

<!-- Good -->
<TodoItem />
```

---

## Props

- Always use object syntax with at least a type — never array syntax in production code.
- Declare in **camelCase**, use **kebab-case** in templates.
- Add `required`, `default`, and `validator` where appropriate.

```js
const props = defineProps({
	greetingText: {
		type: String,
		required: true,
	},
	count: {
		type: Number,
		default: 0,
	},
	status: {
		type: String,
		default: "idle",
		validator: (value) => ["idle", "loading", "error", "success"].includes(value),
	},
});
```

```vue-html
<MyComponent greeting-text="hi" :count="5" status="loading" />
```

---

## Emits

Declare all emitted events with `defineEmits()`.

```js
const emit = defineEmits(["update", "delete"]);

const handleClick = () => {
	emit("update", payload);
};
```

---

## Reactive State

- Use `ref()` as the default for all reactive state (primitives and objects).
- Use `computed()` for derived values — never store derived data in a separate ref.
- Access `.value` in script; it is unwrapped automatically in templates.

```js
import { ref, computed } from "vue";

const items = ref([]);
const count = computed(() => items.value.length);
```

---

## Watchers

- Use `watch()` when reacting to specific sources.
- Use `watchEffect()` for auto-tracked side effects.
- Use `onCleanup` inside `watchEffect` to abort stale async work.

```js
import { ref, watch, watchEffect } from "vue";

const query = ref("");

// Specific source
watch(query, (newVal) => {
	console.log("query changed:", newVal);
});

// Auto-tracked with cleanup
watchEffect((onCleanup) => {
	const controller = new AbortController();
	fetch(`/api?q=${query.value}`, { signal: controller.signal });
	onCleanup(() => controller.abort());
});
```

Useful options for `watch`:

- `immediate: true` — run handler on creation
- `deep: true` — deep-watch objects/arrays
- `once: true` — fire only once (Vue 3.4+)

---

## Lifecycle Hooks

Import and call inside `<script setup>`:

```js
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
	/* DOM ready */
});
onUnmounted(() => {
	/* cleanup */
});
```

---

## `defineExpose`

Only use when a parent needs to call child methods or read child state via template refs.

```js
defineExpose({
	reset: () => {
		/* ... */
	},
});
```

---

## Pinia Stores (Setup Syntax)

Prefer setup store syntax in Composition API projects. State = `ref()`, getters = `computed()`, actions = plain functions. **Return everything.**

```js
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useItemsStore = defineStore("items", () => {
	const items = ref([]);
	const count = computed(() => items.value.length);

	const add = (item) => {
		items.value.push(item);
	};

	const $reset = () => {
		items.value = [];
	};

	return { items, count, add, $reset };
});
```

### Using Stores in Components

Use `storeToRefs()` when destructuring state and getters to preserve reactivity. Actions can be destructured directly.

```vue
<script setup>
import { storeToRefs } from "pinia";
import { useItemsStore } from "@/stores/items";

const store = useItemsStore();
const { items, count } = storeToRefs(store);
const { add } = store;
</script>
```

---

## Common Pitfalls to Avoid

| Pitfall                                           | Fix                                                                  |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| Forgetting `.value` on refs in script             | Always use `.value` in `<script>`, never in `<template>`             |
| Destructuring store without `storeToRefs`         | Wrap state/getters: `const { x } = storeToRefs(store)`               |
| Array syntax for props (`defineProps(['foo'])`)   | Use object syntax with types                                         |
| Not returning values from setup stores            | Every ref, computed, and function must be in the return object       |
| Missing `$reset` in setup stores                  | Add a manual `$reset` function (only options stores get it for free) |
| Single-word component names                       | Always use multi-word names (`TodoItem`, not `Item`)                 |
| Storing derived data in a ref instead of computed | Use `computed()` for any value derived from other reactive state     |
| Deep-watching large objects unnecessarily         | Watch specific properties via getter: `watch(() => obj.key, ...)`    |
