<!-- <script setup>
import axios from '@/axios';
import { useTheme } from 'vuetify';
const form = ref({
  email: '',
  password: '',
  remember: false,
})

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

const isPasswordVisible = ref(false)
const login = async () => {
  try {
    const res =  await axios.post('/auth/login', {
      method: 'POST',
      body: {
        email: credentials.value.email,
        password: credentials.value.password,
      },
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })

    const { accessToken, userData, userAbilityRules } = res

    useCookie('userAbilityRules').value = userAbilityRules
    ability.update(userAbilityRules)

    useCookie('userData').value = userData
    useCookie('accessToken').value = accessToken

    // Redirect to `to` query if exist or redirect to index route
    // ❗ nextTick is required to wait for DOM updates and later redirect
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/')
    })
  }
  catch (err) {
    console.error(err)
  }
}
</script> -->
<template>
  <div class="login-container d-flex vh-100">
    <div class="container-fluid d-flex justify-content-center align-items-center h-100">
      <div class="row">
        <div class="col-lg-6 d-flex justify-content-center align-items-center">
          <div class="card shadow rounded-3 p-5">
            <div class="logo mb-4">
              <img src="@images/logo.png" alt="logo" />
            </div>
            <h3 class="text-center mb-4">GESCOM</h3>
            <form @submit.prevent="login">
              <div class="form-group mb-3">
                <label for="email" class="form-label fw-bold">adresse email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="form.email"
                  required
                />
              </div>
              <div class="form-group mb-3 password-field">
                <label for="password" class="form-label fw-bold">Password</label>
                <div class="input-group">
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="form.password"
                    required
                    :class="{ 'is-visible': isPasswordVisible }"
                  />
                  <span class="input-group-text password-toggle" @click="isPasswordVisible = !isPasswordVisible">
                    <i v-if="isPasswordVisible" class="fas fa-eye-slash"></i>
                    <i v-else class="fas fa-eye"></i>
                  </span>
                </div>
                <small class="text-muted">au moins 9 caracteres requis.</small>
              </div>
              <div class="form-check mb-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="remember"
                  v-model="form.remember"
                />
                <label class="form-check-label" for="remember">se souvenir de moi</label>
              </div>
              <button type="submit" @click="authenticate" class="btn btn-primary w-100">Login</button>
            </form>
            <div v-if="error" class="alert alert-danger mt-3" role="alert">
              {{ error }}
            </div>
          </div>
        </div>
        <div class="col-lg-6 d-flex justify-content-center align-items-center">
          <div class="bg-light rounded-3 p-5">
            <img src="@images/logo.png" alt="Header Image" class="img-fluid">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from '@/axios';
import Cookies from 'universal-cookie';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const form = ref({
  email: '',
  password: '',
  remember: false,
});

const isPasswordVisible = ref(false);
const router = useRouter();
const route = useRoute();

const error = ref(null);

const cookies = new Cookies();

const login = async () => {
  try {
    const response = await axios.post('/auth/login', form.value, {
      onResponseError: (error) => {
        console.error('Error response:', error);
        error.value = 'An error occurred. Please try again later.'; // Generic error message for user
      },
    });

    const { accessToken,token_type ,type } = response.data;
    cookies.set('accessToken', accessToken);
    cookies.set('token_type', token_type); 
    cookies.set('type', type);
    const authenticate=()=>{
      localStorage.setItem('token',accessToken)};
    if (type === 'receveur') {
      const redirectTo = route.query.to || '/dashboard';
      authenticate();
       await router.replace(redirectTo);
    } else {
      await router.replace(route.query.to || '/liste-boutique'); 
    }
  } catch (err) {
    const countdownElement = document.createElement('div');
countdownElement.classList.add('alert', 'alert-warning', 'text-center');
countdownElement.textContent = 'email ou mot de passe invalide.';

function removeAlert() {
  if (countdownElement.parentElement) {
    countdownElement.parentElement.removeChild(countdownElement);
    clearInterval(countdownInterval);
  }
}
console.error('Error:', err); 

const countdownInterval = setInterval(removeAlert, 6000); 

const header = document.querySelector('.template'); 
if (header) {
  header.appendChild(countdownElement);
} else {
  console.warn('No suitable container found for alert. Appending to body.');
  document.body.appendChild(countdownElement);
}

  } finally {

    error.value = null;
  }
};

</script>
<style scoped>
.login-container {
  background-color: #f2f2f2;
}
.card {
  background-color: #fff;
  border: none;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  width: 350px;
}
.logo {
  text-align: center;
}
.logo img {
  width: 100px;
}
.password-field {
  position: relative;
}
.password-toggle {
  cursor: pointer;
}
.is-visible {
  border-bottom: 1px solid #ddd;
}
.input-group-text {
  border-left: none;
  border-radius: 0 5px 5px 0;
}
.bg-light {
  background-color: #f8f9fa;
  border-radius: 0 0 0 30px;
  width: 350px;
}
</style>
