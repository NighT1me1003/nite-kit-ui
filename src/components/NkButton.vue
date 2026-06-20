<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({
  name: 'NkButton',
})

type ButtonVariant = 'default' | 'primary' | 'success' | 'danger' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    iconOnly?: boolean
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'default',
    size: 'md',
    iconOnly: false,
    disabled: false,
    loading: false,
    type: 'button',
  },
)

const classes = computed(() => [
  'nk-button',
  `nk-button--${props.variant}`,
  `nk-button--${props.size}`,
  {
    'nk-button--icon-only': props.iconOnly,
    'nk-button--loading': props.loading,
  },
])

const buttonRef = ref<HTMLButtonElement>()

function focus() {
  buttonRef.value?.focus()
}

function blur() {
  buttonRef.value?.blur()
}

defineExpose({
  blur,
  focus,
})
</script>

<template>
  <button ref="buttonRef" :class="classes" :type="type" :disabled="disabled || loading" :aria-busy="loading || undefined">
    <span v-if="loading" class="nk-button__spinner" aria-hidden="true" />
    <span v-else-if="$slots.icon" class="nk-button__icon">
      <slot name="icon" />
    </span>
    <span v-if="$slots.default" class="nk-button__label">
      <slot />
    </span>
  </button>
</template>
