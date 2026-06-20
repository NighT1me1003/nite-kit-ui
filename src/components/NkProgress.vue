<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'NkProgress',
})

type ProgressVariant = 'purple' | 'cyan' | 'pink' | 'green'

const props = withDefaults(
  defineProps<{
    label?: string
    value: number
    variant?: ProgressVariant
  }>(),
  {
    label: '',
    variant: 'purple',
  },
)

const safeValue = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <div class="nk-progress">
    <div v-if="label" class="nk-progress__header">
      <span>{{ label }}</span>
      <span>{{ safeValue }}%</span>
    </div>
    <div class="nk-progress__track" role="progressbar" :aria-valuenow="safeValue" aria-valuemin="0" aria-valuemax="100">
      <span
        class="nk-progress__bar"
        :class="`nk-progress__bar--${variant}`"
        :style="{ width: `${safeValue}%` }"
      />
    </div>
  </div>
</template>
