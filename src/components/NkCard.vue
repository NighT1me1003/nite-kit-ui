<script setup lang="ts">
defineOptions({
  name: 'NkCard',
})

type CardAccent = 'purple' | 'cyan' | 'pink' | 'green' | 'amber'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    stat?: string
    accent?: CardAccent
  }>(),
  {
    title: '',
    description: '',
    stat: '',
    accent: 'purple',
  },
)
</script>

<template>
  <article class="nk-card" :class="`nk-card--${accent}`">
    <div v-if="$slots.icon" class="nk-card__icon">
      <slot name="icon" />
    </div>
    <p v-if="stat" class="nk-card__stat">{{ stat }}</p>
    <h3 v-if="title" class="nk-card__title">{{ title }}</h3>
    <p v-if="description" class="nk-card__description">{{ description }}</p>
    <div v-if="$slots.default" class="nk-card__body">
      <slot />
    </div>
  </article>
</template>
