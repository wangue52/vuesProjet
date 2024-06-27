<script setup>
import axios from '@/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';
import { utils, writeFile } from 'xlsx';
const { global } = useTheme()
const search = ref('');
const stores = ref([]) ;
const editedIndex = ref(-1) ;
const editedItem = ref({
  id: '',
  name: '',
  matricule: '',
  bloc_id: '',
  city: '',
  district: '',
  longitude: '',
  latitude: '',
  status: '',
});
const dialog = ref(false) ;
const headers = [
{ title: 'id', key: 'id' },
  {
    title: 'Name',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  { title: 'Matricule', key: 'matricule' },
  { title: 'Bloc ID', key: 'bloc_id' },
  { title: 'City', key: 'city' },
  { title: 'District', key: 'district' },
  { title: 'Longitude', key: 'longitude' },
  { title: 'Latitude', key: 'latitude' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]
const formTitle = computed(() => {
  return editedIndex === -1? 'New Store' : 'Edit Store'
});
  axios.get('/stores')
  .then(response => {
      stores.value = response.data.data ;
    })
  .catch(error => {
      console.error(error)
    });


  const editItem = (item) => {
  editedIndex.value = stores.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}

const dialogDelete = ref(false)
const deleteItem = (item) => {
  editedIndex.value = stores.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}
const close = () => {
  dialog.value = false
  editedItem.value = { 
    id: '', 
    name: '', 
   matricule: '', 
    bloc_id: '',
    city: '',
    district: '',
    longitude: '', 
    latitude: '',
     status: '' ,
}
  editedIndex.value = -1 ;
}
const deleteItemConfirm = () => {
  axios.delete('/stores{editedItem.id}')
  .then(response => {
      stores.value.splice(editedIndex, 1)
    })
  .catch(error => {
      console.error(error)
    })
  dialogDelete.value = false
}



const closeDelete = () => {
  dialogDelete.value = false
  editedItem.value=  { name: '', matricule: '', bloc_id: '', city: '', district: '', longitude: '', latitude: '', status: '' };
  editedIndex.value = -1 ;
};

const save = () => {
  if (editedIndex > -1) {
    axios.put('/stores{editedItem.id}', editedItem)
    .then(response => {
        stores.value[editedIndex] = response.data.data
      })
    .catch(error => {
        console.error(error)
      })
  } else {
    axios.post('/stores', editedItem)
    .then(response => {
        stores.value.push(response.data)
      })
    .catch(error => {
        console.error(error)
      })
  }
  close()
};
const exportToPdf=() =>{
      const boutique =  stores.value;
      const doc = new jsPDF();
      doc.text('liste des boutiques de la communes urbaines de ngaoundere', 10, 10);
      autoTable(doc, {
        head: [['ID', 'Name', 'Matricule', 'Bloc_ID', 'City', 'District', 'Longitude', 'Latitude', 'Status']],
        body: boutique.map(store => [store.id, store.name, store.matricule, store.bloc_id, store.city, store.district, store.longitude, store.latitude, store.status]),
        });
      const pdfBuffer = doc.output('blob');
      const data = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'store.pdf';
      a.click();
    };
const exportToExcel=()=> {
      axios.get('/stores')
        .then(response => {
           const jsondata = response.data.data;
           try {
    const worksheet = utils.json_to_sheet(jsondata);
    const workbook = utils.book_new();
    workbook.SheetNames.push('shops');
    workbook.Sheets['shops']=worksheet ;
    writeFile(workbook, 'shops.xlsx');
    } catch (error) {
    console.error('An error occurred while exporting the data to Excel:', error);
    alert('An error occurred while exporting the data to Excel. Please try again later.');
     }
        }) ;
   
    }

</script>
<template>
  <v-data-table
    :color="primary"
    :headers="headers"
    :items="stores"
    :sort-by="[{ key: 'name', order: 'asc' }]"
    :search="search"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>liste des commerce </v-toolbar-title>
        <v-text-field v-model="search" label="Search" class="mb-4"></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props">
              nouvelle boutique
            </v-btn>
            <button class="btn btn-success" @click="exportToExcel">Exporter en Excel</button>
            <button class="btn btn-danger" @click="exportToPdf">Exporter en PDF</button>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container >
                <v-row>
                    <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.id" label="id"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.name" label="nom"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.matricule" label="Matricule"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.bloc_id" label="Bloc ID"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.city" label="City"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.district" label="District"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.longitude" label="Longitude"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.latitude" label="Latitude"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-select v-model="editedItem.status" :items="['Indisponible', 'Disponible', 'Renovations']" label="Status" placeholder="Select status"></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">
              voulez vous vraiment supprimer ?
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">
                fermer
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">
                OK
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)">
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92-9.06 9.06z"></path></svg>
   </v-icon>
 <v-icon size="small" @click="deleteItem(item)">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4zm-6 7h-2v7h2V11zm-4 0H7v7h2V11zm8 0h-2v7h2V11zm2-8H5v3h14V3z"></path></svg>
  </v-icon>
    </template>
    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template> -->
  </v-data-table>
</template>
