<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowRight,
  BookOpen,
  Check,
  Code,
  Languages,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from '@lucide/vue'
import {
  NkButton,
  NkCard,
  NkAlert,
  NkAvatar,
  NkBadge,
  NkBreadcrumb,
  NkCheckbox,
  NkCheckboxGroup,
  NkDialog,
  NkDrawer,
  NkDropdown,
  NkEmpty,
  NkForm,
  NkIcon,
  NkInput,
  NkLayout,
  NkLink,
  NkList,
  NkMenu,
  NkMessage,
  NkPagination,
  NkProgress,
  NkRadio,
  NkSelect,
  NkSkeleton,
  NkSlider,
  NkSteps,
  NkSwitch,
  NkTable,
  NkTag,
  NkTabs,
  NkTooltip,
  NkTree,
  NkUpload,
} from './components'
import DocsApiTable from './docs/DocsApiTable.vue'
import DocsCodeBlock from './docs/DocsCodeBlock.vue'

type Locale = 'zh' | 'en'
type ComponentStatus = 'ready'
type ComponentId = string

interface ApiRow {
  name: string
  description: string
  type?: string
  default?: string
  required?: boolean
}

interface ApiSections {
  props: ApiRow[]
  events: ApiRow[]
  slots: ApiRow[]
  methods: ApiRow[]
}

interface ComponentDoc {
  id: string
  name: string
  tag: string
  description: string
  codeKey: string
  status: ComponentStatus
}

const locale = ref<Locale>('zh')
const searchQuery = ref('')
const username = ref('marvis_user')
const email = ref('')
const description = ref('NiteKit blends glassmorphism, accessible states, and Vue 3 composition APIs.')
const glassEnabled = ref(true)
const notifications = ref(true)
const autoUpdate = ref(false)
const currentPage = ref(2)
const closableTags = ref(['Vue', 'TypeScript'])
const buttonClicks = ref(0)
const buttonLoading = ref(false)
const selectedStack = ref('vue')
const multiSelectValue = ref(['vue', 'ts'])
const checkedRelease = ref(true)
const partialAccess = ref(false)
const checkboxValues = ref<Array<string | number>>(['release', 'unit'])
const selectedTheme = ref('dark')
const coverage = ref(68)
const dialogOpen = ref(false)
const drawerOpen = ref(false)
const activeTab = ref('overview')
const activeMenu = ref('guide')
const activeStep = ref(1)
const drawerTop = ref(false)
const drawerBottom = ref(false)
const drawerLeft = ref(false)
const drawerRight = ref(false)
const selectedListItem = ref<string | null>(null)
const treeSelectedKey = ref<string | null>(null)

const snippets = {
  install: 'npm install nitekit',
  import: `import { createApp } from 'vue'
import NiteKit from 'nitekit'
import 'nitekit/style.css'
import App from './App.vue'

createApp(App).use(NiteKit).mount('#app')`,
  use: `<template>
  <NkButton variant="primary">Create project</NkButton>
  <NkInput v-model="name" label="Project name" />
</template>`,
  button: `<NkButton variant="primary">
  <template #icon><ArrowRight /></template>
  Get started
</NkButton>`,
  input: `<NkInput v-model="email" label="Email" placeholder="your@email.com" />`,
  tag: `<NkTag variant="success" closable @close="removeTag">Published</NkTag>`,
  switch: `<NkSwitch v-model="enabled" label="Glassmorphism" />`,
  card: `<NkCard title="Uptime SLA" stat="99.99%" accent="pink">
  Zero critical incidents in the past 90 days.
</NkCard>`,
  table: `<NkTable :columns="columns" :rows="rows">
  <template #status="{ value }">
    <NkTag variant="success">{{ value }}</NkTag>
  </template>
</NkTable>`,
  progress: `<NkProgress label="Documentation" :value="62" variant="cyan" />`,
  pagination: `<NkPagination v-model="page" :total="240" :page-size="10" />`,
  caseButtonProps: `<script setup lang="ts">
import { ref } from 'vue'

const clicks = ref(0)
const saving = ref(false)

function save() {
  clicks.value += 1
  saving.value = true
  window.setTimeout(() => {
    saving.value = false
  }, 900)
}
${'</'}script>

<template>
  <NkButton variant="primary" size="lg" :loading="saving" @click="save">
    Save changes {{ clicks }}
  </NkButton>
  <NkButton variant="default">Default</NkButton>
  <NkButton variant="success" size="md">Published</NkButton>
  <NkButton variant="danger" size="sm">Delete</NkButton>
  <NkButton variant="outline">Outline</NkButton>
  <NkButton variant="ghost">Ghost</NkButton>
  <NkButton variant="outline" disabled>Disabled</NkButton>
  <NkButton variant="primary" icon-only aria-label="Quick action">
    <template #icon><Sparkles /></template>
  </NkButton>
</template>`,
  caseInputProps: `<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: 'NiteKit Portal',
  email: '',
  description: 'Reusable glassmorphism Vue 3 components.',
})
${'</'}script>

<template>
  <NkInput v-model="form.name" label="Project" placeholder="Project name" />
  <NkInput v-model="form.email" label="Email" type="email" placeholder="team@nitekit.dev" />
  <NkInput v-model="form.description" label="Description" textarea :rows="4" />
  <NkInput label="Readonly state" disabled model-value="Disabled example" />
</template>`,
  caseTableProps: `<script setup lang="ts">
const columns = [
  { key: 'project', title: 'Project' },
  { key: 'status', title: 'Status' },
  { key: 'progress', title: 'Progress', align: 'right' },
]

const rows = [
  { project: 'Documentation Portal', status: 'Active', progress: '68%' },
  { project: 'Component API', status: 'Review', progress: '42%' },
]
${'</'}script>

<template>
  <NkTable :columns="columns" :rows="rows" empty-text="No projects">
    <template #status="{ value }">
      <NkTag variant="success">{{ value }}</NkTag>
    </template>
  </NkTable>
</template>`,
  caseFeedbackProps: `<script setup lang="ts">
import { ref } from 'vue'

const page = ref(2)
const enabled = ref(true)
${'</'}script>

<template>
  <NkSwitch v-model="enabled" label="Auto publish" />
  <NkProgress label="Documentation" :value="72" variant="cyan" />
  <NkPagination v-model="page" :total="240" :page-size="10" />
</template>`,
  completeDashboard: `<script setup lang="ts">
import { ref } from 'vue'
import { NkButton, NkCard, NkInput, NkPagination, NkProgress, NkSwitch, NkTable, NkTag } from 'nitekit'
import 'nitekit/style.css'

const keyword = ref('')
const autoPublish = ref(true)
const page = ref(1)

const columns = [
  { key: 'name', title: 'Component' },
  { key: 'status', title: 'Status' },
  { key: 'owner', title: 'Owner' },
  { key: 'progress', title: 'Progress', align: 'right' },
]

const rows = [
  { name: 'Button', status: 'Ready', owner: 'Design System', progress: '100%' },
  { name: 'Dialog', status: 'Ready', owner: 'Design System', progress: '100%' },
  { name: 'Form', status: 'Ready', owner: 'Design System', progress: '100%' },
]
${'</'}script>

<template>
  <section class="dashboard">
    <header class="dashboard__toolbar">
      <NkInput v-model="keyword" label="Search" placeholder="Search components" />
      <NkSwitch v-model="autoPublish" label="Auto publish" />
      <NkButton variant="primary">Create release</NkButton>
    </header>

    <div class="dashboard__stats">
      <NkCard title="Ready components" stat="8" accent="green" />
      <NkCard title="Components" stat="33" accent="cyan" />
      <NkCard title="API sections" stat="132" accent="purple" />
    </div>

    <NkProgress label="Documentation completeness" :value="88" variant="cyan" />

    <NkTable :columns="columns" :rows="rows">
      <template #status="{ value }">
        <NkTag :variant="value === 'Ready' ? 'success' : 'info'">{{ value }}</NkTag>
      </template>
    </NkTable>

    <NkPagination v-model="page" :total="80" :page-size="10" />
  </section>
</template>`,
}

const quickStepMeta = {
  install: { filename: 'Terminal', language: 'bash' },
  import: { filename: 'main.ts', language: 'ts' },
  use: { filename: 'App.vue', language: 'vue' },
} as const

