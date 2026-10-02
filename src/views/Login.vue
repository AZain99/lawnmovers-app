<template>
  <div class="login-wrapper">
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
import { db, auth } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDevice } from '@/composables/useDevice';

import logo from '@/assets/logo.png';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const { getDeviceType } = useDevice();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const userEmail = userCredential.user.email;

    const adminQuery = query(
      collection(db, 'admin'),
      where('email', '==', userEmail),
      limit(1)
    );

    const querySnapshot = await getDocs(adminQuery);

    if (!querySnapshot.empty) {
      // Detect device type and route accordingly
      const deviceType = getDeviceType();
      localStorage.setItem('deviceType', deviceType);
      
      if (deviceType === 'mobile' || deviceType === 'tablet') {
        router.push('/mobile/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      error.value = 'Access denied. You are not registered as an admin.';
    }
  } catch (err) {
    error.value = 'Invalid credentials or system error.';
    console.error('Login Error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top left, rgba(46, 204, 113, 0.20), transparent 30%),
    radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.24), transparent 30%),
    linear-gradient(135deg, #eaf9f1 0%, #dfeee6 30%, #eff7f2 100%);
  padding: 20px;
  box-sizing: border-box;
}

.login-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.login-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 42px 32px;
  border-radius: 28px;
  width: min(100%, 380px);
  border: 1px solid rgba(26, 39, 47, 0.08);
  text-align: center;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
}

.login-logo {
  width: 130px;
  margin-bottom: 28px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.form-group {
  margin-bottom: 18px;
  text-align: left;
}

input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.38);
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus {
  border-color: rgba(46, 204, 113, 0.8);
  box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.10);
}

input::placeholder {
  color: #64748b;
}

.forgot-link {
  text-align: right;
  margin-top: 8px;
}

.forgot-link a {
  color: #2563eb;
  font-size: 12px;
  text-decoration: none;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #1f9d55, #18a86d);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.login-btn:hover {
  opacity: 0.96;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.error-msg {
  color: #dc2626;
  margin-top: 15px;
  font-size: 14px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    border-radius: 22px;
  }

  .login-logo {
    width: 110px;
  }
}
</style>