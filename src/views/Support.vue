<template>
  <div class="support-view">
    <h2>🎫 Support Tickets</h2>
    
    <div class="ticket-container">
      <div class="card ticket-list">
        <div 
          v-for="ticket in tickets" 
          :key="ticket.id" 
          :class="['ticket-item', { active: selectedTicket?.id === ticket.id }]"
          @click="selectedTicket = ticket"
        >
          <div class="ticket-meta">
            <span class="ticket-id">#{{ ticket.id }}</span>
            <span :class="['badge', `badge-${ticket.status}`]">{{ ticket.status }}</span>
          </div>
          <h4>{{ ticket.subject }}</h4>
          <p>{{ ticket.lastMessage }}</p>
        </div>
      </div>

      <div class="card ticket-chat" v-if="selectedTicket">
        <div class="chat-header">
          <h3>{{ selectedTicket.subject }}</h3>
          <span>User: {{ selectedTicket.userName }}</span>
        </div>
        
        <div class="chat-history">
          <div v-for="msg in selectedTicket.messages" :key="msg.timestamp" 
               :class="['msg', msg.sender === 'admin' ? 'sent' : 'received']">
            <p>{{ msg.text }}</p>
            <small>{{ new Date(msg.timestamp).toLocaleTimeString() }}</small>
          </div>
        </div>

        <div class="chat-input">
          <textarea v-model="replyText" placeholder="Type your response..."></textarea>
          <button class="btn btn-primary" @click="sendReply">Send Reply</button>
        </div>
      </div>

      <div class="card empty-state" v-else>
        <p>Select a ticket to view conversation</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import adminApi from '../api/adminService';
// import adminApi from '../api/mockService';

const tickets = ref([
  { 
    id: 'T-501', 
    subject: 'Cannot add payment method', 
    userName: 'John Doe',
    status: 'open',
    lastMessage: 'I keep getting an error on the card screen...',
    messages: [
      { sender: 'user', text: 'I keep getting an error on the card screen', timestamp: Date.now() - 100000 }
    ]
  }
]);

const selectedTicket = ref(null);
const replyText = ref('');

const sendReply = async () => {
  if (!replyText.value) return;
  // Push to local UI
  selectedTicket.value.messages.push({
    sender: 'admin',
    text: replyText.value,
    timestamp: Date.now()
  });
  // API Call
  await adminApi.post(`/support/${selectedTicket.value.id}/reply`, { text: replyText.value });
  replyText.value = '';
};
</script>

<style scoped>
.ticket-container { display: grid; grid-template-columns: 350px 1fr; gap: 20px; height: 70vh; }
.ticket-list { overflow-y: auto; padding: 0; }
.ticket-item { padding: 15px; border-bottom: 1px solid #eee; cursor: pointer; transition: 0.2s; }
.ticket-item:hover { background: #f9f9f9; }
.ticket-item.active { border-left: 4px solid var(--primary-green); background: #f0fff4; }

.chat-history { height: 300px; overflow-y: auto; padding: 20px; background: #f8f9fa; border-radius: 8px; margin-bottom: 15px; }
.msg { margin-bottom: 15px; max-width: 70%; padding: 10px; border-radius: 10px; }
.sent { margin-left: auto; background: var(--primary-green); color: white; }
.received { background: #e9ecef; }

.chat-input textarea { width: 100%; height: 80px; padding: 10px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 10px; }
</style>