const messages = {
  zh: {
    brandCaption: 'Vue 3 组件库',
    nav: {
      quickStart: '快速上手',
      propsCases: 'Props 案例',
      components: '组件',
      showcase: '完整案例',
      design: '设计指南',
      api: '安装 API',
    },
    hero: {
      eyebrow: 'NiteKit Design System',
      title: '面向 Vue 3 的玻璃拟态组件库',
      highlighted: '文档门户',
      description:
        '参考 Ant Design 和 Element Plus 的上手体验，提供安装、全局注册、按需使用和组件示例。当前门户同时支持中文与英文切换。',
      primary: '开始使用',
      secondary: '查看组件',
      installTitle: '安装命令',
      copied: '已复制',
      copy: '复制',
    },
    sidebar: {
      search: '搜索组件',
      guide: '指南',
      componentList: '组件目录',
    },
    codeBlock: {
      copy: '复制',
      copied: '已复制',
      wrap: '自动换行',
      unwrap: '横向滚动',
      expand: '展开完整代码',
      collapse: '收起代码',
    },
    apiTable: {
      props: 'Props 参数',
      events: 'Events 事件',
      slots: 'Slots 插槽',
      methods: 'Methods / Expose 方法',
      name: '名称',
      description: '说明',
      type: '类型',
      default: '默认值',
      required: '必填',
      requiredYes: '是',
      requiredNo: '否',
      empty: '无公开 API',
      title: 'API 扩展',
    },
    quickStart: {
      eyebrow: 'Quick Start',
      title: '组件快速上手',
      description: '按安装、注册、模板使用三步组织，和主流组件库的文档入口保持一致。',
      steps: [
        {
          title: '安装',
          description: '通过 npm 安装组件库包，后续可以继续扩展为独立 npm 发布流程。',
          codeKey: 'install',
        },
        {
          title: '全局注册',
          description: '在 Vue 3 入口中注册 NiteKit，并引入组件样式。',
          codeKey: 'import',
        },
        {
          title: '开始使用',
          description: '在任意 Vue 单文件组件中直接使用 NiteKit 组件。',
          codeKey: 'use',
        },
      ],
    },
    componentsIntro: {
      eyebrow: 'Components',
      title: '组件使用文档',
      description: '每个组件条目都补充真实预览、用途说明、带行号的示例代码和 API 表，目录按成熟组件库的方式分组，并统一标记为已完成。',
      empty: '当前搜索命中了目录项，但还没有对应的完整组件文档。',
      catalogTitle: '分类组件目录',
      catalogDescription: '目录覆盖常见组件库的信息架构，所有条目都会跳转到下方文档，扩展条目均已落地为可导出组件。',
    },
    catalogStatus: {
      ready: '已完成',
    },
    propsCases: {
      eyebrow: 'Props Recipes',
      title: 'Props 参数经典案例',
      description: '把常见 Props 组合做成可复制的预览页：尺寸、状态、受控值、语义色、插槽和数据驱动配置都能直接对照。',
      items: [
        {
          title: '按钮尺寸与语义',
          description: '覆盖 variant、size、disabled、iconOnly 的组合，适合用作操作区规范。',
          codeKey: 'caseButtonProps',
        },
        {
          title: '表单受控输入',
          description: '展示 v-model、label、placeholder、textarea、disabled 与前置图标的典型组合。',
          codeKey: 'caseInputProps',
        },
        {
          title: '数据表格列配置',
          description: '展示 columns、rows、emptyText 和动态列插槽的组合。',
          codeKey: 'caseTableProps',
        },
        {
          title: '反馈与导航状态',
          description: '展示 progress、pagination、switch 的受控状态组合。',
          codeKey: 'caseFeedbackProps',
        },
      ],
    },
    showcase: {
      eyebrow: 'Complete Example',
      title: '完整版业务案例',
      description: '一个文档站首页可以直接使用的控制台案例，组合按钮、输入、标签、开关、卡片、表格、进度和分页，并预留扩展组件的视觉位。',
      codeTitle: 'DashboardExample.vue',
    },
    catalogGroups: [
      {
        title: '基础',
        items: [
          { id: 'button', name: 'Button 按钮', status: 'ready' },
          { id: 'icon', name: 'Icon 图标', status: 'ready' },
          { id: 'layout', name: 'Layout 布局', status: 'ready' },
          { id: 'link', name: 'Link 链接', status: 'ready' },
        ],
      },
      {
        title: '表单',
        items: [
          { id: 'input', name: 'Input 输入框', status: 'ready' },
          { id: 'switch', name: 'Switch 开关', status: 'ready' },
          { id: 'select', name: 'Select 选择器', status: 'ready' },
          { id: 'checkbox', name: 'Checkbox 多选框', status: 'ready' },
          { id: 'radio', name: 'Radio 单选框', status: 'ready' },
          { id: 'slider', name: 'Slider 滑块', status: 'ready' },
          { id: 'upload', name: 'Upload 上传', status: 'ready' },
          { id: 'form', name: 'Form 表单', status: 'ready' },
        ],
      },
      {
        title: '数据展示',
        items: [
          { id: 'tag', name: 'Tag 标签', status: 'ready' },
          { id: 'card', name: 'Card 卡片', status: 'ready' },
          { id: 'table', name: 'Table 表格', status: 'ready' },
          { id: 'badge', name: 'Badge 徽标', status: 'ready' },
          { id: 'avatar', name: 'Avatar 头像', status: 'ready' },
          { id: 'list', name: 'List 列表', status: 'ready' },
          { id: 'tree', name: 'Tree 树形控件', status: 'ready' },
          { id: 'empty', name: 'Empty 空状态', status: 'ready' },
        ],
      },
      {
        title: '导航',
        items: [
          { id: 'pagination', name: 'Pagination 分页', status: 'ready' },
          { id: 'tabs', name: 'Tabs 标签页', status: 'ready' },
          { id: 'breadcrumb', name: 'Breadcrumb 面包屑', status: 'ready' },
          { id: 'dropdown', name: 'Dropdown 下拉菜单', status: 'ready' },
          { id: 'menu', name: 'Menu 导航菜单', status: 'ready' },
          { id: 'steps', name: 'Steps 步骤条', status: 'ready' },
        ],
      },
      {
        title: '反馈',
        items: [
          { id: 'progress', name: 'Progress 进度条', status: 'ready' },
          { id: 'alert', name: 'Alert 提示', status: 'ready' },
          { id: 'dialog', name: 'Dialog 对话框', status: 'ready' },
          { id: 'drawer', name: 'Drawer 抽屉', status: 'ready' },
          { id: 'message', name: 'Message 消息', status: 'ready' },
          { id: 'tooltip', name: 'Tooltip 文字提示', status: 'ready' },
          { id: 'skeleton', name: 'Skeleton 骨架屏', status: 'ready' },
        ],
      },
    ],
    design: {
      eyebrow: 'Design',
      title: '设计指南',
      description: 'NiteKit 保留参考页面中的玻璃拟态质感，同时加入组件库门户所需的导航、搜索、代码示例和状态说明。',
      principles: [
        {
          title: '玻璃质感',
          description: '半透明面板、轻边框和背景模糊让组件保持层次，但不牺牲交互清晰度。',
        },
        {
          title: 'Vue 3 原生',
          description: '组件使用 props、v-model、slots 和 install 插件模式，适合作为库继续扩展。',
        },
        {
          title: '双语门户',
          description: '顶部语言按钮会同步切换导航、上手指南、组件说明和安装 API 内容。',
        },
      ],
    },
    api: {
      eyebrow: 'API',
      title: '安装与导入',
      description: '组件库入口导出默认插件和所有独立组件，可支持全局注册或按需引入。',
      global: '全局注册',
      onDemand: '按需引入',
    },
    footer: 'NITEKIT DESIGN SYSTEM 2026 - GLASSMORPHISM VUE COMPONENTS',
    copiedLabel: '已复制',
    components: [
      {
        id: 'button',
        name: 'Button 按钮',
        tag: 'Action',
        description: '用于提交、跳转和关键操作，支持主要、成功、危险、描边和图标按钮。',
        codeKey: 'button',
      },
      {
        id: 'input',
        name: 'Input 输入框',
        tag: 'Form',
        description: '玻璃拟态输入框，支持 label、placeholder、禁用状态和 textarea。',
        codeKey: 'input',
      },
      {
        id: 'tag',
        name: 'Tag 标签',
        tag: 'Data',
        description: '用于状态、分类和可移除筛选条件，提供多种语义色。',
        codeKey: 'tag',
      },
      {
        id: 'switch',
        name: 'Switch 开关',
        tag: 'Form',
        description: '用于即时开关状态，内置 aria switch 语义和 v-model。',
        codeKey: 'switch',
      },
      {
        id: 'card',
        name: 'Card 卡片',
        tag: 'Display',
        description: '用于指标、摘要和信息区块，可通过 accent 控制顶部强调色。',
        codeKey: 'card',
      },
      {
        id: 'table',
        name: 'Table 表格',
        tag: 'Data',
        description: '用于结构化数据展示，支持列配置和作用域插槽。',
        codeKey: 'table',
      },
      {
        id: 'progress',
        name: 'Progress 进度条',
        tag: 'Feedback',
        description: '用于任务完成度、文档进度和质量指标展示。',
        codeKey: 'progress',
      },
      {
        id: 'pagination',
        name: 'Pagination 分页',
        tag: 'Navigation',
        description: '用于列表翻页，支持 v-model、total 和 pageSize。',
        codeKey: 'pagination',
      },
    ],
  },
  en: {
    brandCaption: 'Vue 3 component library',
    nav: {
      quickStart: 'Quick Start',
      propsCases: 'Props Cases',
      components: 'Components',
      showcase: 'Full Example',
      design: 'Design',
      api: 'API',
    },
    hero: {
      eyebrow: 'NiteKit Design System',
      title: 'A glassmorphism component library for Vue 3',
      highlighted: 'documentation portal',
      description:
        'The quick-start flow follows the clarity of Ant Design and Element Plus: install, register, use, and learn from component examples. The portal switches between Chinese and English.',
      primary: 'Get Started',
      secondary: 'Browse Components',
      installTitle: 'Install command',
      copied: 'Copied',
      copy: 'Copy',
    },
    sidebar: {
      search: 'Search components',
      guide: 'Guide',
      componentList: 'Components',
    },
    codeBlock: {
      copy: 'Copy',
      copied: 'Copied',
      wrap: 'Wrap lines',
      unwrap: 'Scroll lines',
      expand: 'Expand code',
      collapse: 'Collapse code',
    },
    apiTable: {
      props: 'Props',
      events: 'Events',
      slots: 'Slots',
      methods: 'Methods / Expose',
      name: 'Name',
      description: 'Description',
      type: 'Type',
      default: 'Default',
      required: 'Required',
      requiredYes: 'Yes',
      requiredNo: 'No',
      empty: 'No public API',
      title: 'API extensions',
    },
    quickStart: {
      eyebrow: 'Quick Start',
      title: 'Start using components fast',
      description: 'The guide is organized into install, registration, and template usage, matching common component-library documentation patterns.',
      steps: [
        {
          title: 'Install',
          description: 'Install the package with npm. The structure can later be extended into a publishable npm workflow.',
          codeKey: 'install',
        },
        {
          title: 'Register',
          description: 'Register NiteKit in the Vue 3 entry file and import the component styles.',
          codeKey: 'import',
        },
        {
          title: 'Use',
          description: 'Use NiteKit components directly inside Vue single-file components.',
          codeKey: 'use',
        },
      ],
    },
    componentsIntro: {
      eyebrow: 'Components',
      title: 'Component usage docs',
      description: 'Every component entry includes a live preview, usage notes, line-numbered examples, and API tables. The catalog is grouped like mature component libraries and marks every entry as ready.',
      empty: 'The search matched catalog items, but no complete component document exists yet.',
      catalogTitle: 'Grouped component catalog',
      catalogDescription: 'The catalog now mirrors common library information architecture. Every item jumps to complete docs below, and extension entries are implemented as exportable components.',
    },
    catalogStatus: {
      ready: 'Ready',
    },
    propsCases: {
      eyebrow: 'Props Recipes',
      title: 'Classic props preview cases',
      description: 'Common prop combinations are rendered as preview cases: size, state, controlled value, semantic color, slots, and data-driven configuration.',
      items: [
        {
          title: 'Button size and semantics',
          description: 'Covers variant, size, disabled, and iconOnly combinations for action areas.',
          codeKey: 'caseButtonProps',
        },
        {
          title: 'Controlled form input',
          description: 'Shows v-model, label, placeholder, textarea, disabled, and leading icon combinations.',
          codeKey: 'caseInputProps',
        },
        {
          title: 'Table column configuration',
          description: 'Shows columns, rows, emptyText, and dynamic column slots together.',
          codeKey: 'caseTableProps',
        },
        {
          title: 'Feedback and navigation state',
          description: 'Shows controlled progress, pagination, and switch patterns.',
          codeKey: 'caseFeedbackProps',
        },
      ],
    },
    showcase: {
      eyebrow: 'Complete Example',
      title: 'Full business example',
      description: 'A dashboard case ready for a documentation homepage, combining buttons, inputs, tags, switches, cards, tables, progress, pagination, and visual placeholders for roadmap components.',
      codeTitle: 'DashboardExample.vue',
    },
    catalogGroups: [
      {
        title: 'Basic',
        items: [
          { id: 'button', name: 'Button', status: 'ready' },
          { id: 'icon', name: 'Icon', status: 'ready' },
          { id: 'layout', name: 'Layout', status: 'ready' },
          { id: 'link', name: 'Link', status: 'ready' },
        ],
      },
      {
        title: 'Form',
        items: [
          { id: 'input', name: 'Input', status: 'ready' },
          { id: 'switch', name: 'Switch', status: 'ready' },
          { id: 'select', name: 'Select', status: 'ready' },
          { id: 'checkbox', name: 'Checkbox', status: 'ready' },
          { id: 'radio', name: 'Radio', status: 'ready' },
          { id: 'slider', name: 'Slider', status: 'ready' },
          { id: 'upload', name: 'Upload', status: 'ready' },
          { id: 'form', name: 'Form', status: 'ready' },
        ],
      },
      {
        title: 'Data Display',
        items: [
          { id: 'tag', name: 'Tag', status: 'ready' },
          { id: 'card', name: 'Card', status: 'ready' },
          { id: 'table', name: 'Table', status: 'ready' },
          { id: 'badge', name: 'Badge', status: 'ready' },
          { id: 'avatar', name: 'Avatar', status: 'ready' },
          { id: 'list', name: 'List', status: 'ready' },
          { id: 'tree', name: 'Tree', status: 'ready' },
          { id: 'empty', name: 'Empty', status: 'ready' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { id: 'pagination', name: 'Pagination', status: 'ready' },
          { id: 'tabs', name: 'Tabs', status: 'ready' },
          { id: 'breadcrumb', name: 'Breadcrumb', status: 'ready' },
          { id: 'dropdown', name: 'Dropdown', status: 'ready' },
          { id: 'menu', name: 'Menu', status: 'ready' },
          { id: 'steps', name: 'Steps', status: 'ready' },
        ],
      },
      {
        title: 'Feedback',
        items: [
          { id: 'progress', name: 'Progress', status: 'ready' },
          { id: 'alert', name: 'Alert', status: 'ready' },
          { id: 'dialog', name: 'Dialog', status: 'ready' },
          { id: 'drawer', name: 'Drawer', status: 'ready' },
          { id: 'message', name: 'Message', status: 'ready' },
          { id: 'tooltip', name: 'Tooltip', status: 'ready' },
          { id: 'skeleton', name: 'Skeleton', status: 'ready' },
        ],
      },
    ],
    design: {
      eyebrow: 'Design',
      title: 'Design guide',
      description: 'NiteKit keeps the glassmorphism feel from the reference while adding the navigation, search, code examples, and status details needed by a component-library portal.',
      principles: [
        {
          title: 'Glass surface',
          description: 'Translucent panels, soft borders, and background blur preserve depth without reducing interaction clarity.',
        },
        {
          title: 'Native Vue 3',
          description: 'Components use props, v-model, slots, and an install plugin so the library can keep growing.',
        },
        {
          title: 'Bilingual portal',
          description: 'The language switch updates navigation, quick-start content, component notes, and API examples.',
        },
      ],
    },
    api: {
      eyebrow: 'API',
      title: 'Install and import',
      description: 'The library entry exports the default plugin and every individual component for global registration or on-demand usage.',
      global: 'Global registration',
      onDemand: 'On-demand import',
    },
    footer: 'NITEKIT DESIGN SYSTEM 2026 - GLASSMORPHISM VUE COMPONENTS',
    copiedLabel: 'Copied',
    components: [
      {
        id: 'button',
        name: 'Button',
        tag: 'Action',
        description: 'For submission, navigation, and key actions. Supports primary, success, danger, outline, and icon buttons.',
        codeKey: 'button',
      },
      {
        id: 'input',
        name: 'Input',
        tag: 'Form',
        description: 'A glass input for labels, placeholders, disabled states, and textarea usage.',
        codeKey: 'input',
      },
      {
        id: 'tag',
        name: 'Tag',
        tag: 'Data',
        description: 'For status, categories, and removable filters with semantic color variants.',
        codeKey: 'tag',
      },
      {
        id: 'switch',
        name: 'Switch',
        tag: 'Form',
        description: 'For immediate toggles with aria switch semantics and v-model support.',
        codeKey: 'switch',
      },
      {
        id: 'card',
        name: 'Card',
        tag: 'Display',
        description: 'For metrics, summaries, and content blocks with accent-controlled top highlights.',
        codeKey: 'card',
      },
      {
        id: 'table',
        name: 'Table',
        tag: 'Data',
        description: 'For structured data display with column configuration and scoped slots.',
        codeKey: 'table',
      },
      {
        id: 'progress',
        name: 'Progress',
        tag: 'Feedback',
        description: 'For task completion, documentation progress, and quality metrics.',
        codeKey: 'progress',
      },
      {
        id: 'pagination',
        name: 'Pagination',
        tag: 'Navigation',
        description: 'For paged lists with v-model, total, and pageSize.',
        codeKey: 'pagination',
      },
    ],
  },
} as const

const componentApiDocs: Record<Locale, Record<string, ApiSections | undefined>> = {
  zh: {
    button: {
      props: [
        { name: 'variant', description: '按钮语义和视觉层级。', type: "'default' | 'primary' | 'success' | 'danger' | 'outline' | 'ghost'", default: "'default'" },
        { name: 'size', description: '按钮尺寸。', type: "'sm' | 'md' | 'lg'", default: "'md'" },
        { name: 'iconOnly', description: '是否作为纯图标按钮渲染，启用后保持正方形按钮尺寸。', type: 'boolean', default: 'false' },
        { name: 'disabled', description: '是否禁用按钮。', type: 'boolean', default: 'false' },
        { name: 'loading', description: '是否显示加载态；加载时按钮会禁用并展示旋转指示。', type: 'boolean', default: 'false' },
        { name: 'type', description: '原生 button type。', type: "'button' | 'submit' | 'reset'", default: "'button'" },
      ],
      events: [
        { name: 'click', description: '原生点击事件，可通过组件监听透传到 button 根节点。', type: '(event: MouseEvent) => void' },
      ],
      slots: [
        { name: 'default', description: '按钮文本或任意内联内容。' },
        { name: 'icon', description: '按钮左侧图标。' },
      ],
      methods: [
        { name: 'focus()', description: '聚焦按钮。', type: '() => void' },
        { name: 'blur()', description: '移除按钮焦点。', type: '() => void' },
      ],
    },
    input: {
      props: [
        { name: 'modelValue', description: '输入框当前值，支持 v-model。', type: 'string', default: "''" },
        { name: 'id', description: '输入控件 id；不传时自动生成。', type: 'string', default: "''" },
        { name: 'label', description: '字段标签文本。', type: 'string', default: "''" },
        { name: 'placeholder', description: '占位提示文本。', type: 'string', default: "''" },
        { name: 'type', description: '原生 input type，仅在非 textarea 模式生效。', type: 'string', default: "'text'" },
        { name: 'textarea', description: '是否渲染为 textarea。', type: 'boolean', default: 'false' },
        { name: 'rows', description: 'textarea 行数。', type: 'number', default: '4' },
        { name: 'disabled', description: '是否禁用输入。', type: 'boolean', default: 'false' },
      ],
      events: [
        { name: 'update:modelValue', description: '输入值变化时触发。', type: '(value: string) => void' },
      ],
      slots: [
        { name: 'icon', description: '输入框前置图标，仅非 textarea 模式显示。' },
      ],
      methods: [
        { name: 'focus()', description: '聚焦输入控件。', type: '() => void' },
        { name: 'blur()', description: '移除输入控件焦点。', type: '() => void' },
        { name: 'select()', description: '选中输入控件中的文本。', type: '() => void' },
      ],
    },
    tag: {
      props: [
        { name: 'variant', description: '标签语义色。', type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'", default: "'default'" },
        { name: 'closable', description: '是否显示关闭按钮。', type: 'boolean', default: 'false' },
      ],
      events: [
        { name: 'close', description: '点击关闭按钮时触发。', type: '() => void' },
      ],
      slots: [
        { name: 'default', description: '标签内容。' },
      ],
      methods: [],
    },
    switch: {
      props: [
        { name: 'modelValue', description: '开关当前状态，支持 v-model。', type: 'boolean', default: 'false' },
        { name: 'label', description: '开关右侧标签文本。', type: 'string', default: "''" },
        { name: 'disabled', description: '是否禁用开关。', type: 'boolean', default: 'false' },
      ],
      events: [
        { name: 'update:modelValue', description: '开关状态变化时触发。', type: '(value: boolean) => void' },
      ],
      slots: [],
      methods: [
        { name: 'toggle()', description: '切换开关状态；禁用时不会触发更新。', type: '() => void' },
        { name: 'focus()', description: '聚焦开关按钮。', type: '() => void' },
        { name: 'blur()', description: '移除开关焦点。', type: '() => void' },
      ],
    },
    card: {
      props: [
        { name: 'title', description: '卡片标题。', type: 'string', default: "''" },
        { name: 'description', description: '卡片描述文本。', type: 'string', default: "''" },
        { name: 'stat', description: '指标型卡片的突出数值。', type: 'string', default: "''" },
        { name: 'accent', description: '顶部强调色。', type: "'purple' | 'cyan' | 'pink' | 'green' | 'amber'", default: "'purple'" },
      ],
      events: [],
      slots: [
        { name: 'default', description: '卡片正文内容。' },
        { name: 'icon', description: '卡片图标区域。' },
      ],
      methods: [],
    },
    table: {
      props: [
        { name: 'columns', description: '列配置，包含 key、title、width、align。', type: 'NkTableColumn[]', required: true },
        { name: 'rows', description: '表格数据行。', type: 'Record<string, unknown>[]', required: true },
        { name: 'emptyText', description: '空数据提示文本。', type: 'string', default: "'No data'" },
      ],
      events: [],
      slots: [
        { name: '[column.key]', description: '动态列插槽，参数为 { row, value }。', type: '{ row: Record<string, unknown>; value: unknown }' },
      ],
      methods: [],
    },
    progress: {
      props: [
        { name: 'value', description: '进度值，内部会限制在 0 到 100。', type: 'number', required: true },
        { name: 'label', description: '进度标题。', type: 'string', default: "''" },
        { name: 'variant', description: '进度条色彩。', type: "'purple' | 'cyan' | 'pink' | 'green'", default: "'purple'" },
      ],
      events: [],
      slots: [],
      methods: [],
    },
    pagination: {
      props: [
        { name: 'modelValue', description: '当前页码，支持 v-model。', type: 'number', default: '1' },
        { name: 'total', description: '总条目数。', type: 'number', required: true },
        { name: 'pageSize', description: '每页条目数。', type: 'number', default: '10' },
      ],
      events: [
        { name: 'update:modelValue', description: '页码变化时触发。', type: '(page: number) => void' },
      ],
      slots: [],
      methods: [
        { name: 'goTo(page)', description: '跳转到指定页码，越界页码会被忽略。', type: '(page: number) => void' },
      ],
    },
  },
  en: {
    button: {
      props: [
        { name: 'variant', description: 'Button semantic style and visual hierarchy.', type: "'default' | 'primary' | 'success' | 'danger' | 'outline' | 'ghost'", default: "'default'" },
        { name: 'size', description: 'Button size.', type: "'sm' | 'md' | 'lg'", default: "'md'" },
        { name: 'iconOnly', description: 'Render as a square icon button.', type: 'boolean', default: 'false' },
        { name: 'disabled', description: 'Disable the button.', type: 'boolean', default: 'false' },
        { name: 'loading', description: 'Show a loading state; the button is disabled and renders a spinner.', type: 'boolean', default: 'false' },
        { name: 'type', description: 'Native button type.', type: "'button' | 'submit' | 'reset'", default: "'button'" },
      ],
      events: [
        { name: 'click', description: 'Native click event forwarded to the button root.', type: '(event: MouseEvent) => void' },
      ],
      slots: [
        { name: 'default', description: 'Button label or inline content.' },
        { name: 'icon', description: 'Leading button icon.' },
      ],
      methods: [
        { name: 'focus()', description: 'Focus the button.', type: '() => void' },
        { name: 'blur()', description: 'Remove focus from the button.', type: '() => void' },
      ],
    },
    input: {
      props: [
        { name: 'modelValue', description: 'Current input value, supports v-model.', type: 'string', default: "''" },
        { name: 'id', description: 'Input control id; generated automatically when omitted.', type: 'string', default: "''" },
        { name: 'label', description: 'Field label text.', type: 'string', default: "''" },
        { name: 'placeholder', description: 'Placeholder text.', type: 'string', default: "''" },
        { name: 'type', description: 'Native input type for non-textarea mode.', type: 'string', default: "'text'" },
        { name: 'textarea', description: 'Render as textarea.', type: 'boolean', default: 'false' },
        { name: 'rows', description: 'Textarea row count.', type: 'number', default: '4' },
        { name: 'disabled', description: 'Disable input.', type: 'boolean', default: 'false' },
      ],
      events: [
        { name: 'update:modelValue', description: 'Emitted when the value changes.', type: '(value: string) => void' },
      ],
      slots: [
        { name: 'icon', description: 'Leading icon, shown only in non-textarea mode.' },
      ],
      methods: [
        { name: 'focus()', description: 'Focus the input control.', type: '() => void' },
        { name: 'blur()', description: 'Remove focus from the input control.', type: '() => void' },
        { name: 'select()', description: 'Select the text in the input control.', type: '() => void' },
      ],
    },
    tag: {
      props: [
        { name: 'variant', description: 'Semantic tag color.', type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'", default: "'default'" },
        { name: 'closable', description: 'Show a close button.', type: 'boolean', default: 'false' },
      ],
      events: [
        { name: 'close', description: 'Emitted when the close button is clicked.', type: '() => void' },
      ],
      slots: [
        { name: 'default', description: 'Tag content.' },
      ],
      methods: [],
    },
    switch: {
      props: [
        { name: 'modelValue', description: 'Current switch state, supports v-model.', type: 'boolean', default: 'false' },
        { name: 'label', description: 'Label text on the right side.', type: 'string', default: "''" },
        { name: 'disabled', description: 'Disable the switch.', type: 'boolean', default: 'false' },
      ],
      events: [
        { name: 'update:modelValue', description: 'Emitted when the switch state changes.', type: '(value: boolean) => void' },
      ],
      slots: [],
      methods: [
        { name: 'toggle()', description: 'Toggle the switch state; ignored when disabled.', type: '() => void' },
        { name: 'focus()', description: 'Focus the switch button.', type: '() => void' },
        { name: 'blur()', description: 'Remove focus from the switch.', type: '() => void' },
      ],
    },
    card: {
      props: [
        { name: 'title', description: 'Card title.', type: 'string', default: "''" },
        { name: 'description', description: 'Card description text.', type: 'string', default: "''" },
        { name: 'stat', description: 'Highlighted metric value.', type: 'string', default: "''" },
        { name: 'accent', description: 'Top accent color.', type: "'purple' | 'cyan' | 'pink' | 'green' | 'amber'", default: "'purple'" },
      ],
      events: [],
      slots: [
        { name: 'default', description: 'Card body content.' },
        { name: 'icon', description: 'Card icon area.' },
      ],
      methods: [],
    },
    table: {
      props: [
        { name: 'columns', description: 'Column definitions with key, title, width, and align.', type: 'NkTableColumn[]', required: true },
        { name: 'rows', description: 'Table row data.', type: 'Record<string, unknown>[]', required: true },
        { name: 'emptyText', description: 'Empty-state text.', type: 'string', default: "'No data'" },
      ],
      events: [],
      slots: [
        { name: '[column.key]', description: 'Dynamic column slot with { row, value }.', type: '{ row: Record<string, unknown>; value: unknown }' },
      ],
      methods: [],
    },
    progress: {
      props: [
        { name: 'value', description: 'Progress value, clamped internally from 0 to 100.', type: 'number', required: true },
        { name: 'label', description: 'Progress label.', type: 'string', default: "''" },
        { name: 'variant', description: 'Progress color.', type: "'purple' | 'cyan' | 'pink' | 'green'", default: "'purple'" },
      ],
      events: [],
      slots: [],
      methods: [],
    },
    pagination: {
      props: [
        { name: 'modelValue', description: 'Current page, supports v-model.', type: 'number', default: '1' },
        { name: 'total', description: 'Total item count.', type: 'number', required: true },
        { name: 'pageSize', description: 'Items per page.', type: 'number', default: '10' },
      ],
      events: [
        { name: 'update:modelValue', description: 'Emitted when the page changes.', type: '(page: number) => void' },
      ],
      slots: [],
      methods: [
        { name: 'goTo(page)', description: 'Jump to a page; out-of-range pages are ignored.', type: '(page: number) => void' },
      ],
    },
  },
}

const content = computed(() => messages[locale.value])

const casePropNames: Record<string, string[]> = {
  icon: ['name', 'size', 'color', 'strokeWidth'],
  layout: ['columns', 'gap', 'responsive', 'align'],
  link: ['href', 'target', 'disabled', 'underline'],
  select: ['modelValue', 'options', 'placeholder', 'multiple', 'clearable', 'disabled'],
  checkbox: ['modelValue', 'label', 'indeterminate', 'options', 'direction', 'disabled'],
  radio: ['modelValue', 'options', 'button', 'disabled'],
  slider: ['modelValue', 'min', 'max', 'step', 'marks', 'disabled'],
  upload: ['action', 'accept', 'multiple', 'limit', 'disabled'],
  form: ['model', 'rules', 'labelWidth', 'layout', 'disabled'],
  badge: ['value', 'max', 'dot', 'type', 'offset'],
  avatar: ['src', 'size', 'shape', 'alt', 'fallback'],
  list: ['dataSource', 'bordered', 'split', 'loading'],
  tree: ['data', 'checkedKeys', 'expandedKeys', 'checkable', 'draggable'],
  empty: ['description', 'image', 'imageSize'],
  tabs: ['modelValue', 'items', 'type', 'closable'],
  breadcrumb: ['items', 'separator'],
  dropdown: ['options', 'trigger', 'placement', 'disabled'],
  menu: ['modelValue', 'items', 'mode', 'collapsed'],
  steps: ['current', 'items', 'direction', 'status'],
  alert: ['type', 'title', 'description', 'closable', 'showIcon'],
  dialog: ['open', 'title', 'width', 'closeOnOverlay', 'footer'],
  drawer: ['open', 'title', 'placement', 'size'],
  message: ['type', 'content', 'duration', 'closable'],
  tooltip: ['content', 'placement', 'trigger', 'disabled'],
  skeleton: ['loading', 'rows', 'animated', 'avatar'],
}

const caseEventNames: Record<string, string[]> = {
  select: ['update:modelValue', 'change', 'clear'],
  checkbox: ['update:modelValue', 'change'],
  radio: ['update:modelValue', 'change'],
  slider: ['update:modelValue', 'change'],
  upload: ['change', 'remove', 'exceed'],
  form: ['validate', 'submit', 'reset'],
  tabs: ['update:modelValue', 'change', 'close'],
  dropdown: ['select', 'visibleChange'],
  menu: ['update:modelValue', 'select'],
  steps: ['change'],
  alert: ['close'],
  dialog: ['update:open', 'confirm', 'cancel'],
  drawer: ['update:open', 'close'],
  message: ['close'],
  tree: ['check', 'expand', 'select'],
}

const caseSlotNames: Record<string, string[]> = {
  icon: ['default'],
  layout: ['default'],
  link: ['default', 'icon'],
  select: ['option', 'prefix', 'empty'],
  checkbox: ['default'],
  radio: ['default'],
  upload: ['trigger', 'tip', 'file'],
  form: ['default', 'footer'],
  badge: ['default'],
  avatar: ['fallback'],
  list: ['item', 'header', 'footer'],
  tree: ['title'],
  empty: ['default', 'image'],
  tabs: ['tab', 'panel'],
  breadcrumb: ['item', 'separator'],
  dropdown: ['default', 'overlay'],
  menu: ['item', 'icon'],
  steps: ['icon', 'description'],
  alert: ['title', 'description', 'icon'],
  dialog: ['default', 'footer'],
  drawer: ['default', 'footer'],
  tooltip: ['default', 'content'],
  skeleton: ['template'],
}

const caseMethodNames: Record<string, string[]> = {
  select: ['focus()', 'blur()', 'clear()'],
  upload: ['submit()', 'clearFiles()'],
  form: ['validate()', 'resetFields()', 'clearValidate()'],
  tabs: ['activate(name)'],
  menu: ['open(key)', 'close(key)'],
  steps: ['next()', 'prev()'],
  dialog: ['open()', 'close()'],
  drawer: ['open()', 'close()'],
  message: ['close()'],
  tree: ['setCheckedKeys(keys)', 'getCheckedKeys()'],
}

const componentSnippetOverrides: Record<string, string> = {
  icon: `<template>
  <NkIcon name="sparkles" :size="20" color="#a78bfa" />
  <NkIcon name="shield-check" :size="24" color="#34d399" />
</template>`,
  layout: `<template>
  <NkLayout :columns="3" gap="16px" responsive>
    <section>Aside</section>
    <section>Main</section>
    <section>Tools</section>
  </NkLayout>
</template>`,
  link: `<template>
  <NkLink href="/docs" underline>
    Documentation
  </NkLink>
</template>`,
  select: `<script setup lang="ts">
import { ref } from 'vue'

const value = ref('vue')
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'TypeScript', value: 'ts' },
]
${'</'}script>

<template>
  <NkSelect v-model="value" :options="options" clearable placeholder="Select stack" />
</template>`,
  checkbox: `<script setup lang="ts">
import { computed, ref } from 'vue'

const checked = ref(['release', 'unit'])
const options = [
  { label: 'Release checks', value: 'release' },
  { label: 'Unit tests', value: 'unit' },
  { label: 'Visual review', value: 'visual' },
  { label: 'Security audit', value: 'security', disabled: true },
]

const enabledValues = options.filter((option) => !option.disabled).map((option) => option.value)
const allChecked = computed(() => enabledValues.every((value) => checked.value.includes(value)))
const indeterminate = computed(() => checked.value.length > 0 && !allChecked.value)

function toggleAll(value: boolean) {
  checked.value = value ? [...enabledValues] : []
}
${'</'}script>

<template>
  <NkCheckbox
    :model-value="allChecked"
    :indeterminate="indeterminate"
    label="Check all"
    @change="toggleAll"
  />
  <NkCheckboxGroup v-model="checked" :options="options" />
</template>`,
  radio: `<template>
  <NkRadio v-model="theme" :options="themes" button />
</template>`,
  slider: `<template>
  <NkSlider v-model="coverage" :min="0" :max="100" :step="5" />
</template>`,
  upload: `<template>
  <NkUpload action="/api/upload" accept=".png,.jpg" :limit="3">
    <template #trigger>
      <NkButton variant="primary">Upload assets</NkButton>
    </template>
  </NkUpload>
</template>`,
  form: `<template>
  <NkForm :model="form" :rules="rules" label-width="120px">
    <NkInput v-model="form.name" label="Project" />
    <NkSelect v-model="form.owner" :options="owners" />
  </NkForm>
</template>`,
  badge: `<template>
  <NkBadge :value="12" type="danger">
    <NkButton variant="outline">Notifications</NkButton>
  </NkBadge>
</template>`,
  avatar: `<template>
  <NkAvatar src="/team/alex.png" size="lg" fallback="AC" />
</template>`,
  list: `<template>
  <NkList :data-source="tasks" bordered>
    <template #item="{ item }">{{ item.title }}</template>
  </NkList>
</template>`,
  tree: `<template>
  <NkTree :data="nodes" checkable draggable />
</template>`,
  empty: `<template>
  <NkEmpty description="No components matched">
    <NkButton variant="primary">Create component</NkButton>
  </NkEmpty>
</template>`,
  tabs: `<template>
  <NkTabs v-model="active" :items="tabs" type="card" />
</template>`,
  breadcrumb: `<template>
  <NkBreadcrumb :items="breadcrumbs" separator="/" />
</template>`,
  dropdown: `<template>
  <NkDropdown :options="actions" trigger="click" @select="runAction">
    <NkButton variant="outline">Actions</NkButton>
  </NkDropdown>
</template>`,
  menu: `<template>
  <NkMenu v-model="active" :items="menus" mode="vertical" />
</template>`,
  steps: `<template>
  <NkSteps :current="2" :items="releaseSteps" status="process" />
</template>`,
  alert: `<template>
  <NkAlert type="success" title="Release ready" show-icon closable />
</template>`,
  dialog: `<template>
  <NkDialog v-model:open="open" title="Publish release" width="520px">
    Confirm publishing NiteKit v0.1?
  </NkDialog>
</template>`,
  drawer: `<template>
  <NkDrawer v-model:open="open" title="Component settings" placement="right" />
</template>`,
  message: `<script setup lang="ts">
import { NkMessage } from 'nitekit'

function publish() {
  NkMessage.success('Release published')
}
${'</'}script>`,
  tooltip: `<template>
  <NkTooltip content="Copy component import path" placement="top">
    <NkButton variant="ghost">Hover me</NkButton>
  </NkTooltip>
</template>`,
  skeleton: `<template>
  <NkSkeleton loading animated avatar :rows="3" />
</template>`,
}

const propDescriptions = {
  zh: {
    modelValue: '当前受控值，支持 v-model。',
    options: '选项数据源。',
    disabled: '是否禁用组件。',
    placeholder: '占位提示。',
    open: '是否打开浮层。',
    title: '标题文本。',
    type: '语义类型。',
    items: '项目配置数组。',
    data: '树或列表数据。',
    loading: '是否显示加载态。',
  },
  en: {
    modelValue: 'Current controlled value, supports v-model.',
    options: 'Option data source.',
    disabled: 'Disable the component.',
    placeholder: 'Placeholder text.',
    open: 'Whether the overlay is open.',
    title: 'Title text.',
    type: 'Semantic type.',
    items: 'Item configuration array.',
    data: 'Tree or list data.',
    loading: 'Whether to show loading state.',
  },
} as const

function docSnippet(key: string) {
  if (key in snippets) {
    return snippets[key as keyof typeof snippets]
  }

  return componentSnippetOverrides[key] ?? `<template>
  <Nk${pascalCase(key)} />
</template>`
}

function pascalCase(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function generatedDescription(name: string, group: string) {
  if (locale.value === 'zh') {
    return `${name} 已落地为 NiteKit 组件，文档包含典型 Props、事件、插槽和方法说明。`
  }

  return `${name} is available as a NiteKit component with typical props, events, slots, and methods documented.`
}

function generatedApiDocs(id: string): ApiSections {
  const props = (casePropNames[id] ?? ['disabled']).map((name) => ({
    name,
    description:
      propDescriptions[locale.value][name as keyof (typeof propDescriptions)['zh']] ??
      (locale.value === 'zh' ? `${name} 参数配置。` : `${name} prop configuration.`),
    type: propType(name),
    default: propDefault(name),
    required: ['columns', 'rows', 'dataSource', 'action', 'model', 'data', 'items'].includes(name),
  }))

  const events = (caseEventNames[id] ?? []).map((name) => ({
    name,
    description: locale.value === 'zh' ? `${name} 交互时触发。` : `Emitted on ${name} interaction.`,
    type: eventType(name),
  }))

  const slots = (caseSlotNames[id] ?? ['default']).map((name) => ({
    name,
    description: locale.value === 'zh' ? `${name} 插槽内容。` : `${name} slot content.`,
  }))

  const methods = (caseMethodNames[id] ?? []).map((name) => ({
    name,
    description: locale.value === 'zh' ? `${name} 实例方法。` : `${name} instance method.`,
    type: methodType(name),
  }))

  return { props, events, slots, methods }
}

function propType(name: string) {
  if (['disabled', 'clearable', 'multiple', 'responsive', 'closable', 'showIcon', 'dot', 'loading', 'animated', 'avatar', 'checkable', 'draggable', 'indeterminate', 'underline'].includes(name)) {
    return 'boolean'
  }

  if (['size', 'rows', 'max', 'min', 'step', 'limit', 'current', 'imageSize', 'duration'].includes(name)) {
    return 'number | string'
  }

  if (['options', 'items', 'columns', 'rows', 'dataSource', 'data', 'rules', 'marks'].includes(name)) {
    return 'Array | Record'
  }

  return 'string'
}

function propDefault(name: string) {
  if (['disabled', 'clearable', 'multiple', 'responsive', 'closable', 'showIcon', 'dot', 'loading', 'animated', 'avatar', 'checkable', 'draggable', 'indeterminate', 'underline'].includes(name)) {
    return 'false'
  }

  if (name === 'placement') {
    return "'top'"
  }

  if (name === 'trigger') {
    return "'hover'"
  }

  return '-'
}

function eventType(name: string) {
  if (name.startsWith('update:')) {
    return '(value: unknown) => void'
  }

  return '(payload: unknown) => void'
}

function methodType(name: string) {
  return name.includes('(') ? '(...args: unknown[]) => void' : '() => void'
}

function previewItems(id: string) {
  const common = {
    icon: ['Sparkles', 'Shield', 'Zap'],
    layout: ['Aside', 'Main content', 'Tools'],
    link: ['Documentation', 'API Reference', 'Changelog'],
    select: ['Vue', 'TypeScript', 'Vite'],
    checkbox: ['Release checks', 'Unit tests', 'Visual review'],
    radio: ['Light', 'Dark', 'System'],
    slider: ['0', '50', '100'],
    upload: ['hero.png', 'tokens.json', 'icons.svg'],
    form: ['Project name', 'Owner', 'Rules'],
    badge: ['12', '99+', 'dot'],
    avatar: ['AC', 'LW', 'TZ'],
    list: ['Review API docs', 'Ship preview', 'Publish package'],
    tree: ['Components', 'Forms', 'Feedback'],
    empty: ['No results', 'Create first item'],
    tabs: ['Overview', 'Props', 'Examples'],
    breadcrumb: ['Home', 'Components', pascalCase(id)],
    dropdown: ['Edit', 'Duplicate', 'Archive'],
    menu: ['Guide', 'Components', 'Resources'],
    steps: ['Install', 'Configure', 'Publish'],
    alert: ['Success', 'Warning', 'Error'],
    dialog: ['Title', 'Content', 'Footer actions'],
    drawer: ['Settings', 'Tokens', 'Preview'],
    message: ['Saved', 'Synced', 'Published'],
    tooltip: ['Hover target', 'Tooltip content'],
    skeleton: ['Header', 'Paragraph', 'Avatar'],
  }

  return common[id as keyof typeof common] ?? [pascalCase(id), 'Props', 'Preview']
}

const allComponentDocs = computed<ComponentDoc[]>(() => {
  const readyMap = new Map<string, (typeof content.value.components)[number]>(
    content.value.components.map((component) => [component.id, component]),
  )

  return content.value.catalogGroups.flatMap((group) =>
    group.items.map((item) => {
      const ready = readyMap.get(item.id)

      return {
        id: item.id,
        name: item.name,
        tag: ready?.tag ?? group.title,
        description: ready?.description ?? generatedDescription(item.name, group.title),
        codeKey: ready?.codeKey ?? item.id,
        status: item.status,
      }
    }),
  )
})

const filteredComponents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return allComponentDocs.value
  }

  return allComponentDocs.value.filter((component) => {
    const haystack = `${component.name} ${component.tag} ${component.description} ${component.status}`.toLowerCase()
    return haystack.includes(query)
  })
})

const filteredCatalogGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return content.value.catalogGroups
    .map((group) => ({
      ...group,
      items: query
        ? group.items.filter((item) => `${group.title} ${item.name} ${item.status}`.toLowerCase().includes(query))
        : group.items,
    }))
    .filter((group) => group.items.length > 0)
})

