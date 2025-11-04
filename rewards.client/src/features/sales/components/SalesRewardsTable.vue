<template>
  <div class="bg-white rounded-2xl overflow-visible shadow-md mb-8">
    <div class="card-header rounded-2xl rounded-b-none" style="background: var(--gradient-accent)">
      <div>
        <h3 class="text-xl md:text-2xl lg:text-3xl font-bold">Sales & Rewards</h3>
        <p v-if="strategyName" class="text-base md:text-lg lg:text-xl opacity-90">
          Strategy: {{ strategyName }}
        </p>
        <PhTrophy :size="md" class="icon-white mt-2" weight="fill" />
      </div>
    </div>

    <div class="p-8 lg:p-6 md:p-6 sm:p-4">
      <DataTable
        :columns="columns"
        :data="sales"
        row-key="id"
        empty-message="No sales recorded yet"
      >
        <!-- Custom cell for rating badge -->
        <template #cell-customerSatisfaction="{ value }">
          <span class="rating-badge">
            {{ value }}
          </span>
        </template>

        <!-- Custom cell for reward with styling -->
        <template #cell-rewardValue="{ value }">
          <span class="text-success font-bold">{{ formatReward(value) }}</span>
        </template>

        <!-- Custom cell for actions -->
        <template #cell-actions="{ row }">
          <div class="flex gap-2 justify-start items-center">
            <button
              class="table-action-btn table-action-btn-edit"
              @click="handleEdit(row)"
              aria-label="Edit sale"
              title="Edit sale"
            >
              <PhPencilSimpleLine :size="xs" />
            </button>
            <button
              class="table-action-btn table-action-btn-delete"
              @click="handleDelete(row.id)"
              aria-label="Delete sale"
              title="Delete sale"
            >
              <PhTrash :size="xs" />
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Total Reward Bar -->
    <div
      v-if="hasRewards"
      class="card-header rounded-2xl rounded-t-none flex items-center justify-between"
      style="background: var(--gradient-accent)"
    >
      <div class="flex items-center gap-3">
        <span class="text-base md:text-lg lg:text-xl font-bold">Total Reward</span>
      </div>
      <span class="text-lg md:text-xl lg:text-2xl font-bold">{{ formatReward(totalReward) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from "vue";
import type { Sale } from "@/features/sales/types";
import { formatDateISO, formatCurrency } from "@/utils";
import { PhTrash, PhPencilSimpleLine, PhTrophy } from "@phosphor-icons/vue";
import { useIconSizes } from "@/shared/composables";
import { DataTable, type DataTableColumn } from "@/shared/components";

export default defineComponent({
  name: "SalesRewardsTable",
  components: {
    PhPencilSimpleLine,
    PhTrash,
    PhTrophy,
    DataTable,
  },
  props: {
    sales: {
      type: Array as PropType<Sale[]>,
      required: true,
    },
    hasRewards: {
      type: Boolean,
      required: true,
    },
    totalReward: {
      type: Number,
      required: true,
    },
    strategyName: {
      type: String,
      default: "",
    },
  },
  emits: ["delete", "edit"],
  setup(props, { emit }) {
    const { xs, md } = useIconSizes();
    const formatReward = formatCurrency;

    // Define table columns
    const columns = computed<DataTableColumn<Sale>[]>(() => [
      {
        key: "saleType",
        header: "Insurance",
        align: "left",
      },
      {
        key: "saleDate",
        header: "Date",
        align: "left",
        format: (value) => formatDateISO(value as string),
      },
      {
        key: "price",
        header: "Price",
        align: "left",
        format: (value) => `$${(value as number).toFixed(2)}`,
      },
      {
        key: "customerSatisfaction",
        header: "Rating",
        align: "left",
        // Custom rendering via slot
      },
      {
        key: "rewardValue",
        header: "Reward",
        align: "left",
        // Custom rendering via slot
      },
      {
        key: "actions",
        header: "Actions",
        align: "center",
        // Custom rendering via slot
      },
    ]);

    const handleEdit = (sale: Sale) => {
      emit("edit", sale);
    };

    const handleDelete = (saleId: string) => {
      emit("delete", saleId);
    };

    return {
      xs,
      md,
      columns,
      formatReward,
      handleEdit,
      handleDelete,
    };
  },
});
</script>
