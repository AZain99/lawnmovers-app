import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Import your initialized Firebase services
import { auth } from './firebase'; // This points to the new firebase.ts file
import { onAuthStateChanged } from 'firebase/auth';

// Global Styles
import './assets/styles.css';

let app: any;

/**
 * We wrap the app mount in an Auth observer. 
 * This ensures that if a user refreshes the page, 
 * Firebase restores their session before the router tries to protect a page.
 */
onAuthStateChanged(auth, (user) => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);

    app.mount('#app');
    
    console.log("Vue App Mounted");
  }

  if (user) {
    console.log("Admin is logged in:", user.email);
  } else {
    console.log("No active session.");
  }
});