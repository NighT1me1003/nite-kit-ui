<script setup lang="ts">
defineOptions({
  name: 'DocsApiTable',
})

export interface DocsApiRow {
  name: string
  description: string
  type?: string
  default?: string
  required?: boolean
}

export interface DocsApiSection {
  title: string
  rows: DocsApiRow[]
}

withDefaults(
  defineProps<{
    sections: DocsApiSection[]
    labels: {
      name: string
      description: string
      type: string
      default: string
      required: string
      requiredYes: string
      requiredNo: string
      empty: string
    }
  }>(),
  {},
)
</script>

<template>
  <div class="docs-api">
    <section v-for="section in sections" :key="section.title" class="docs-api__section">
      <h4>{{ section.title }}</h4>
      <div class="docs-api__table-wrap">
        <table class="docs-api__table">
          <thead>
            <tr>
              <th>{{ labels.name }}</th>
              <th>{{ labels.description }}</th>
              <th>{{ labels.type }}</th>
              <th>{{ labels.default }}</th>
              <th>{{ labels.required }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="section.rows.length === 0">
              <td colspan="5" class="docs-api__empty">{{ labels.empty }}</td>
            </tr>
            <tr v-for="row in section.rows" v-else :key="`${section.title}-${row.name}`">
              <td class="docs-api__name">
                <code>{{ row.name }}</code>
              </td>
              <td>{{ row.description }}</td>
              <td class="docs-api__type">
                <code v-if="row.type">{{ row.type }}</code>
                <span v-else>-</span>
              </td>
              <td class="docs-api__default">
                <code v-if="row.default">{{ row.default }}</code>
                <span v-else>-</span>
              </td>
              <td>
                <span class="docs-api__required" :class="{ 'docs-api__required--yes': row.required }">
                  {{ row.required ? labels.requiredYes : labels.requiredNo }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.docs-api {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.docs-api__section {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.docs-api__section h4 {
  margin: 0;
  color: rgba(247, 247, 251, 0.88);
  font-size: 15px;
  line-height: 1.25;
}

.docs-api__table-wrap {
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  background: rgba(3, 7, 18, 0.28);
}

.docs-api__table {
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  table-layout: fixed;
}

.docs-api__table th,
.docs-api__table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.065);
  padding: 12px 14px;
  text-align: left;
  vertical-align: top;
}

.docs-api__table th {
  color: rgba(247, 247, 251, 0.42);
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.docs-api__table th:nth-child(1) {
  width: 120px;
}

.docs-api__table th:nth-child(2) {
  width: 31%;
}

.docs-api__table th:nth-child(3) {
  width: 31%;
}

.docs-api__table th:nth-child(4) {
  width: 110px;
}

.docs-api__table th:nth-child(5) {
  width: 96px;
}

.docs-api__table td {
  color: rgba(247, 247, 251, 0.68);
  font-size: 13px;
  line-height: 1.55;
}

.docs-api__table tr:last-child td {
  border-bottom: 0;
}

.docs-api__table code {
  color: #a5f3fc;
  font-size: 12px;
  overflow-wrap: anywhere;
  white-space: normal;
}

.docs-api__name code,
.docs-api__default code {
  overflow-wrap: normal;
  white-space: nowrap;
  word-break: normal;
}

.docs-api__type code {
  line-height: 1.7;
}

.docs-api__empty {
  color: rgba(247, 247, 251, 0.44);
  font-weight: 800;
  text-align: center;
}

.docs-api__required {
  display: inline-flex;
  align-items: center;
  height: 24px;
  border: 1px solid rgba(34, 211, 238, 0.26);
  border-radius: 999px;
  background: rgba(6, 182, 212, 0.14);
  color: #a5f3fc;
  font-size: 11px;
  font-weight: 900;
  line-height: 1;
  padding: 0 9px;
}

.docs-api__required--yes {
  border-color: rgba(251, 191, 36, 0.3);
  background: rgba(245, 158, 11, 0.16);
  color: #fde68a;
}
</style>
