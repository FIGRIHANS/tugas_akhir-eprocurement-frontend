<template>
  <div class="mx-auto">
    <div class="bg-white flex flex-col h-[500px] rounded-lg shadow">
      <!-- Chat Body -->
      <div ref="chatBody" class="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
        <div v-for="(msg, index) in messages" :key="index" class="max-w-[75%]"
          :class="msg.sender === 'me' ? 'ml-auto text-right' : ''">
          <!-- Nama + Tanggal -->
          <div class="text-[11px] mb-1 text-gray-500">
            {{ msg.senderName }} • {{ msg.date }}
          </div>

          <!-- Bubble -->
          <div class="px-3 py-2 rounded-lg text-sm inline-block" :class="msg.sender === 'me'
            ? 'bg-primary text-white'
            : 'bg-white border'
            ">
            <div>{{ msg.text }}</div>
            <div class="text-[10px] mt-1 opacity-70">
              {{ msg.time }}
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-3 border-t flex gap-2">
        <input v-model="input" type="text" placeholder="Type a message..."
          class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-primary/20"
          @keydown.enter="sendMessage" />
        <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          @click="sendMessage">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

/* ======================
  TYPES
====================== */
interface ChatMessage {
  sender: 'me' | 'other'
  senderName: string
  text: string
  time: string
  date: string
}

/* ======================
  STATE
====================== */
const STORAGE_KEY = 'dummy_chat_vue'
const input = ref('')
const chatBody = ref<HTMLDivElement | null>(null)

const messages = ref<ChatMessage[]>(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
)

/* ======================
  HELPERS
====================== */
const getCurrentTime = () =>
  new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

const getCurrentDate = () =>
  new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

/* ======================
  METHODS
====================== */
const saveMessages = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
}

const scrollToBottom = async (): Promise<void> => {
  await nextTick()
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}

const sendMessage = (): void => {
  if (!input.value.trim()) return

  messages.value.push({
    sender: 'me',
    senderName: 'User A',
    text: input.value,
    time: getCurrentTime(),
    date: getCurrentDate(),
  })

  input.value = ''
  saveMessages()
  scrollToBottom()

  setTimeout(simulateReply, 900)
}

const simulateReply = (): void => {
  messages.value.push({
    sender: 'other',
    senderName: 'User B',
    text: 'Pesan diterima 👍',
    time: getCurrentTime(),
    date: getCurrentDate(),
  })

  saveMessages()
  scrollToBottom()
}

/* ======================
  WATCH
====================== */
watch(
  messages,
  () => {
    saveMessages()
  },
  { deep: true }
)

/* ======================
  INIT
====================== */
onMounted(() => {
  if (messages.value.length === 0) {
    messages.value.push({
      sender: 'other',
      senderName: 'User B',
      text: 'Halo 👋 Ini dummy chat',
      time: getCurrentTime(),
      date: getCurrentDate(),
    })
    saveMessages()
  }

  scrollToBottom()
})
</script>

<style scoped>
.bg-primary {
  background-color: #1b84ff;
}

.bg-primary-dark {
  background-color: #1667c0;
}
</style>