function catalogHref(item: { id: string; status: ComponentStatus }) {
  return `#${item.id}`
}

function statusVariant(status: ComponentStatus) {
  return status === 'ready' ? 'success' : 'info'
}

function componentApiSections(id: string) {
  const labels = content.value.apiTable
  const docs = componentApiDocs[locale.value][id] ?? generatedApiDocs(id)

  return [
    { title: labels.props, rows: docs.props },
    { title: labels.events, rows: docs.events },
    { title: labels.slots, rows: docs.slots },
    { title: labels.methods, rows: docs.methods },
  ]
}

const tableColumns = computed(() => [
  { key: 'project', title: locale.value === 'zh' ? '项目' : 'Project' },
  { key: 'status', title: locale.value === 'zh' ? '状态' : 'Status' },
  { key: 'owner', title: locale.value === 'zh' ? '负责人' : 'Owner' },
  { key: 'progress', title: locale.value === 'zh' ? '进度' : 'Progress', align: 'right' as const },
])

const tableRows = computed(() => [
  {
    project: 'NiteKit v0.1',
    status: locale.value === 'zh' ? '进行中' : 'Active',
    owner: 'Alex Chen',
    progress: '68%',
  },
  {
    project: locale.value === 'zh' ? '文档门户' : 'Documentation portal',
    status: locale.value === 'zh' ? '进行中' : 'Active',
    owner: 'Lisa Wang',
    progress: '45%',
  },
  {
    project: locale.value === 'zh' ? '无障碍审计' : 'Accessibility audit',
    status: locale.value === 'zh' ? '待办' : 'Pending',
    owner: 'Mike Zhang',
    progress: '0%',
  },
])

