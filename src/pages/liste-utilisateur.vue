<script setup>
import axios from '@/axios';
import { ref } from 'vue';
const search = ref('');
const showAddUserModal = ref(false);
const userData = ref([]);
const newUser = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  type: '',
  phone: '',
  address: '',
  // Add other fields as needed
});
const userForm = ref(null);

const headers = [
  { title: 'Nom', key: 'name' },
  { title: 'Prénom', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Type', key: 'type' },
  { title: 'Téléphone', key: 'phone' },
  { title: 'Adresse', key: 'address' },
  { title: 'Avatar', key: 'avatar' },
  { title: 'Matricule', key: 'matricule' },
  { title: 'Mis à jour', key: 'updated_at' },
  { title: 'Créé', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false },
];


const fetchUsers = async () => {
  try {
    const response = await axios.get('/users');
    userData.value = response.data.data;
    // userData.avatar.value = userData.value.map(user => user.avatar);
  } catch (error) {
    console.error(error);
  }
};

const editItem = (item) => {
  // Assuming there's a reactive object for the form data and a flag to show the edit modal
  newUser.value = { ...item }; // Populate the form with the item data
  showAddUserModal.value = true; // Show the edit modal
};

const deleteItem = async (item) => {
  if (confirm(`voulez vous vraiment supprimer Mr ${item.name}?`)) {
    try {
      await axios.delete(`/users/${item.id}`);
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }
};
const addUser = async () => {
  // Validate user form
  if (!userForm.value.validate()) {
    return;
  }

  // Send user creation request to API
  const response = await axios.post('/users', newUser.value);
  // Handle successful user creation
  showAddUserModal.value = false;
  userData.value.push(response.data);
  // Clear user form
  resetUserForm();
};

const resetUserForm = () => {
  userForm.value.$reset();
  newUser.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    type: '',
    phone: '',
    address: '',
    // Reset other fields as needed
  };
};

fetchUsers()
</script>
<template>
  <v-row>
    <v-col>
      <v-text-field v-model="search" label="Search" class="mb-4"></v-text-field>
      <v-btn color="success" @click="showAddUserModal = true">ajouter un user</v-btn>
      <v-data-table :color="primary" :headers="headers" :items="userData" :search="search" >
        <template v-slot:item.username="{ item }">
          <v-avatar :src="item.avatar" size="32" class="mr-2">
            <img :src="item.avatar" alt="Avatar">
          </v-avatar>
          {{ item.username }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon  size="small" class="mr-2" color="blue" @click="editItem(item)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92-9.06 9.06z"></path></svg>
          </v-icon>
          <v-icon size="small" color="red" @click="deleteItem(item)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4zm-6 7h-2v7h2V11zm-4 0H7v7h2V11zm8 0h-2v7h2V11zm2-8H5v3h14V3z"></path></svg>
          </v-icon>
        </template>
      </v-data-table>

      <v-dialog v-model="showAddUserModal" persistent max-width="600px">
        <v-card>
          <v-card-title>
            Add New User
          </v-card-title>
          <v-card-text>
            <v-form ref="userForm">
              <v-text-field
                v-model="newUser.name"
                label="Nom"
                required
              ></v-text-field>
              <v-text-field
                v-model="newUser.username"
                label="Prénom"
                required
              ></v-text-field>
              <v-text-field
                v-model="newUser.email"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="newUser.password"
                label="Mot de passe"
                type="password"
                required
              ></v-text-field>
              <v-select
                v-model="newUser.type"
                :items="['Admin', 'Agent', 'Receveur']"
                label="Type"
                required
              ></v-select>
              <v-text-field
                v-model="newUser.phone"
                label="Téléphone"
                required
              ></v-text-field>
              <v-text-field
                v-model="newUser.address"
                label="Adresse"
                required
              ></v-text-field>
              </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="showAddUserModal = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="addUser">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<style scoped>
.v-data-table {
  font-family: Arial, sans-serif;
}

.v-data-table th {
  background-color: #f5f5f5;
  color: #333;
  font-weight: bold;
  padding: 8px;
}

.v-data-table td {
  padding: 8px;
}

.v-data-table.v-icon {
  font-size: 18px;
}

.v-data-table.v-data-table__wrapper {
  border-collapse: collapse;
}

.v-data-table.v-data-table__wrapper tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.v-data-table.v-data-table__wrapper tbody tr:hover {
  background-color: #f2f2f2;
}
</style>

