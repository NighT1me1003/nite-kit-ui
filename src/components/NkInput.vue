<script setup lang="ts">
import { computed, getCurrentInstance, ref } from 'vue'

defineOptions({
  name: 'NkInput',
})

const props = withDefaults(
  defineProps<{
    modelValue?: string
    id?: string
    label?: string
    placeholder?: string
    type?: string
    textarea?: boolean
    rows?: number
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    id: '',
    label: '',
    placeholder: '',
    type: 'text',
    textarea: false,
    rows: 4,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const uid = getCurrentInstance()?.uid ?? Math.random()
const inputId = computed(() => props.id || `nk-input-${uid}`)
const controlRef = ref<HTMLInputElement | HTMLTextAreaElement>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

function focus() {
  controlRef.value?.focus()
}

function blur() {
  controlRef.value?.blur()
}

function select() {
  controlRef.value?.select()
}

defineExpose({
  blur,
  focus,
  select,
})
</script>

<template>
  <label class="nk-field" :for="inputId">
    <span v-if="label" class="nk-field__label">{{ label }}</span>
    <textarea
      v-if="textarea"
      ref="controlRef"
      :id="inputId"
      class="nk-input nk-input--textarea"
      :placeholder="placeholder"
      :rows="rows"
      :value="modelValue"
      :disabled="disabled"
      @input="handleInput"
    />
    <span v-else class="nk-input-shell" :class="{ 'nk-input-shell--with-icon': $slots.icon }">
      <span v-if="$slots.icon" class="nk-input-shell__icon">
        <slot name="icon" />
      </span>
      <input
        ref="controlRef"
        :id="inputId"
        class="nk-input"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        @input="handleInput"
      />
    </span>
  </label>
</template>
