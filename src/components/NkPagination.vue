<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'NkPagination',
})

const props = withDefaults(
  defineProps<{
    modelValue?: number
    total: number
    pageSize?: number
  }>(),
  {
    modelValue: 1,
    pageSize: 10,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const pages = computed(() => {
  const total = pageCount.value
  const current = props.modelValue
  const result: Array<number | 'ellipsis'> = []

  for (let page = 1; page <= total; page += 1) {
    const isEdge = page === 1 || page === total
    const isNear = Math.abs(page - current) <= 1

    if (isEdge || isNear) {
      result.push(page)
    } else if (result[result.length - 1] !== 'ellipsis') {
      result.push('ellipsis')
    }
  }

  return result
})

function goTo(page: number) {
  if (page >= 1 && page <= pageCount.value && page !== props.modelValue) {
    emit('update:modelValue', page)
  }
}

defineExpose({
  goTo,
})
</script>

<template>
  <nav class="nk-pagination" aria-label="Pagination">
    <button
      class="nk-page-button"
      type="button"
      :disabled="modelValue <= 1"
      aria-label="Previous page"
      @click="goTo(modelValue - 1)"
    >
      &lt;
    </button>
    <template v-for="(page, index) in pages" :key="`${page}-${index}`">
      <span v-if="page === 'ellipsis'" class="nk-page-ellipsis">...</span>
      <button
        v-else
        class="nk-page-button"
        :class="{ 'nk-page-button--active': page === modelValue }"
        type="button"
        @click="goTo(page)"
      >
        {{ page }}
      </button>
    </template>
    <button
      class="nk-page-button"
      type="button"
      :disabled="modelValue >= pageCount"
      aria-label="Next page"
      @click="goTo(modelValue + 1)"
    >
      &gt;
    </button>
  </nav>
</template>
