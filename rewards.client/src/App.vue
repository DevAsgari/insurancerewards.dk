<template>
  <div id="app">
    <router-view />
    <Snackbar
      :visible="snackbar.state.value.visible"
      :message="snackbar.state.value.message"
      :type="snackbar.state.value.type"
      @close="snackbar.hide"
    />
    <ConfirmDialog
      :visible="confirmDialog.state.value.visible"
      :title="confirmDialog.state.value.title"
      :message="confirmDialog.state.value.message"
      :confirmText="confirmDialog.state.value.confirmText"
      :cancelText="confirmDialog.state.value.cancelText"
      :type="confirmDialog.state.value.type"
      @confirm="confirmDialog.handleConfirm"
      @cancel="confirmDialog.handleCancel"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { Snackbar, ConfirmDialog } from '@/shared/components'
  import { useSnackbar, useConfirm } from '@/shared/composables'

  export default defineComponent({
    name: 'App',
    components: {
      Snackbar,
      ConfirmDialog
    },
    setup() {
      const snackbar = useSnackbar()
      const confirmDialog = useConfirm()

      return {
        snackbar,
        confirmDialog
      }
    }
  })
</script>

<style>
  @import './assets/styles/main.css';
</style>
