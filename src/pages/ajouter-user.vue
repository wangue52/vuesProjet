<script setup>
import axios from '@/axios';
import { ref } from 'vue';
import { useTheme } from 'vuetify';

const { global } = useTheme()

// Define refs for form fields
const isPasswordVisible= ref(false) ;
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const errorMessage = ref('');
const showErrorName = ref(false);
const showErrorEmail = ref(false);
const showErrorPassword = ref(false);
const showErrorAvatar = ref(false);
const previewImage = ref('');
const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  type: '',
  phone: '',
  address: '',
  avatar: null,
});

const resetForm = () => {
  form.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    type: '',
    phone: '',
    address: '',
    avatar: null,
  };
  previewImage.value = '';

  // Clear the file input element
  const fileInput = document.getElementById('avatar');
  if (fileInput) {
    fileInput.value = null;
  }
};

const handleFileChange = (event) => {
  form.value.avatar = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(form.value.avatar);
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
};

const handleValidation = () => {
  showErrorName.value = form.value.name === '';
  showErrorEmail.value = form.value.email === '';
  showErrorPassword.value = form.value.password === '';
  showErrorAvatar.value = form.value.avatar === null;

  return !showErrorName.value && !showErrorEmail.value && !showErrorPassword.value && !showErrorAvatar.value;
};

const validateAndRegister = async () => {
  try {
    if (!handleValidation()) {
      return;
    }

    const formData = new FormData();
    for (const key in form.value) {
      if(Array.isArray(form.value[key])){
       form.value[key].array.forEach((file)=>{
        formData.append(key, file);
       }); 
      }else{
        formData.append(key, form.value[key]);
      }
    }

    const response = await axios.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 201) {
      showSuccessMessage.value = true;
      showErrorMessage.value = false;
      resetForm();
    } else {
      console.error('Unexpected response status:', response.status);
      showSuccessMessage.value = false;
      showErrorMessage.value = true;
      errorMessage.value = 'Une erreur inattendue est survenue.';
    }
  } catch (error) {
    if (error.isAxiosError && error.response) {
      console.error('Server validation errors:', error.response.data);
      errorMessage.value = error.response.data.message;
    } else {
      console.error('An error occurred:', error);
      errorMessage.value = 'Une erreur est survenue lors du traitement de votre demande.';
    }
    showSuccessMessage.value = false;
    showErrorMessage.value = true;
  }
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title>Inscription</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="validateAndRegister">
              <v-text-field
                v-model="form.name"
                label="Nom"
                :error-messages="showErrorName ? 'Le nom est requis' : ''"
                required
              />
              <v-text-field v-model="form.username" label="Nom d'utilisateur" required />
              <v-text-field
                v-model="form.email"
                label="Adresse e-mail"
                :error-messages="showErrorEmail ? 'L\'adresse e-mail est requise' : ''"
                required
              />
              <v-text-field
                v-model="form.password"
                label="Mot de passe"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                :error-messages="showErrorPassword ? 'Le mot de passe est requis' : ''"
                required
              />
              <v-select v-model="form.type" label="Type" :items="['agent', 'receveur', 'maire']" required />
              <v-text-field v-model="form.phone" label="Téléphone" required />
              <v-text-field v-model="form.address" label="Adresse" required />
              <v-file-input
                id="avatar"
                ref="avatar"
                v-model="form.avatar"
                label="Avatar"
                :error-messages="showErrorAvatar ? 'L\'avatar est requis' : ''"
                @change="handleFileChange"
                required
              />
              <v-img v-if="previewImage" :src="previewImage" max-width="100" max-height="100" />
              <v-btn type="submit" color="primary" class="mr-2">S'inscrire</v-btn>
              <v-btn @click="resetForm" color="secondary">Réinitialiser</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <v-alert v-if="showSuccessMessage" type="success" class="mt-4">Inscription réussie !</v-alert>
        <v-alert v-if="showErrorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.v-card {
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.v-card-text {
  padding: 24px;
}

.v-form {
  display: flex;
  flex-direction: column;
}

.v-text-field {
  margin-bottom: 16px;
}

.v-select {
  margin-bottom: 16px;
}

.v-file-input {
  margin-bottom: 16px;
}

.v-btn {
  margin-top: 8px;
}

.v-alert {
  margin-top: 16px;
}

.v-img {
  margin-top: 8px;
}
</style>
