# NiteKit UI

NiteKit UI is a Vue 3 component library with a glassmorphism visual language, TypeScript declarations, full-package install support, and a bilingual documentation portal.

NiteKit UI 是一个用于 Vue 3 的组件库，提供玻璃拟态风格、TypeScript 类型声明、完整安装入口，以及中英文双语文档门户。

## Features

- Vue 3 plugin install: `app.use(NiteKit)`
- Named component exports for local registration and tree-shaking friendly usage
- Built-in stylesheet export: `nitekit/style.css`
- TypeScript declaration output
- Bilingual documentation portal for quick start, props, events, slots, methods, and examples
- Ready for npm, GitHub, and Gitee publishing

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

The npm package name is `nitekit`.

项目品牌名使用 `NiteKit UI`，npm 包名使用 `nitekit`。

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

Run the full release check before publishing:

```bash
npm run release:check
```

## Publish to npm

Login once on your machine:

```bash
npm login
```

Verify the current account:

```bash
npm whoami
```

Build and inspect the package:

```bash
npm run release:check
```

Publish publicly:

```bash
npm publish --access public
```

After publishing, users can install it with:

```bash
npm install nitekit
```

## Gitee

Initialize Git if needed:

```bash
git init
git add .
git commit -m "chore: initial release"
```

Add the Gitee remote:

```bash
git remote add gitee https://gitee.com/NightT1me/nite-kit-ui.git
```

Push to Gitee:

```bash
git branch -M main
git push -u gitee main
```

## GitHub

If you also create a GitHub repository later, add it as a second remote:

```bash
git remote add github https://github.com/<your-name>/nite-kit-ui.git
git push -u github main
```
