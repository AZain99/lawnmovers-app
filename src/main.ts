import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Import your initialized Firebase services
import { auth } from './firebase'; // This points to the new firebase.ts file
import { onAuthStateChanged } from 'firebase/auth';

// Global Styles
import './assets/styles.css';
import './assets/mobile-styles.css';

const clickOutsideDirective = {
  beforeMount(el: any, binding: any) {
    const handler = (event: Event) => {
      if (!el.contains(event.target)) {
        binding.value(event);
      }
    };
    el.__clickOutside__ = handler;
    document.addEventListener('click', handler);
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.__clickOutside__);
  },
};

const app = createApp(App);

app.directive('click-outside', clickOutsideDirective);
app.use(createPinia());
app.use(router);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Admin is logged in:', user.email);
  } else {
    console.log('No active session.');
  }
});

app.mount('#app');

console.log("Vue App Mounted");