<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Copy, Maximize2, Minimize2, WrapText } from '@lucide/vue'

defineOptions({
  name: 'DocsCodeBlock',
})

const props = withDefaults(
  defineProps<{
    code: string
    filename?: string
    language?: string
    title?: string
    maxLines?: number
    labels?: {
      copy?: string
      copied?: string
      wrap?: string
      unwrap?: string
      expand?: string
      collapse?: string
    }
  }>(),
  {
    filename: '',
    language: 'vue',
    title: '',
    maxLines: 12,
    labels: () => ({}),
  },
)

const copied = ref(false)
const expanded = ref(false)
const wrapped = ref(true)

const lines = computed(() => props.code.replace(/\n$/, '').split('\n'))
const shouldCollapse = computed(() => lines.value.length > props.maxLines)
const visibleLines = computed(() => {
  if (!shouldCollapse.value || expanded.value) {
    return lines.value
  }

  return lines.value.slice(0, props.maxLines)
})

const mergedLabels = computed(() => ({
  copy: props.labels.copy ?? 'Copy',
  copied: props.labels.copied ?? 'Copied',
  wrap: props.labels.wrap ?? 'Wrap',
  unwrap: props.labels.unwrap ?? 'Unwrap',
  expand: props.labels.expand ?? 'Expand',
  collapse: props.labels.collapse ?? 'Collapse',
}))

async function copyCode() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1400)
}
</script>

<template>
  <figure class="docs-code-card">
    <figcaption class="docs-code-card__header">
      <span class="docs-code-card__title">
        <span class="docs-code-card__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>{{ title || filename || language }}</span>
      </span>
      <span class="docs-code-card__meta">
        <span v-if="filename" class="docs-code-card__file">{{ filename }}</span>
        <span class="docs-code-card__lang">{{ language }}</span>
      </span>
      <span class="docs-code-card__actions">
        <button
          class="docs-code-card__action"
          type="button"
          :aria-label="wrapped ? mergedLabels.unwrap : mergedLabels.wrap"
          :title="wrapped ? mergedLabels.unwrap : mergedLabels.wrap"
          @click="wrapped = !wrapped"
        >
          <WrapText :size="15" />
        </button>
        <button
          v-if="shouldCollapse"
          class="docs-code-card__action"
          type="button"
          :aria-label="expanded ? mergedLabels.collapse : mergedLabels.expand"
          :title="expanded ? mergedLabels.collapse : mergedLabels.expand"
          @click="expanded = !expanded"
        >
          <Minimize2 v-if="expanded" :size="15" />
          <Maximize2 v-else :size="15" />
        </button>
        <button class="docs-code-card__action docs-code-card__copy" type="button" @click="copyCode">
          <Check v-if="copied" :size="15" />
          <Copy v-else :size="15" />
          <span>{{ copied ? mergedLabels.copied : mergedLabels.copy }}</span>
        </button>
      </span>
    </figcaption>

    <pre class="docs-code-card__body" :class="{ 'docs-code-card__body--wrapped': wrapped }"><code><span
      v-for="(line, index) in visibleLines"
      :key="`${index}-${line}`"
      class="docs-code-card__line"
    ><span class="docs-code-card__number">{{ index + 1 }}</span><span class="docs-code-card__content">{{ line || ' ' }}</span></span></code></pre>

    <button
      v-if="shouldCollapse"
      class="docs-code-card__footer"
      type="button"
      @click="expanded = !expanded"
    >
      {{ expanded ? mergedLabels.collapse : mergedLabels.expand }}
    </button>
  </figure>
</template>

<style scoped>
.docs-code-card {
  overflow: hidden;
  min-width: 0;
  margin: 0;
  border: 1px solid rgba(255, 255, 255, 0.095);
  border-radius: 15px;
  background: rgba(3, 7, 18, 0.5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.docs-code-card__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 12px;
  align-items: center;
  min-height: 44px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);
  background: rgba(255, 255, 255, 0.045);
  padding: 8px 10px 8px 14px;
}

.docs-code-card__title,
.docs-code-card__meta,
.docs-code-card__actions,
.docs-code-card__dots {
  display: inline-flex;
  align-items: center;
}

.docs-code-card__title {
  gap: 9px;
  min-width: 0;
  color: rgba(247, 247, 251, 0.78);
  font-size: 12px;
  font-weight: 900;
}

.docs-code-card__title > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.docs-code-card__dots {
  gap: 5px;
}

.docs-code-card__dots span {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.docs-code-card__dots span:nth-child(1) {
  background: #fb7185;
}

.docs-code-card__dots span:nth-child(2) {
  background: #fbbf24;
}

.docs-code-card__dots span:nth-child(3) {
  background: #34d399;
}

.docs-code-card__meta {
  gap: 7px;
  min-width: 0;
}

.docs-code-card__file,
.docs-code-card__lang {
  display: inline-flex;
  align-items: center;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  color: rgba(247, 247, 251, 0.56);
  font-size: 11px;
  font-weight: 900;
  line-height: 1;
  padding: 0 9px;
}

.docs-code-card__lang {
  color: #a5f3fc;
  text-transform: uppercase;
}

.docs-code-card__actions {
  gap: 6px;
}

.docs-code-card__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.065);
  color: rgba(247, 247, 251, 0.72);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 900;
  padding: 0 8px;
}

.docs-code-card__action:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.docs-code-card__copy {
  min-width: 78px;
}

.docs-code-card__body {
  overflow-x: auto;
  max-width: 100%;
  margin: 0;
  color: #d1fae5;
  font-size: 13px;
  line-height: 1.65;
  padding: 12px 0;
}

.docs-code-card__body code {
  display: grid;
  min-width: max-content;
}

.docs-code-card__body--wrapped {
  overflow-x: hidden;
}

.docs-code-card__body--wrapped code {
  min-width: 0;
}

.docs-code-card__line {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  min-width: 0;
}

.docs-code-card__line:hover {
  background: rgba(255, 255, 255, 0.045);
}

.docs-code-card__number {
  user-select: none;
  color: rgba(247, 247, 251, 0.28);
  font-variant-numeric: tabular-nums;
  padding-right: 12px;
  text-align: right;
}

.docs-code-card__content {
  min-width: 0;
  padding-right: 16px;
  white-space: pre;
}

.docs-code-card__body--wrapped .docs-code-card__content {
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  word-break: break-word;
}

.docs-code-card__footer {
  width: 100%;
  min-height: 34px;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.075);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.075));
  color: #c4b5fd;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 900;
}

@media (max-width: 760px) {
  .docs-code-card__header {
    grid-template-columns: 1fr;
  }

  .docs-code-card__meta,
  .docs-code-card__actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
