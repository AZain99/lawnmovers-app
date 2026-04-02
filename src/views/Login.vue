<template>
  <div class="login-wrapper" :style="backgroundStyle">
    <div class="login-container">
      <div class="login-card">
        <div class="brand">
          <img :src="logo" alt="Lawn Tamers Logo" class="login-logo" />
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <input 
              v-model="email" 
              type="email" 
              placeholder="Email address" 
              required 
            />
          </div>
          
          <div class="form-group">
            <input 
              v-model="password" 
              type="password" 
              placeholder="Password" 
              required 
            />
            <div class="forgot-link">
              <a href="#">Forgot Password ?</a>
            </div>
          </div>
          
          <button type="submit" class="login-btn" :disabled="loading">
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
import { db, auth } from '@/firebase'; // Ensure db is exported from your firebase.js
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth';

import logo from '@/assets/logo.png';
import bgImage from '@/assets/login-bg.png';

// Fixed variable reference to bgImage
const backgroundStyle = {
  backgroundImage: `url(${bgImage})`,
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
    // 1. Sign in with Auth
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const userEmail = userCredential.user.email;

    // 2. Validate against Firestore 'admin' collection
    const adminQuery = query(
      collection(db, "admin"), 
      where("email", "==", userEmail),
      limit(1) 
    );

    const querySnapshot = await getDocs(adminQuery);

    if (!querySnapshot.empty) {
      router.push('/dashboard');
    } else {
      // If email exists in Auth but not in 'admin' collection
      error.value = "Access denied. You are not registered as an admin.";
    }
  } catch (err) {
    error.value = "Invalid credentials or system error.";
    console.error("Login Error:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Glassmorphism Card */
.login-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 50px 40px;
  border-radius: 40px; /* Highly rounded corners per image */
  width: 380px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
}

.login-logo {
  width: 130px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

input {
  width: 100%;
  padding: 14px 20px;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
}

input::placeholder {
  color: #888;
}

.forgot-link {
  text-align: right;
  margin-top: 8px;
}

.forgot-link a {
  color: #4a90e2;
  font-size: 12px;
  text-decoration: none;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background-color: #1f9d55; /* Match the green in the image */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.3s;
}

.login-btn:hover {
  background-color: #167e43;
}

.error-msg {
  color: #ff4d4d;
  margin-top: 15px;
  font-size: 14px;
}
</style>