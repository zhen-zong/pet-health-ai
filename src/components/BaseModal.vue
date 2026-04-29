<template>
  <teleport to="body">
    <div v-if="open" class="overlay" @click="onMaskClick">
      <div class="dialog" @click.stop>
        <div class="header">
          <div class="title">{{ title }}</div>
          <button class="icon-btn" @click="$emit('close')">✕</button>
        </div>
        <div class="body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const emit = defineEmits(['close'])

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  closeOnMask: { type: Boolean, default: true }
})

function onMaskClick() {
  if (!props.closeOnMask) return
  emit('close')
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 50;
}

.dialog {
  width: min(560px, 100%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #eaecef;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #f7f8fa;
  border-bottom: 1px solid #eaecef;
}

.title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.icon-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  border-color: rgba(22, 119, 255, 0.6);
  box-shadow: 0 0 0 4px rgba(22, 119, 255, 0.12);
}

.body {
  padding: 16px;
}

.footer {
  padding: 14px 16px;
  border-top: 1px solid #eaecef;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

