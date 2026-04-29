<template>
  <AppLayout>
    <div class="header">
      <div>
        <div class="page-title">帮助中心</div>
        <div class="page-subtitle">快速了解使用方式、功能说明与常见问题。</div>
      </div>
      <button class="btn-primary" @click="openFeedback">意见反馈</button>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-title">使用指南</div>
        <ol class="steps">
          <li>登录/注册账号（演示版为前端模拟）。</li>
          <li>在“宠物档案”中添加一只或多只宠物。</li>
          <li>在“声音检测”中选择宠物并上传 MP3/WAV 音频（≤50MB）。</li>
          <li>点击“开始检测”，查看情绪识别与健康评估报告。</li>
          <li>在“历史记录”中追踪近期检测趋势，随时查看与删除记录。</li>
        </ol>
      </div>

      <div class="card">
        <div class="card-title">功能说明</div>
        <div class="feature">
          <div class="f-title">音频 SDK + 大语言模型</div>
          <div class="f-desc">
            通过音频特征提取与语义推理，辅助识别宠物情绪状态并给出健康建议。
          </div>
        </div>
        <div class="feature">
          <div class="f-title">报告解读</div>
          <div class="f-desc">
            情绪标签与置信度用于辅助判断；健康评估与建议用于日常养护参考。
          </div>
        </div>
        <div class="feature">
          <div class="f-title">隐私与数据</div>
          <div class="f-desc">
            演示版数据仅保存在浏览器本地（localStorage），仅当前用户可见。
          </div>
        </div>
      </div>

      <div class="card wide">
        <div class="card-title">常见问题（FAQ）</div>
        <div class="faq">
          <div class="qa">
            <div class="q">Q：支持哪些音频格式与大小？</div>
            <div class="a">A：支持 MP3/WAV，单文件不超过 50MB。</div>
          </div>
          <div class="qa">
            <div class="q">Q：为什么必须先添加宠物？</div>
            <div class="a">A：检测结果需要绑定宠物档案，便于后续查看与对比。</div>
          </div>
          <div class="qa">
            <div class="q">Q：报告结果是否等同于医疗诊断？</div>
            <div class="a">A：不是。报告用于健康辅助评估，如有持续异常建议及时就医。</div>
          </div>
          <div class="qa">
            <div class="q">Q：历史记录如何筛选？</div>
            <div class="a">A：在“历史记录”页可选择近 7 天或近 30 天查看。</div>
          </div>
        </div>
      </div>
    </div>

    <BaseModal :open="feedback.open" title="意见反馈" @close="closeFeedback">
      <div class="form">
        <div class="field">
          <div class="label">邮箱（可选）</div>
          <input v-model.trim="feedbackForm.email" class="input" placeholder="name@example.com" />
        </div>
        <div class="field">
          <div class="label">反馈内容</div>
          <textarea
            v-model.trim="feedbackForm.content"
            class="input textarea"
            rows="5"
            placeholder="欢迎提出建议或问题（不少于 5 个字）"
          />
          <div v-if="feedbackTouched && feedbackError" class="error">{{ feedbackError }}</div>
        </div>
        <div v-if="feedbackMsg" class="msg">{{ feedbackMsg }}</div>
      </div>

      <template #footer>
        <button class="btn-secondary" @click="closeFeedback">取消</button>
        <button class="btn-primary" :disabled="sending || !canSend" @click="sendFeedback">
          {{ sending ? '提交中...' : '提交' }}
        </button>
      </template>
    </BaseModal>
  </AppLayout>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import AppLayout from '../../components/AppLayout.vue'
import BaseModal from '../../components/BaseModal.vue'
import { submitFeedback } from '../../utils/mockApi'

const feedback = reactive({ open: false })
const feedbackForm = reactive({ email: '', content: '' })
const sending = ref(false)
const feedbackTouched = ref(false)
const feedbackMsg = ref('')

const feedbackError = computed(() => {
  if (!feedbackForm.content) return '请输入反馈内容'
  if (feedbackForm.content.length < 5) return '内容至少 5 个字'
  return ''
})

const canSend = computed(() => !feedbackError.value)

function openFeedback() {
  feedback.open = true
  feedbackForm.email = ''
  feedbackForm.content = ''
  feedbackTouched.value = false
  feedbackMsg.value = ''
}

function closeFeedback() {
  feedback.open = false
}

async function sendFeedback() {
  feedbackTouched.value = true
  feedbackMsg.value = ''
  if (!canSend.value) return

  sending.value = true
  try {
    await submitFeedback({ email: feedbackForm.email, content: feedbackForm.content })
    feedbackMsg.value = '已收到反馈，感谢你的建议！'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 22px;
  font-weight: 800;
  color: #333333;
}

.page-subtitle {
  margin-top: 8px;
  font-size: 18px;
  color: #666666;
  line-height: 1.8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.card {
  border: 1px solid #eaecef;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px 24px;
}

.card.wide {
  grid-column: 1 / -1;
}

.card-title {
  font-size: 18px;
  font-weight: 800;
  color: #333333;
  margin-bottom: 12px;
}

.steps {
  margin: 0;
  padding-left: 18px;
  color: #333333;
  line-height: 1.9;
  font-size: 14px;
}

.feature + .feature {
  margin-top: 12px;
}

.f-title {
  font-size: 14px;
  font-weight: 800;
  color: #111827;
}

.f-desc {
  margin-top: 6px;
  font-size: 13px;
  color: #666666;
  line-height: 1.8;
}

.faq {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.qa {
  border: 1px solid #eaecef;
  border-radius: 12px;
  background: #f7f8fa;
  padding: 12px;
}

.q {
  font-size: 14px;
  font-weight: 800;
  color: #333333;
}

.a {
  margin-top: 8px;
  font-size: 13px;
  color: #666666;
  line-height: 1.8;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.label {
  font-size: 13px;
  color: #666666;
  margin-bottom: 6px;
}

.input {
  width: 100%;
  border: 1px solid #dddddd;
  background: #fff;
  padding: 12px 14px;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  resize: none;
}

.textarea {
  line-height: 1.8;
}

.input:focus {
  border-color: rgba(22, 119, 255, 0.65);
  box-shadow: 0 0 0 4px rgba(22, 119, 255, 0.12);
}

.error {
  margin-top: 8px;
  font-size: 12px;
  color: #ef4444;
}

.msg {
  font-size: 13px;
  color: #059669;
  background: rgba(5, 150, 105, 0.08);
  border: 1px solid rgba(5, 150, 105, 0.25);
  padding: 10px 12px;
  border-radius: 10px;
}

.btn-primary {
  background: #1677ff;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary:hover {
  transform: translateY(-1px);
  background: #0f6ef3;
  box-shadow: 0 10px 24px rgba(22, 119, 255, 0.28);
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #fff;
  border: 1px solid #dddddd;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #333333;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f7f8fa;
  color: #333333;
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

