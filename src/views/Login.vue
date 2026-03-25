<template>
  <div class="login-wrapper" :style="backgroundStyle">
    <div class="login-overlay">
      <div class="login-card">
        <div class="brand">
         <img :src="logoImg" alt="Logo" class="login-logo" />
          <h2>Admin Portal</h2>
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="admin@lawnmarketplace.com" required />
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input v-model="password" type="password" placeholder="••••••••" required />
          </div>
          
          <button type="submit" class="btn btn-primary login-btn" :disabled="loading">
            {{ loading ? 'Signing In...' : 'Login' }}
          </button>
        </form>
        
        <p v-if="error" class="error-msg">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Import local assets
import logo from '@/assets/logo.png';
import bgImage from '@/assets/login-bg.png';

const backgroundStyle = {
  backgroundImage: `url(${bgImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
};

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = "Invalid credentials or insufficient permissions.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper { height: 100vh; background-size: cover; background-position: center; }
.login-overlay { height: 100%; width: 100%; background: rgba(44, 62, 80, 0.85); display: flex; align-items: center; justify-content: center; }
.login-card { background: white; padding: 40px; border-radius: 12px; width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.admin-logo { width: 80px; margin-bottom: 10px; }
.brand { text-align: center; margin-bottom: 30px; }
.login-btn { width: 100%; padding: 12px; margin-top: 10px; }
.error-msg { color: #e74c3c; text-align: center; margin-top: 15px; font-weight: 500; }
</style>