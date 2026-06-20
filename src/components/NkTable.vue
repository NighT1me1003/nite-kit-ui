<script setup lang="ts">
defineOptions({
  name: 'NkTable',
})

interface NkTableColumn {
  key: string
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

withDefaults(
  defineProps<{
    columns: NkTableColumn[]
    rows: Record<string, unknown>[]
    emptyText?: string
  }>(),
  {
    emptyText: 'No data',
  },
)
</script>

<template>
  <div class="nk-table-wrap">
    <table class="nk-table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width, textAlign: column.align || 'left' }"
          >
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length" class="nk-table__empty">{{ emptyText }}</td>
        </tr>
        <tr v-for="(row, rowIndex) in rows" v-else :key="rowIndex">
          <td
            v-for="column in columns"
            :key="column.key"
            :style="{ textAlign: column.align || 'left' }"
          >
            <slot :name="column.key" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
