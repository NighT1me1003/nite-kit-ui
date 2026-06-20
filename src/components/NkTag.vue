<script setup lang="ts">
defineOptions({
  name: 'NkTag',
})

type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

withDefaults(
  defineProps<{
    variant?: TagVariant
    closable?: boolean
  }>(),
  {
    variant: 'default',
    closable: false,
  },
)

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <span class="nk-tag" :class="`nk-tag--${variant}`">
    <span class="nk-tag__content">
      <slot />
    </span>
    <button
      v-if="closable"
      class="nk-tag__close"
      type="button"
      aria-label="Close tag"
      @click="emit('close')"
    >
      x
    </button>
  </span>
</template>
