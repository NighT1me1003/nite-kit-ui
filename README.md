# NiteKit UI

**简体中文** | [English](./README.en-US.md)

NiteKit UI 是一个用于 Vue 3 的组件库，提供玻璃拟态风格、TypeScript 类型声明、完整安装入口，以及中英文双语文档门户。

## 特性

- 支持 Vue 3 插件安装：`app.use(NiteKit)`
- 支持按需命名导入，便于局部注册和打包优化
- 内置样式入口：`nitekit/style.css`
- 输出 TypeScript 类型声明
- 提供中英文文档门户，覆盖快速上手、Props、事件、插槽、方法和示例

## 安装

```bash
npm install nitekit
```

你的项目中也需要安装 Vue 3：

```bash
npm install vue
```

## 快速上手

在 Vue 入口文件中注册全部组件：

```ts
import { createApp } from 'vue'
import NiteKit from 'nitekit'
import 'nitekit/style.css'
import App from './App.vue'

createApp(App).use(NiteKit).mount('#app')
```

然后在任意 Vue 组件中使用：

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

## 按需导入

也可以单独导入组件：

```ts
import { NkButton, NkInput, NkCard } from 'nitekit'
import 'nitekit/style.css'
```

## 组件导出

基础单文件组件：

- `NkButton`
- `NkCard`
- `NkInput`
- `NkPagination`
- `NkProgress`
- `NkSwitch`
- `NkTable`
- `NkTag`

扩展组件：

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

## 包名

项目品牌名使用 `NiteKit UI`，npm 包名使用 `nitekit`。

## Vibe Coding 声明

本项目采用 Vibe Coding / AI 辅助开发方式完成，开发过程中使用了 Codex、ChatGPT 5.5 以及腾讯马维斯。

项目仍处于早期阶段，可能还有很多问题或不完善的地方。如果你在使用中遇到问题，欢迎反馈到：

```text
NighT1me2001@outlook.com
```

## 作者资料

- Gitee: [NightT1me](https://gitee.com/NightT1me)
- GitHub: [NighT1me1003](https://github.com/NighT1me1003)
- Bilibili: [3706941182315084](https://space.bilibili.com/3706941182315084)
- 抖音: @时野 (94269830594)
- 小红书: @NighT1me (560005426)

## 本地开发

```bash
npm install
npm run dev
```

文档门户会通过 Vite 在本地启动，默认地址：

```text
http://127.0.0.1:5173/
```

## 构建

构建文档站：

```bash
npm run build
```

构建 npm 组件库产物：

```bash
npm run build:lib
```

## Gitee

仓库地址：

```text
https://gitee.com/NightT1me/nite-kit-ui.git
```

## GitHub

仓库地址：

```text
https://github.com/NighT1me1003/nite-kit-ui.git
```

## 贡献与审查

公开仓库不代表所有人都可以直接推送代码。直接 push 权限仅限维护者或被授权的协作者。

如果你想修复问题或提交改进，请先 fork 仓库，再通过 Pull Request / Merge Request 提交变更。所有外部代码变更都需要经过审查后再合并。
