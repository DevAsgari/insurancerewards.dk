<template>
  <div class="data-table-wrapper">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead class="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="['table-header', `text-${column.align || 'left'}`]">
              {{ column.header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Empty state -->
          <tr v-if="data.length === 0 && !loading">
            <td :colspan="columns.length" class="table-cell text-center py-8">
              <slot name="empty">
                <span class="text-gray-500">{{ emptyMessage }}</span>
              </slot>
            </td>
          </tr>

          <!-- Loading state -->
          <tr v-if="loading">
            <td :colspan="columns.length" class="table-cell text-center py-8">
              <slot name="loading">
                <span class="text-gray-500">Loading...</span>
              </slot>
            </td>
          </tr>

          <!-- Data rows -->
          <tr
            v-for="(row, rowIndex) in data"
            :key="getRowKey(row, rowIndex)"
            class="border-b border-gray-200 hover:bg-gray-50"
            :class="rowClass"
            style="transition: background-color var(--transition-normal)"
            @click="handleRowClick(row)">
            <td
              v-for="column in columns"
              :key="column.key"
              :class="['table-cell', `text-${column.align || 'left'}`]">
              <!-- Custom slot for this cell -->
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :column="column">
                <!-- Default: Use formatter if provided, otherwise raw value -->
                {{ column.format ? column.format(row[column.key], row) : row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataTableColumn<T = Record<string, any>> {
  key: string
  header: string
  align?: 'left' | 'center' | 'right'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format?: (value: any, row: T) => string
  sortable?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props<T extends Record<string, any>> {
  columns: DataTableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  rowKey?: string
  rowClass?: string
}

const props = withDefaults(defineProps<Props<T>>(), {
  loading: false,
  emptyMessage: 'No data available',
  rowKey: 'id',
  rowClass: ''
})

const emit = defineEmits<{
  'row-click': [row: T]
}>()

const getRowKey = (row: T, index: number) => {
  return props.rowKey && row[props.rowKey] ? row[props.rowKey] : index
}

const handleRowClick = (row: T) => {
  emit('row-click', row)
}
</script>

<style scoped>
/* Table wrapper */
.data-table-wrapper {
  width: 100%;
}

/* Table header */
.table-header {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: var(--text-lg);
  color: var(--color-gray-700);
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .table-header {
    padding: 0.875rem;
  }
}

/* Table cell */
.table-cell {
  padding: 1rem;
  color: var(--color-gray-900);
  font-size: var(--text-lg);
}

@media (max-width: 1024px) {
  .table-cell {
    padding: 0.875rem;
  font-size: var(--text-sm);
  }
}

/* Table action buttons */
:deep(.table-action-btn) {
  border: 0;
  background: transparent;
  color: var(--color-gray-500);
  cursor: pointer;
  border-radius: 0.125rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

:deep(.table-action-btn:active) {
  transform: scale(0.95);
}

:deep(.table-action-btn-edit:hover) {
  background: var(--color-info-light);
  color: var(--color-info);
}

:deep(.table-action-btn-delete:hover) {
  background: var(--color-error-light);
  color: var(--color-error);
}

/* Rating badge */
:deep(.rating-badge) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: rgba(102, 126, 234, 0.1);
  color: var(--color-brand-purple);
  font-weight: 600;
  font-size: var(--text-lg);
}
</style>
