<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'NkSwitch',
})

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    label: '',
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const switchRef = ref<HTMLButtonElement>()

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

function focus() {
  switchRef.value?.focus()
}

function blur() {
  switchRef.value?.blur()
}

defineExpose({
  blur,
  focus,
  toggle,
})
</script>

<template>
  <label class="nk-switch" :class="{ 'nk-switch--disabled': props.disabled }">
    <button
      ref="switchRef"
      class="nk-switch__track"
      :class="{ 'nk-switch__track--checked': props.modelValue }"
      type="button"
      role="switch"
      :aria-checked="props.modelValue"
      :disabled="props.disabled"
      @click="toggle"
    >
      <span class="nk-switch__thumb" />
    </button>
    <span v-if="props.label" class="nk-switch__label">{{ props.label }}</span>
  </label>
</template>