const stackOptions = computed(() => [
  { label: 'Vue', value: 'vue' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Vite', value: 'vite' },
])

const themeOptions = computed(() => [
  { label: locale.value === 'zh' ? '浅色' : 'Light', value: 'light' },
  { label: locale.value === 'zh' ? '深色' : 'Dark', value: 'dark' },
  { label: locale.value === 'zh' ? '跟随系统' : 'System', value: 'system' },
])

const checkboxOptions = computed(() => [
  { label: locale.value === 'zh' ? '发布检查' : 'Release checks', value: 'release' },
  { label: locale.value === 'zh' ? '单元测试' : 'Unit tests', value: 'unit' },
  { label: locale.value === 'zh' ? '视觉回归' : 'Visual review', value: 'visual' },
  { label: locale.value === 'zh' ? '安全审计' : 'Security audit', value: 'security', disabled: true },
])

const enabledCheckboxValues = computed(() => checkboxOptions.value.filter((option) => !option.disabled).map((option) => option.value))
const checkboxAllChecked = computed(() => enabledCheckboxValues.value.every((value) => checkboxValues.value.includes(value)))
const checkboxIndeterminate = computed(() => checkboxValues.value.length > 0 && !checkboxAllChecked.value)

const tabItems = computed(() => [
  { key: 'overview', label: locale.value === 'zh' ? '概览' : 'Overview', content: locale.value === 'zh' ? '组件状态、安装方式和设计约束。' : 'Component status, install path, and design constraints.' },
  { key: 'props', label: 'Props', content: locale.value === 'zh' ? '参数、默认值和受控状态。' : 'Props, defaults, and controlled state.' },
  { key: 'events', label: 'Events', content: locale.value === 'zh' ? '交互事件和实例方法。' : 'Interaction events and instance methods.' },
])

const breadcrumbItems = computed(() => [
  { key: 'home', label: locale.value === 'zh' ? '首页' : 'Home' },
  { key: 'components', label: locale.value === 'zh' ? '组件' : 'Components' },
  { key: 'button', label: 'Button' },
])

const dropdownActions = computed(() => [
  { label: locale.value === 'zh' ? '编辑' : 'Edit', value: 'edit' },
  { label: locale.value === 'zh' ? '复制' : 'Duplicate', value: 'duplicate' },
  { label: locale.value === 'zh' ? '归档' : 'Archive', value: 'archive' },
])

const menuItems = computed(() => [
  { key: 'guide', label: locale.value === 'zh' ? '指南' : 'Guide' },
  { key: 'components', label: locale.value === 'zh' ? '组件' : 'Components' },
  { key: 'resources', label: locale.value === 'zh' ? '资源' : 'Resources' },
])

const stepItems = computed(() => [
  { key: 'install', label: locale.value === 'zh' ? '安装' : 'Install', content: 'npm install' },
  { key: 'configure', label: locale.value === 'zh' ? '配置' : 'Configure', content: 'app.use' },
  { key: 'publish', label: locale.value === 'zh' ? '发布' : 'Publish', content: 'build' },
])

const listItems = computed(() => [
  { key: 'docs', title: locale.value === 'zh' ? '补齐 Props 文档' : 'Complete props docs', icon: 'edit', description: locale.value === 'zh' ? '优先级高' : 'High priority' },
  { key: 'states', title: locale.value === 'zh' ? '检查交互状态' : 'Check interaction states', icon: 'eye', description: locale.value === 'zh' ? '进行中' : 'In progress' },
  { key: 'publish', title: locale.value === 'zh' ? '发布组件包' : 'Publish package', icon: 'play', description: locale.value === 'zh' ? '待发布' : 'Pending' },
  { key: 'a11y', title: locale.value === 'zh' ? '无障碍审计' : 'Accessibility audit', icon: 'shield-check', description: locale.value === 'zh' ? '已完成' : 'Ready' },
  { key: 'coverage', title: locale.value === 'zh' ? '提升测试覆盖率' : 'Improve test coverage', icon: 'check', description: '94%' },
])

const treeNodes = computed(() => [
  {
    key: 'components',
    title: locale.value === 'zh' ? '组件' : 'Components',
    children: [
      {
        key: 'forms',
        title: locale.value === 'zh' ? '表单' : 'Forms',
        children: [
          { key: 'input', title: 'Input' },
          { key: 'select', title: 'Select' },
          { key: 'checkbox', title: 'Checkbox' },
        ],
      },
      {
        key: 'feedback',
        title: locale.value === 'zh' ? '反馈' : 'Feedback',
        children: [
          { key: 'dialog', title: 'Dialog' },
          { key: 'drawer', title: 'Drawer' },
          { key: 'tooltip', title: 'Tooltip' },
        ],
      },
      {
        key: 'display',
        title: locale.value === 'zh' ? '展示' : 'Display',
        children: [
          { key: 'card', title: 'Card' },
          { key: 'table', title: 'Table' },
          { key: 'icon', title: 'Icon' },
        ],
      },
    ],
  },
  { key: 'docs', title: locale.value === 'zh' ? '文档' : 'Docs' },
  { key: 'api', title: 'API Reference' },
])

const iconNames = [
  'check', 'close', 'shield-check', 'sparkles', 'upload', 'search', 'zap',
  'home', 'user', 'settings', 'heart', 'star', 'mail', 'bell', 'calendar',
  'folder', 'trash', 'edit', 'plus', 'minus', 'arrowUp', 'arrowDown',
  'arrowLeft', 'arrowRight', 'menu', 'more', 'lock', 'eye', 'link',
  'copy', 'alert', 'info', 'externalLink', 'clock', 'file', 'play',
  'pause', 'refresh',
]

const importSnippet = computed(
  () => `import { NkButton, NkInput } from 'nitekit'
import 'nitekit/style.css'`,
)

function saveButtonCase() {
  buttonClicks.value += 1
  buttonLoading.value = true
  window.setTimeout(() => {
    buttonLoading.value = false
  }, 900)
}

function showToast() {
  NkMessage.success(locale.value === 'zh' ? '发布成功' : 'Published')
}

function toggleCheckboxAll(value: boolean) {
  checkboxValues.value = value ? [...enabledCheckboxValues.value] : []
}

function setLocale(value: Locale) {
  locale.value = value
  document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en'
}

function removeTag(tag: string) {
  closableTags.value = closableTags.value.filter((item) => item !== tag)
}
</script>

<template>
  <div class="docs-shell">
    <header class="site-header">
      <a class="brand" href="#">
        <span class="brand-mark">N</span>
        <span class="brand-text">
          <span class="brand-name">NiteKit</span>
          <span class="brand-caption">{{ content.brandCaption }}</span>
        </span>
      </a>

      <nav class="top-nav" aria-label="Primary">
        <a href="#quickstart">{{ content.nav.quickStart }}</a>
        <a href="#props-cases">{{ content.nav.propsCases }}</a>
        <a href="#components">{{ content.nav.components }}</a>
        <a href="#showcase">{{ content.nav.showcase }}</a>
        <a href="#design">{{ content.nav.design }}</a>
        <a href="#api">{{ content.nav.api }}</a>
      </nav>

      <div class="header-actions">
        <div class="language-toggle" aria-label="Language switch">
          <button :class="{ 'is-active': locale === 'zh' }" type="button" @click="setLocale('zh')">
            <Languages :size="14" />
            中文
          </button>
          <button :class="{ 'is-active': locale === 'en' }" type="button" @click="setLocale('en')">
            EN
          </button>
        </div>
        <NkButton variant="outline" size="sm">
          <template #icon><Code /></template>
          GitHub
        </NkButton>
      </div>
    </header>

    <div class="docs-layout">
      <aside class="sidebar-panel">
        <NkInput v-model="searchQuery" :label="content.sidebar.search">
          <template #icon><Search /></template>
        </NkInput>
        <div class="side-group">
          <p class="side-title">{{ content.sidebar.guide }}</p>
          <a class="side-link" href="#quickstart">
            {{ content.nav.quickStart }}
            <ArrowRight :size="15" />
          </a>
          <a class="side-link" href="#props-cases">
            {{ content.nav.propsCases }}
            <ArrowRight :size="15" />
          </a>
          <a class="side-link" href="#showcase">
            {{ content.nav.showcase }}
            <ArrowRight :size="15" />
          </a>
          <a class="side-link" href="#design">
            {{ content.nav.design }}
            <ArrowRight :size="15" />
          </a>
          <a class="side-link" href="#api">
            {{ content.nav.api }}
            <ArrowRight :size="15" />
          </a>
        </div>
        <div class="side-group">
          <p class="side-title">{{ content.sidebar.componentList }}</p>
          <a
            v-for="group in filteredCatalogGroups"
            :key="group.title"
            class="side-category"
            href="#components"
          >
            {{ group.title }}
            <span>{{ group.items.length }}</span>
          </a>
          <a
            v-for="item in filteredCatalogGroups.flatMap((group) => group.items)"
            :key="item.id"
            class="side-link"
            :class="{ 'side-link--muted': item.status !== 'ready' }"
            :href="catalogHref(item)"
          >
            {{ item.name }}
            <NkTag :variant="statusVariant(item.status)">{{ content.catalogStatus[item.status] }}</NkTag>
          </a>
        </div>
      </aside>

      <main class="docs-main">
        <section class="hero-panel">
          <div class="hero-copy">
            <span class="section-eyebrow">{{ content.hero.eyebrow }}</span>
            <h1 class="hero-title">
              {{ content.hero.title }}
              <span>{{ content.hero.highlighted }}</span>
            </h1>
            <p class="hero-description">{{ content.hero.description }}</p>
            <div class="hero-actions">
              <NkButton variant="primary" size="lg">
                <template #icon><Zap /></template>
                {{ content.hero.primary }}
              </NkButton>
              <NkButton variant="outline" size="lg">
                <template #icon><BookOpen /></template>
                {{ content.hero.secondary }}
              </NkButton>
            </div>
            <div class="install-card">
              <div class="install-card__header">
                <span class="install-title">{{ content.hero.installTitle }}</span>
              </div>
              <DocsCodeBlock
                :code="snippets.install"
                filename="Terminal"
                language="bash"
                :labels="content.codeBlock"
                :max-lines="4"
              />
            </div>
          </div>

          <div class="preview-board" aria-label="NiteKit component preview">
            <div class="preview-row">
              <NkButton variant="primary">
                <template #icon><Sparkles /></template>
                Primary
              </NkButton>
              <NkButton variant="success">Success</NkButton>
              <NkButton variant="danger">Danger</NkButton>
              <NkButton variant="outline">Outline</NkButton>
            </div>
            <div class="input-grid">
              <NkInput v-model="username" label="Username" placeholder="Enter username" />
              <NkInput v-model="email" label="Email" placeholder="your@email.com" type="email" />
            </div>
            <NkInput v-model="description" label="Description" textarea />
            <div class="tag-row">
              <NkTag variant="primary">Design System</NkTag>
              <NkTag variant="success">Published</NkTag>
              <NkTag variant="warning">Review</NkTag>
              <NkTag variant="danger">Deprecated</NkTag>
              <NkTag variant="info">v0.1</NkTag>
            </div>
            <div class="switch-row">
              <NkSwitch v-model="glassEnabled" label="Glassmorphism" />
              <NkSwitch v-model="notifications" label="Notifications" />
              <NkSwitch v-model="autoUpdate" label="Auto update" />
            </div>
          </div>
        </section>

        <section id="quickstart" class="doc-panel">
          <div class="section-heading">
            <span class="section-eyebrow">{{ content.quickStart.eyebrow }}</span>
            <h2>{{ content.quickStart.title }}</h2>
            <p>{{ content.quickStart.description }}</p>
          </div>
          <div class="quick-grid">
            <article v-for="(step, index) in content.quickStart.steps" :key="step.title" class="quick-step">
              <div class="quick-step__header">
                <span class="step-index">{{ index + 1 }}</span>
              </div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
              <DocsCodeBlock
                :code="snippets[step.codeKey]"
                :filename="quickStepMeta[step.codeKey].filename"
                :language="quickStepMeta[step.codeKey].language"
                :labels="content.codeBlock"
                :max-lines="8"
              />
            </article>
          </div>
        </section>

        <section id="props-cases" class="doc-panel">
          <div class="section-heading">
            <span class="section-eyebrow">{{ content.propsCases.eyebrow }}</span>
            <h2>{{ content.propsCases.title }}</h2>
            <p>{{ content.propsCases.description }}</p>
          </div>
          <div class="props-case-grid">
            <article v-for="item in content.propsCases.items" :key="item.codeKey" class="props-case">
              <div class="props-case__preview">
                <template v-if="item.codeKey === 'caseButtonProps'">
                  <div class="button-sample">
                    <NkButton variant="primary" size="lg" :loading="buttonLoading" @click="saveButtonCase">
                      Save changes {{ buttonClicks }}
                    </NkButton>
                    <NkButton variant="default">Default</NkButton>
                    <NkButton variant="success">Published</NkButton>
                    <NkButton variant="danger" size="sm">Delete</NkButton>
                    <NkButton variant="ghost">Ghost</NkButton>
                    <NkButton variant="outline" disabled>Disabled</NkButton>
                    <NkButton variant="primary" icon-only aria-label="Quick action">
                      <template #icon><Sparkles /></template>
                    </NkButton>
                  </div>
                </template>
                <template v-else-if="item.codeKey === 'caseInputProps'">
                  <div class="input-grid">
                    <NkInput v-model="username" label="Project" placeholder="Project name" />
                    <NkInput v-model="email" label="Email" placeholder="team@nitekit.dev" type="email" />
                    <NkInput v-model="description" label="Description" textarea />
                    <NkInput label="Readonly state" model-value="Disabled example" disabled />
                  </div>
                </template>
                <template v-else-if="item.codeKey === 'caseTableProps'">
                  <NkTable :columns="tableColumns" :rows="tableRows">
                    <template #status="{ value }">
                      <NkTag variant="success">{{ value }}</NkTag>
                    </template>
                  </NkTable>
                </template>
                <template v-else>
                  <div class="progress-stack">
                    <NkSwitch v-model="autoUpdate" label="Auto publish" />
                    <NkProgress label="Documentation" :value="72" variant="cyan" />
                    <NkPagination v-model="currentPage" :total="240" :page-size="10" />
                  </div>
                </template>
              </div>
              <div class="props-case__content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <DocsCodeBlock
                  :code="docSnippet(item.codeKey)"
                  :filename="`${item.codeKey}.vue`"
                  language="vue"
                  :labels="content.codeBlock"
                  :max-lines="item.codeKey === 'caseButtonProps' ? 28 : 18"
                />
              </div>
            </article>
          </div>
        </section>

        <section id="components" class="doc-panel">
          <div class="section-heading">
            <span class="section-eyebrow">{{ content.componentsIntro.eyebrow }}</span>
            <h2>{{ content.componentsIntro.title }}</h2>
            <p>{{ content.componentsIntro.description }}</p>
          </div>
          <div class="catalog-heading">
            <h3>{{ content.componentsIntro.catalogTitle }}</h3>
            <p>{{ content.componentsIntro.catalogDescription }}</p>
          </div>
          <div class="catalog-overview">
            <article v-for="group in filteredCatalogGroups" :key="group.title" class="catalog-card">
              <div class="catalog-card__header">
                <h3>{{ group.title }}</h3>
                <span>{{ group.items.length }}</span>
              </div>
              <div class="catalog-card__items">
                <a
                  v-for="item in group.items"
                  :key="item.id"
                  class="catalog-item"
                  :class="{ 'catalog-item--muted': item.status !== 'ready' }"
                  :href="catalogHref(item)"
                >
                  <span>{{ item.name }}</span>
                  <NkTag :variant="statusVariant(item.status)">{{ content.catalogStatus[item.status] }}</NkTag>
                </a>
              </div>
            </article>
          </div>
          <div class="component-grid">
            <p v-if="filteredComponents.length === 0" class="empty-docs">
              {{ content.componentsIntro.empty }}
            </p>
            <article
              v-for="component in filteredComponents"
              :id="component.id"
              :key="component.id"
              class="component-doc"
            >
              <div class="component-doc__meta">
                <div class="component-doc__header">
                  <div>
                    <NkTag variant="primary">{{ component.tag }}</NkTag>
                    <NkTag :variant="statusVariant(component.status)">{{ content.catalogStatus[component.status] }}</NkTag>
                    <h3>{{ component.name }}</h3>
                  </div>
                </div>
                <p class="component-doc__description">{{ component.description }}</p>
                <DocsCodeBlock
                  :code="docSnippet(component.codeKey)"
                  :filename="`${component.id}.vue`"
                  language="vue"
                  :labels="content.codeBlock"
                  :max-lines="component.id === 'checkbox' ? 28 : 10"
                />
              </div>

              <div class="component-preview">
                <template v-if="component.id === 'button'">
                  <div class="button-sample">
                    <NkButton variant="primary">
                      <template #icon><ArrowRight /></template>
                      Primary
                    </NkButton>
                    <NkButton variant="success">Success</NkButton>
                    <NkButton variant="danger">Danger</NkButton>
                    <NkButton variant="outline">Outline</NkButton>
                    <NkButton variant="primary" icon-only aria-label="Icon button">
                      <template #icon><Sparkles /></template>
                    </NkButton>
                  </div>
                </template>

                <template v-else-if="component.id === 'input'">
                  <div class="input-grid">
                    <NkInput v-model="username" label="Username" placeholder="Enter username" />
                    <NkInput v-model="email" label="Email" placeholder="your@email.com" />
                  </div>
                  <NkInput v-model="description" label="Description" textarea />
                </template>

                <template v-else-if="component.id === 'tag'">
                  <div class="tag-row">
                    <NkTag variant="primary">Vue</NkTag>
                    <NkTag variant="success">Published</NkTag>
                    <NkTag variant="warning">Review</NkTag>
                    <NkTag variant="danger">Deprecated</NkTag>
                    <NkTag
                      v-for="tag in closableTags"
                      :key="tag"
                      variant="info"
                      closable
                      @close="removeTag(tag)"
                    >
                      {{ tag }}
                    </NkTag>
                  </div>
                </template>

                <template v-else-if="component.id === 'switch'">
                  <div class="switch-row">
                    <NkSwitch v-model="glassEnabled" label="Glassmorphism" />
                    <NkSwitch v-model="notifications" label="Notifications" />
                    <NkSwitch v-model="autoUpdate" label="Auto update" />
                  </div>
                </template>

                <template v-else-if="component.id === 'card'">
                  <div class="stats-grid">
                    <NkCard title="MAU" stat="24.8K" accent="purple">
                      <template #icon><Package /></template>
                    </NkCard>
                    <NkCard title="Latency" stat="98ms" accent="cyan">
                      <template #icon><Zap /></template>
                    </NkCard>
                    <NkCard title="SLA" stat="99.99%" accent="pink">
                      <template #icon><ShieldCheck /></template>
                    </NkCard>
                    <NkCard title="Coverage" stat="94%" accent="green">
                      <template #icon><Check /></template>
                    </NkCard>
                  </div>
                </template>

                <template v-else-if="component.id === 'table'">
                  <NkTable :columns="tableColumns" :rows="tableRows">
                    <template #status="{ value }">
                      <span class="status-pill">{{ value }}</span>
                    </template>
                  </NkTable>
                </template>

                <template v-else-if="component.id === 'progress'">
                  <div class="progress-stack">
                    <NkProgress label="UI Components" :value="85" variant="purple" />
                    <NkProgress label="Documentation" :value="62" variant="cyan" />
                    <NkProgress label="Test Coverage" :value="94" variant="pink" />
                    <NkProgress label="Accessibility" :value="47" variant="green" />
                  </div>
                </template>

                <template v-else-if="component.id === 'pagination'">
                  <NkPagination v-model="currentPage" :total="240" :page-size="10" />
                </template>

                <template v-else-if="component.id === 'icon'">
                  <div class="icon-grid">
                    <div
                      v-for="name in iconNames"
                      :key="name"
                      class="icon-grid__item"
                    >
                      <NkIcon :name="name" :size="22" />
                      <span class="icon-grid__label">{{ name }}</span>
                    </div>
                  </div>
                </template>

                <template v-else-if="component.id === 'layout'">
                  <NkLayout :columns="3" gap="12px" responsive class="mini-layout">
                    <section>Aside</section>
                    <section>Main</section>
                    <section>Tools</section>
                  </NkLayout>
                </template>

                <template v-else-if="component.id === 'link'">
                  <div class="inline-preview">
                    <NkLink href="#quickstart" underline>Quick Start</NkLink>
                    <NkLink href="#components">Components</NkLink>
                    <NkLink disabled>Disabled</NkLink>
                  </div>
                </template>

                <template v-else-if="component.id === 'select'">
                  <div class="switch-col">
                    <NkSelect v-model="selectedStack" :options="stackOptions" clearable placeholder="Select stack" />
                    <NkSelect v-model="multiSelectValue" :options="stackOptions" multiple clearable placeholder="Multi-select" />
                  </div>
                </template>

                <template v-else-if="component.id === 'checkbox'">
                  <div class="checkbox-demo">
                    <div class="checkbox-scheme-label">Scheme B (Glass · 默认)</div>
                    <div class="checkbox-scheme-row">
                      <NkCheckbox
                        :model-value="checkboxAllChecked"
                        :indeterminate="checkboxIndeterminate"
                        :label="locale === 'zh' ? '全选' : 'Check all'"
                        @change="toggleCheckboxAll"
                      />
                      <NkCheckboxGroup v-model="checkboxValues" :options="checkboxOptions" />
                    </div>
                    <div class="checkbox-scheme-label">Scheme A (Gradient Purple)</div>
                    <div class="checkbox-scheme-row checkbox-scheme-a">
                      <NkCheckbox
                        :model-value="checkboxAllChecked"
                        :indeterminate="checkboxIndeterminate"
                        :label="locale === 'zh' ? '全选' : 'Check all'"
                        @change="toggleCheckboxAll"
                      />
                      <NkCheckboxGroup v-model="checkboxValues" :options="checkboxOptions" />
                    </div>
                    <div class="checkbox-scheme-label">Scheme C (Border Highlight)</div>
                    <div class="checkbox-scheme-row checkbox-scheme-c">
                      <NkCheckbox
                        :model-value="checkboxAllChecked"
                        :indeterminate="checkboxIndeterminate"
                        :label="locale === 'zh' ? '全选' : 'Check all'"
                        @change="toggleCheckboxAll"
                      />
                      <NkCheckboxGroup v-model="checkboxValues" :options="checkboxOptions" />
                    </div>
                  </div>
                </template>

                <template v-else-if="component.id === 'radio'">
                  <NkRadio v-model="selectedTheme" :options="themeOptions" button />
                </template>

                <template v-else-if="component.id === 'slider'">
                  <NkSlider v-model="coverage" :step="5" :marks="{ 0: '0', 50: '50', 100: '100' }" />
                </template>

                <template v-else-if="component.id === 'upload'">
                  <NkUpload accept=".png,.jpg,.svg" :limit="3" multiple>
                    <template #trigger>Upload assets</template>
                    <template #tip>
                      <span class="preview-hint">PNG, JPG, SVG / max 3</span>
                    </template>
                  </NkUpload>
                </template>

                <template v-else-if="component.id === 'form'">
                  <NkForm :model="{ username, selectedStack }" label-width="96px">
                    <NkInput v-model="username" label="Project" placeholder="NiteKit" />
                    <NkSelect v-model="selectedStack" :options="stackOptions" />
                    <NkButton variant="primary" type="submit">Submit</NkButton>
                  </NkForm>
                </template>

                <template v-else-if="component.id === 'badge'">
                  <div class="inline-preview">
                    <NkBadge :value="12" type="danger">
                      <NkButton variant="outline">Inbox</NkButton>
                    </NkBadge>
                    <NkBadge dot type="success">
                      <NkAvatar fallback="AC" />
                    </NkBadge>
                  </div>
                </template>

                <template v-else-if="component.id === 'avatar'">
                  <div class="inline-preview">
                    <NkAvatar fallback="AC" size="lg" />
                    <NkAvatar fallback="LW" />
                    <NkAvatar fallback="TZ" shape="square" />
                  </div>
                </template>

                <template v-else-if="component.id === 'list'">
                  <NkList :data-source="listItems" bordered>
                    <template #item="{ item }">
                      <div
                        class="list-preview-item"
                        :class="{ 'list-preview-item--selected': selectedListItem === item.key }"
                        @click="selectedListItem = item.key"
                      >
                        <NkIcon :name="item.icon" :size="18" color="#c4b5fd" />
                        <span class="list-preview-item__title">{{ item.title }}</span>
                        <span class="list-preview-item__desc">{{ item.description }}</span>
                      </div>
                    </template>
                  </NkList>
                </template>

                <template v-else-if="component.id === 'tree'">
                  <NkTree
                    :data="treeNodes"
                    :expanded-keys="['components', 'forms', 'feedback', 'display']"
                    :selected-key="treeSelectedKey"
                    checkable
                    @select="treeSelectedKey = $event"
                  />
                </template>

                <template v-else-if="component.id === 'empty'">
                  <NkEmpty description="No components matched">
                    <NkButton variant="primary">Create component</NkButton>
                  </NkEmpty>
                </template>

                <template v-else-if="component.id === 'tabs'">
                  <NkTabs v-model="activeTab" :items="tabItems" type="card" />
                </template>

                <template v-else-if="component.id === 'breadcrumb'">
                  <NkBreadcrumb :items="breadcrumbItems" separator="/" />
                </template>

                <template v-else-if="component.id === 'dropdown'">
                  <NkDropdown :options="dropdownActions" trigger="click" @select="showToast">
                    Actions
                  </NkDropdown>
                </template>

                <template v-else-if="component.id === 'menu'">
                  <NkMenu v-model="activeMenu" :items="menuItems" mode="vertical" />
                </template>

                <template v-else-if="component.id === 'steps'">
                  <NkSteps :current="activeStep" :items="stepItems" @change="activeStep = $event" />
                </template>

                <template v-else-if="component.id === 'alert'">
                  <NkAlert type="success" title="Release ready" description="All component APIs are documented." show-icon closable />
                </template>

                <template v-else-if="component.id === 'dialog'">
                  <div class="preview-stack">
                    <NkButton variant="primary" @click="dialogOpen = true">Open dialog</NkButton>
                    <NkDialog v-model:open="dialogOpen" title="Publish release">
                      Confirm publishing NiteKit v0.1?
                    </NkDialog>
                  </div>
                </template>

                <template v-else-if="component.id === 'drawer'">
                  <div class="preview-stack">
                    <div class="drawer-buttons">
                      <NkButton variant="outline" size="sm" @click="drawerTop = true">Top</NkButton>
                      <NkButton variant="outline" size="sm" @click="drawerBottom = true">Bottom</NkButton>
                      <NkButton variant="outline" size="sm" @click="drawerLeft = true">Left</NkButton>
                      <NkButton variant="outline" size="sm" @click="drawerRight = true">Right</NkButton>
                    </div>
                    <NkDrawer v-model:open="drawerTop" title="Top drawer" placement="top">
                      Drawer from top with slide-in animation.
                    </NkDrawer>
                    <NkDrawer v-model:open="drawerBottom" title="Bottom drawer" placement="bottom">
                      Drawer from bottom with slide-in animation.
                    </NkDrawer>
                    <NkDrawer v-model:open="drawerLeft" title="Left drawer" placement="left">
                      Drawer from left with slide-in animation.
                    </NkDrawer>
                    <NkDrawer v-model:open="drawerRight" title="Right drawer" placement="right">
                      <NkSwitch v-model="notifications" label="Notifications" />
                    </NkDrawer>
                  </div>
                </template>

                <template v-else-if="component.id === 'message'">
                  <div class="preview-stack">
                    <NkButton variant="success" @click="showToast">Show message</NkButton>
                    <NkMessage type="info" content="Inline message component" closable />
                  </div>
                </template>

                <template v-else-if="component.id === 'tooltip'">
                  <div class="tooltip-demo">
                    <NkTooltip content="Tooltip on top" placement="top">
                      <NkButton variant="ghost" size="sm">Top</NkButton>
                    </NkTooltip>
                    <NkTooltip content="Tooltip on bottom" placement="bottom">
                      <NkButton variant="ghost" size="sm">Bottom</NkButton>
                    </NkTooltip>
                    <NkTooltip content="Tooltip on left" placement="left">
                      <NkButton variant="ghost" size="sm">Left</NkButton>
                    </NkTooltip>
                    <NkTooltip content="Tooltip on right" placement="right">
                      <NkButton variant="ghost" size="sm">Right</NkButton>
                    </NkTooltip>
                  </div>
                </template>

                <template v-else-if="component.id === 'skeleton'">
                  <NkSkeleton loading animated avatar :rows="3" />
                </template>

                <template v-else>
                  <NkEmpty :description="component.name" />
                </template>
              </div>

              <div class="component-api">
                <h4>{{ content.apiTable.title }}</h4>
                <DocsApiTable
                  :sections="componentApiSections(component.id)"
                  :labels="content.apiTable"
                />
              </div>
            </article>
          </div>
        </section>

        <section id="showcase" class="doc-panel">
          <div class="section-heading">
            <span class="section-eyebrow">{{ content.showcase.eyebrow }}</span>
            <h2>{{ content.showcase.title }}</h2>
            <p>{{ content.showcase.description }}</p>
          </div>
          <div class="showcase-layout">
            <div class="showcase-preview">
              <div class="showcase-toolbar">
                <NkInput v-model="searchQuery" :label="content.sidebar.search" placeholder="Button / Dialog / Form" />
                <NkSwitch v-model="notifications" label="Auto publish" />
                <NkButton variant="primary">Create release</NkButton>
              </div>
              <div class="stats-grid">
                <NkCard title="Ready" stat="8" accent="green" />
                <NkCard title="Components" stat="33" accent="cyan" />
                <NkCard title="API sections" stat="132" accent="purple" />
                <NkCard title="Coverage" stat="88%" accent="pink" />
              </div>
              <NkProgress label="Documentation completeness" :value="88" variant="cyan" />
              <NkTable :columns="tableColumns" :rows="tableRows">
                <template #status="{ value }">
                  <NkTag variant="success">{{ value }}</NkTag>
                </template>
              </NkTable>
              <div class="case-preview__surface">
                <span class="case-preview__token">Dialog</span>
                <span class="case-preview__token">Drawer</span>
                <span class="case-preview__token">Form</span>
                <span class="case-preview__token">Upload</span>
              </div>
              <NkPagination v-model="currentPage" :total="80" :page-size="10" />
            </div>
            <DocsCodeBlock
              :code="docSnippet('completeDashboard')"
              :filename="content.showcase.codeTitle"
              language="vue"
              :labels="content.codeBlock"
              :max-lines="18"
            />
          </div>
        </section>

        <section id="design" class="doc-panel">
          <div class="section-heading">
            <span class="section-eyebrow">{{ content.design.eyebrow }}</span>
            <h2>{{ content.design.title }}</h2>
            <p>{{ content.design.description }}</p>
          </div>
          <div class="design-principles">
            <article v-for="(principle, index) in content.design.principles" :key="principle.title" class="principle">
              <Sparkles v-if="index === 0" :size="24" />
              <Code v-else-if="index === 1" :size="24" />
              <Languages v-else :size="24" />
              <h3>{{ principle.title }}</h3>
              <p>{{ principle.description }}</p>
            </article>
          </div>
        </section>

        <section id="api" class="doc-panel">
          <div class="section-heading">
            <span class="section-eyebrow">{{ content.api.eyebrow }}</span>
            <h2>{{ content.api.title }}</h2>
            <p>{{ content.api.description }}</p>
          </div>
          <div class="quick-grid">
            <article class="quick-step">
              <div class="quick-step__header">
                <h3>{{ content.api.global }}</h3>
                <NkTag variant="success">Plugin</NkTag>
              </div>
              <DocsCodeBlock
                :code="snippets.import"
                filename="main.ts"
                language="ts"
                :labels="content.codeBlock"
              />
            </article>
            <article class="quick-step">
              <div class="quick-step__header">
                <h3>{{ content.api.onDemand }}</h3>
                <NkTag variant="info">ESM</NkTag>
              </div>
              <DocsCodeBlock
                :code="importSnippet"
                filename="component.ts"
                language="ts"
                :labels="content.codeBlock"
              />
            </article>
            <article class="quick-step">
              <div class="quick-step__header">
                <h3>v-model</h3>
                <NkTag variant="primary">Vue 3</NkTag>
              </div>
              <DocsCodeBlock
                :code="snippets.use"
                filename="FormDemo.vue"
                language="vue"
                :labels="content.codeBlock"
              />
            </article>
          </div>
        </section>

        <p class="footer-note">{{ content.footer }}</p>
      </main>
    </div>
  </div>
</template>
