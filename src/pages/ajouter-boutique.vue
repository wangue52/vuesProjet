<script setup>
import axios from '@/axios';
import { useRouter } from 'vue-router';

const router = useRouter()
const blocks = ref([])

axios.get('/api/blocks')
 .then(response => {
    blocks.value = response.data
  })
 .catch(error => {
    console.error(error)
  })
const store = {
  name: '',
  matricule: '',
  bloc_id: '',
  city: '',
  district: '',
  longitude: '',
  latitude: '',
  status: ''
}

const addStore = async () => {
  try {
    const response = await axios.post('/stores', store)

    console.log(response)
    router.push('/stores')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
    <vVRow>
  <VCol cols="12">
        <!-- 👉 Multiple Column -->
        <VCard title="Multiple Column">
          <VCardText>
            <VForm @submit.prevent="addStore">
      <VRow>
        <!-- 👉 Name -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="store.name"
            label="Name"
            placeholder="John Doe"
          />
        </VCol>
  
        <!-- 👉 Matricule -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="store.matricule"
            label="Matricule"
            placeholder="123456"
          />
        </VCol>
  
        <!-- 👉 Bloc ID -->
        <VCol
          cols="12"
          md="6"
        >
        <v-combobox
 label="Bloc ID"
  v-model="store.bloc_id" 
  :items="blocks"  placeholder="Select bloc ID" 
  variant="outlined"
></v-combobox>
        </VCol>
  
        <!-- 👉 City -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="store.city"
            label="City"
            placeholder="New York"
          />
        </VCol>
  
        <!-- 👉 District -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="store.district"
            label="District"
            placeholder="Manhattan"
          />
        </VCol>
  
        <!-- 👉 Longitude -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="store.longitude"
            label="Longitude"
            placeholder="+123.4567890"
          />
        </VCol>
  
        <!-- 👉 Latitude -->
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="store.latitude"
            label="Latitude"
            placeholder="+123.4567890"
          />
        </VCol>
  
        <!-- 👉 Status -->
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="store.status"
            :items="['Indisponible', 'Disponible', 'Renovations']"
            label="Status"
            placeholder="Select status"
          />
        </VCol>
  
        <VCol
          cols="12"
          class="d-flex gap-4"
        >
          <VBtn type="submit">
            Add Store
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
    </vVRow>
