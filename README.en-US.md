# NiteKit UI

[简体中文](./README.md) | **English**

NiteKit UI is a Vue 3 component library with a glassmorphism visual language, TypeScript declarations, full-package install support, and a bilingual documentation portal.

## Features

- Vue 3 plugin install: `app.use(NiteKit)`
- Named component exports for local registration and tree-shaking friendly usage
- Built-in stylesheet export: `nitekit/style.css`
- TypeScript declaration output
- Bilingual documentation portal for quick start, props, events, slots, methods, and examples

## Installation

```bash
npm install nitekit
```

You also need Vue 3 in your application:

```bash
npm install vue
```

## Quick Start

Register all components in your Vue entry file:

```ts
import { createApp } from 'vue'
import NiteKit from 'nitekit'
import 'nitekit/style.css'
import App from './App.vue'

createApp(App).use(NiteKit).mount('#app')
```

Then use NiteKit components in any Vue component:

```vue
<template>
  <NkCard title="Release Center" subtitle="Vue 3 component library">
    <NkInput v-model="email" label="Email" placeholder="team@example.com" />
    <NkButton type="primary" :loading="saving" @click="save">
      Save changes
    </NkButton>
  </NkCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const saving = ref(false)

function save() {
  saving.value = true
  window.setTimeout(() => {
    saving.value = false
  }, 800)
}
</script>
```

## Named Imports

You can also import components one by one:

```ts
import { NkButton, NkInput, NkCard } from 'nitekit'
import 'nitekit/style.css'
```

## Component Exports

Core single-file components:

- `NkButton`
- `NkCard`
- `NkInput`
- `NkPagination`
- `NkProgress`
- `NkSwitch`
- `NkTable`
- `NkTag`

Extended components:

- `NkAlert`
- `NkAvatar`
- `NkBadge`
- `NkBreadcrumb`
- `NkCheckbox`
- `NkCheckboxGroup`
- `NkDialog`
- `NkDrawer`
- `NkDropdown`
- `NkEmpty`
- `NkForm`
- `NkIcon`
- `NkLayout`
- `NkLink`
- `NkList`
- `NkMenu`
- `NkMessage`
- `NkRadio`
- `NkSelect`
- `NkSkeleton`
- `NkSlider`
- `NkSteps`
- `NkTabs`
- `NkTooltip`
- `NkTree`
- `NkUpload`

## Package Name

The project brand is `NiteKit UI`, and the npm package name is `nitekit`.

## Vibe Coding Statement

This project was created with a Vibe Coding / AI-assisted development workflow. Codex, ChatGPT 5.5, and Tencent Marvis were used during development.

The project is still in an early stage and may contain many issues or incomplete parts. If you encounter any problems, feedback is welcome at:

```text
NighT1me2001@outlook.com
```

## Author Profile

- Gitee: [NightT1me](https://gitee.com/NightT1me)
- GitHub: [NighT1me1003](https://github.com/NighT1me1003)
- Bilibili: [3706941182315084](https://space.bilibili.com/3706941182315084)
- Douyin: @时野 (94269830594)
- Xiaohongshu: @NighT1me (560005426)

## Local Development

```bash
npm install
npm run dev
```

The docs portal runs locally through Vite. The default dev URL is:

```text
http://127.0.0.1:5173/
```

## Build

Build the documentation site:

```bash
npm run build
```

Build the npm library package:

```bash
npm run build:lib
```

## Gitee

Repository:

```text
https://gitee.com/NightT1me/nite-kit-ui.git
```

## GitHub

Repository:

```text
https://github.com/NighT1me1003/nite-kit-ui.git
```

## Contributing and Review

A public repository does not mean everyone can push code directly. Direct push access is limited to maintainers or explicitly authorized collaborators.

If you want to fix an issue or propose an improvement, please fork the repository and submit a Pull Request / Merge Request. All external code changes should be reviewed before they are merged.
