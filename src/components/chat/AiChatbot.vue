<template>
  <div class="fixed bottom-6 right-6 z-[9999] font-sans">
    <!-- Chat Window -->
    <Transition name="fade-slide">
      <div
        v-if="isOpen"
        class="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        style="height: 500px;"
      >
        <!-- Header -->
        <div class="bg-teal-500 text-white p-4 flex items-center justify-between shadow-sm z-10">
          <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a3 3 0 0 1 3 3v2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2v1a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h2V10a3 3 0 0 1 3-3h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2Zm-3 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
              </svg>
            <div>
              <h3 class="font-semibold text-sm m-0 leading-tight">AI Assistant</h3>
              <p class="text-[11px] text-teal-100 m-0">E-Procurement Bot</p>
            </div>
          </div>
          <button @click="isOpen = false" class="text-white/80 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <!-- Chat History -->
        <div class="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4" ref="chatContainer">
          <div v-if="messages.length === 0" class="text-center flex flex-col items-center justify-center h-full opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12 text-gray-300 mb-2">
              <path fill-rule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clip-rule="evenodd" />
            </svg>
            <span class="text-xs text-gray-500">
              Type a question to start searching for<br/>invoice, logistics, or tax data!
            </span>
          </div>

          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="flex flex-col max-w-[85%]"
            :class="msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'"
          >
            <span class="text-[10px] text-gray-400 mb-1 px-1 font-medium">
              {{ msg.sender === 'user' ? 'You' : 'AI Assistant' }}
            </span>
            <div
              class="px-4 py-2.5 rounded-2xl text-[13px] shadow-sm leading-relaxed"
              :class="msg.sender === 'user' ? 'bg-teal-500 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'"
              style="white-space: pre-wrap;"
            >
              {{ msg.text }}
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isLoading" class="self-start items-start flex flex-col max-w-[85%] mt-1">
            <div class="px-4 py-3.5 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
              <div class="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
              <div class="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
              <div class="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
            </div>
          </div>
        </div>

        <!-- Input Box -->
        <div class="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Ask about e-Procurement data..."
            class="flex-1 bg-slate-50 border border-gray-200 rounded-full px-4 py-2.5 text-[13px] focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-gray-400"
            :disabled="isLoading"
          />
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim() || isLoading"
            class="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 relative right-[-1px]">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Floating Action Button (FAB) -->
    <button
      @click="isOpen = !isOpen"
      class="w-14 h-14 bg-teal-500 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-teal-600 transition-all duration-300 flex items-center justify-center relative"
      :class="{ 'rotate-12': !isOpen, 'scale-90': isOpen }"
    >
      <!-- Optional notification dot -->
      <span v-if="!isOpen && messages.length === 0" class="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
      
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
        <path fill-rule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clip-rule="evenodd" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-8 h-8">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import axios from 'axios';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

const isOpen = ref(false);
const isLoading = ref(false);
const newMessage = ref('');
const messages = ref<ChatMessage[]>([]);
const chatContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return;

  const userText = newMessage.value.trim();
  messages.value.push({ text: userText, sender: 'user' });
  newMessage.value = '';
  isLoading.value = true;
  await scrollToBottom();

  try {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("n8n Webhook URL is not configured in .env");
    }

    // Mengirim payload dengan format yang diminta oleh n8n Chat Trigger
    const response = await axios.post(`${webhookUrl}?action=sendMessage`, {
      sessionId: "vue-session-12345", // Session statis sederhana
      chatInput: userText
    });

    let botReply = "Sorry, I could not understand the response from the server.";
    
    // n8n Chat Trigger biasanya mereturn respon dalam format langsung berupa text
    // atau jika menggunakan Webhook, ada properti output.
    if (response.data && response.data.output) {
      botReply = response.data.output;
    } else if (typeof response.data === 'string') {
      botReply = response.data;
    } else if (response.data && response.data.text) { // Terkadang Chat Trigger me-return .text
      botReply = response.data.text;
    } else {
      botReply = JSON.stringify(response.data);
    }

    messages.value.push({ text: botReply, sender: 'bot' });
  } catch (error: any) {
    console.error("Chatbot Error:", error);
    messages.value.push({ 
      text: "Sorry, failed to reach the AI Agent. (Ensure URL and n8n are active)", 
      sender: 'bot' 
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: bottom right;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(30px);
}
</style>
