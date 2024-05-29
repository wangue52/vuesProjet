<script setup>
import axios from '@/axios';
import { useRouter } from 'vue-router';
const router=useRouter() ;

const name = ref('');
const username = ref('');
const email = ref('');
const type = ref(0);
const phone = ref('');
const address = ref('');
const avatar = ref(null);
const matricule = ref('');
const email_verified_at = ref(null);
const password = ref('');

const submitForm = async () => {
  try {
    const response = await axios.post('/users', {
      name: name.value,
      username: username.value,
      email: email.value,
      type: type.value,
      phone: phone.value,
      address: address.value,
      avatar: avatar.value,
      matricule: matricule.value,
      email_verified_at: email_verified_at.value,
      password: password.value
    });
    console.log(response);
    router.push('/users');
    const formData = new FormData();
    formData.append('avatar', avatar.value);
 const uploadResponse = await axios.post('/users/' + response.data.id + '/avatar', formData);

    console.log(uploadResponse);
  } catch (error) {
    console.error(error);
    const alert = document.createElement('div');
    alert.classList.add('alert', 'alert-danger');
    alert.textContent = 'An error occurred while submitting the form. Please try again later.';
    document.body.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
};
</script>
  <template>
    <VRow>
     <VCol
       cols="12"
       md="6"
     >
   <VCard title="ajouter un utilisateur">
         <VCardText>
            <VForm @submit.prevent="submitForm">
      <VRow>
        <!-- 👉 Name -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="name"
            label="Name"
            placeholder="John Doe"
            aria-required="true"
          />
        </VCol>
  
        <!-- 👉 Username -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="username"
            label="Username"
            placeholder="johndoe"
          />
        </VCol>
  
        <!-- 👉 Email -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="email"
            label="Email"
            placeholder="johndoe@email.com"
          />
        </VCol>
  
        <!-- 👉 Type -->
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="type"
            :items="['User', 'Admin', 'Super Admin']"
            label="Type"
            placeholder="Select type"
          />
        </VCol>
  
        <!-- 👉 Phone -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="phone"
            label="Phone"
            placeholder="+1234567890"
          />
        </VCol>
  
        <!-- 👉 Address -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextarea
            v-model="address"
            label="Address"
            placeholder="123 Main St, New York, NY 10001"
          />
        </VCol>
  
        <!-- 👉 Avatar -->
        <VCol
          cols="12"
          md="6"
        >
          <VFileInput
            v-model="avatar"
            label="Avatar"
            placeholder="Select avatar"
          />
        </VCol>
  
        <!-- 👉 Matricule -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="matricule"
            label="Matricule"
            placeholder="123456"
          />
        </VCol>
  
        <!-- 👉 Email verified at -->

  
        <!-- 👉 Password -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="password"
            label="Password"
            placeholder="Enter password"
            type="password"
          />
        </VCol>
  
        <VCol
          cols="12"
          class="d-flex gap-4"
        >
          <VBtn type="submit">
            Submit
          </VBtn>
  
          <VBtn
            type="reset"
            color="secondary"
            variant="outlined"
          >
            Reset
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
         </VCardText>
       </VCard>
     </VCol>
   </VRow>
 </template>
 <style scoped>
 .alert {
   position: fixed;
   bottom: 20px;
   left: 20px;
   padding: 10px 20px;
   border-radius: 5px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
 }
 
 .alert-danger {
   background-color: #f44336;
   color: #fff;
 }
 </style>
 