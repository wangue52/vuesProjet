<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card>
          <v-card-title>Gestion des locations</v-card-title>
          <v-card-title>
            <v-form @submit.prevent="submitForm">
              <v-text-field
                v-model="form.client_name"
                label="Nom du client"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.store_matricule"
                label="Numéro de matricule du magasin"
               
                required
              ></v-text-field>
              <v-select
                v-model="form.store_id"
                :items="storeNames"
                item-title="name"
                item-value="id"
                label="Nom du magasin"
                @change="fillStoreDetails"
                required
              ></v-select>
              <v-text-field
                v-model="form.store_address"
                label="Adresse du magasin"
                
                required
              ></v-text-field>
              <v-text-field
                v-model="form.period_location"
                label="Période de location (en jours)"
                type="number"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.rental_date"
                label="Date de location"
                type="datetime-local"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.price_store"
                label="Prix de location"
                type="number"
                step="0.01"
                required
              ></v-text-field>
              <v-btn color="primary" type="submit">Enregistrer</v-btn>
            </v-form>
          </v-card-title>
        </v-card>

        <v-card>
          <v-card-title>Liste des locations</v-card-title>
          <v-text-field v-model="search" label="Search" class="mb-4"></v-text-field>
          <v-card-title>
            <v-data-table :headers="headers" :items="rentals" :loading="loading" :search="search" >
              <template v-slot:item.actions="{ item }">
                <v-btn color="info" @click=" generatePDF(item.id)">PDF</v-btn>
                <v-btn color="warning" @click="editRental(item.id)">Modifier</v-btn>
                <v-btn color="error" @click="deleteRental(item.id)">Supprimer</v-btn>
                <v-btn color="success" @click="generateQrCode(item.id)">QR Code</v-btn>
              </template>
            </v-data-table>
          </v-card-title>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from '@/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ref } from 'vue';
export default {
  data() {
    return {
      locationData:ref([]),
      imageUrl:'',
      form: {
        client_name: '',
        store_matricule: '',
        store_id: '',
        store_address: '',
        period_location: '',
        rental_date: '',
        price_store: '',
      },
      rentals: [],
      stores: [],
      storeNames: [],
       search : ref(''),
   showdetails : ref(false) ,
      headers: [
        { title: 'Nom du client', key: 'client_name' },
        { title: 'Numéro de matricule', key: 'store_matricule' },
        { title: 'Nom du magasin', key: 'store_name' },
        { title: 'Adresse du magasin', key: 'store_address' },
        { title: 'Période de location', key: 'period_location' },
        { title: 'Date de location', key: 'rental_date' },
        { title: 'Prix de location', key: 'price_store' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      loading: false,
    };
  },
  created() {
    this.fetchRentals();
    this.fetchStores();
  },
  methods: {
    fetchRentals() {
      this.loading = true;
      axios.get('/rentals')
        .then(response => {
          this.rentals = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des locations :', error);
          this.loading = false;
        });

    },
    fetchStores() {
      axios.get('/stores?status=disponible')
        .then(response => {
          this.stores = response.data.data;
          this.storeNames = this.stores.map(store => store.name);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des magasins :', error);
        })
      },
      fillStoreDetails() {
      const selectedStore = this.stores.find(store => store.name === this.form.store_id);
      if (selectedStore) {
        this.form.store_matricule = selectedStore.matricule;
        this.form.store_address = selectedStore.address;
      }
    },
    submitForm() {
      axios.post('/rentals', this.form)
        .then(response => {
          this.fetchRentals();
          this.resetForm();
        })
        .catch(error => {
          console.error('Erreur lors de l\'enregistrement de la location :', error);
        });
    },
    showRental(id) {
      axios.get(`/rentals/${id}`, this.form)
        .then(response => {
          
        })
    },
    editRental(id) {
      this.$router.push({ name: 'rental.edit', params: { id } });
    },
    deleteRental(rental_id) {
      axios.delete(`/rentals/${rental_id}`)
        .then(response => {
          this.fetchRentals();
        })
        .catch(error => {
          console.error('Erreur lors de la suppression de la location :', error);
        });
    },
    generateQrCode(id) {
      axios.get(`/rentals/qrcode/${id}`)
        .then(response => {
          // Afficher le QR Code à l'utilisateur
          window.open(response.data.qrcode_url, '_blank');
        })
        .catch(error => {
          console.error('Erreur lors de la génération du QR Code :', error);
        });
    },
  async generatePDF(id) {
    try {
  const qrcodeResponse = await axios.get(`/rentals/qrcode/${id}`);
            this.imageUrl=qrcodeResponse.data.qrcode_url;
    
   
     const locationResponse = await axios.get(`/rentals/${id}`);
     const locationData=[locationResponse.data] ;
      const boutique=locationData
      let pavel=boutique.map(store => [ store.client_name]);
     const company={
      nom :'commune urbaine de bali',
      logo :'@images/avatars/avatar-1.png',
      address :'bini-dang',
      telephone:'699227921',
      email:'communedouala@gmail.com',

     };
    const doc= new jsPDF() ;
    // doc.addImage(company.logo,'png',10, 10, 50,20);
    doc.setFontSize(16);
    doc.text(company.nom,1,10);
    doc.setFontSize(12);
    doc.text(company.address,1,30);
    doc.text(company.telephone,1,20);
    doc.text(company.email,1,40);
    doc.setFontSize(20);
     doc.addImage(this.imageUrl,'png',180,10,30,30);
      autoTable(doc, {
         startY:120,
        theme:'grid',
        head: [['nom du client/cliente','matricule de la boutique', 'nom de la boutique','periode de location en mois', 'date de location', 'prix de location en cfa']],
        body: boutique.map(store => [ store.client_name,store.store_matricule, store.store_name, store.period_location, store.rental_date, store.price_store]),
        });
      const pdfBuffer = doc.output('blob');
      const data = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pavel}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
     } catch (error) {
      console.error('Erreur lors de la génération du PDF :', error);
    }
    },
    resetForm() {
      this.form = {
        client_name: '',
        store_matricule: '',
        store_name: '',
        store_address: '',
        period_location: '',
        rental_date: '',
        price_store: '',
      };
    },
  },
};
</script>

<!-- const tableaux=[
      { '' :'details du contrats de location ' 

      },
      { '' :matricule de la boutique: ${locationData.store_matricule}

      },
      { '' :nom de la boutique: ${locationData.store_name}

      },
      { '' :matricule de la boutique: ${locationData.store_address}

      },
      { '' : prix du loyer: ${locationData.price_store} francs cfa

      }, -->
      <!-- a.download = `${boutique.store_name}.pdf`; -->

