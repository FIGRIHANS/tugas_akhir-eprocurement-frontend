<template>
    <div class="mx-auto">
      <div
        class="bg-white flex flex-col "
      >
        <!-- Header -->
        <!-- <div
          class="px-4 py-3 border-b font-semibold text-gray-700 flex items-center gap-2"
        >
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          Dummy Chat (Demo)
        </div> -->
  
        <!-- Chat Body -->
        <div
          ref="chatBody"
          class="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50"
        >
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="max-w-[75%] px-3 py-2 rounded-lg text-sm"
            :class="
              msg.sender === 'me'
                ? 'ml-auto bg-primary text-white'
                : 'bg-white border'
            "
          >
            <div>{{ msg.text }}</div>
            <div class="text-[10px] mt-1 opacity-70">
              {{ msg.time }}
            </div>
          </div>
        </div>
  
        <!-- Input -->
        <div class="p-3 border-t flex gap-2">
          <input
            v-model="input"
            type="text"
            placeholder="Type a message..."
            class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-primary/20"
            @keydown.enter="sendMessage"
          />
          <button
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            @click="sendMessage"
          >
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
    text: string
    time: string
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
      text: input.value,
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    })
  
    input.value = ''
    saveMessages()
    scrollToBottom()
  
    setTimeout(simulateReply, 900)
  }
  
  const simulateReply = (): void => {
    messages.value.push({
      sender: 'other',
      text: 'Pesan diterima 👍',
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
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
        text: 'Halo 👋 Ada yang bisa dibantu?',
        time: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
      saveMessages()
    }
  
    scrollToBottom()
  })
  </script>
  
  <style scoped>
  .bg-primary {
    background-color: #1b84ff; /* Metronic primary */
  }
  .bg-primary-dark {
    background-color: #1667c0;
  }
  </style>
  