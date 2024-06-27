<template>
  <div>
    <h1>Gestion des Blocs</h1>
    <div class="mb-3">
      <button class="btn btn-primary" @click="showCreateModal = true">Ajouter un bloc</button>
      <button class="btn btn-success" @click="exportToExcel">Exporter en Excel</button>
    <button class="btn btn-danger" @click="exportToPdf">Exporter en PDF</button>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Nombre de magasins</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bloc in blocs" :key="bloc.id">
          <td>{{ bloc.id }}</td>
          <td>{{ bloc.name }}</td>
          <td>{{ bloc.number_shop }}</td>
          <td>
            <button class="btn btn-info" @click="showEditModal = true; selectedBloc = bloc">Modifier</button>
            <button class="btn btn-danger" @click="deleteBloc(bloc.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from '@/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
export default {
  data() {
    return {
      blocs: [],
      newBloc: {
        name: '',
        number_shop: 0 
      },
      selectedBloc: {},
      showCreateModal: false,
      showEditModal: false
    };
  },
  mounted() {
    this.fetchBlocs();
  },
  methods: {
    fetchBlocs() {
      axios.get('/blocs')
        .then(response => {
          this.blocs = response.data;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des blocs:', error);
        });
    },
    createBloc() {
      axios.post('/blocs', this.newBloc)
        .then(response => {
          this.blocs.push(response.data);
          this.newBloc = {
            name: '',
            number_shop: 0
          };
          this.showCreateModal = false;
          $('#createBlocModal').modal('hide');
        })
        .catch(error => {
          console.error('Erreur lors de la création du bloc:', error);
        });
    },
    showBloc(id) {
      // Implement this method to show bloc details if needed
    },
    editBloc() {
      axios.put(`/blocs/${this.selectedBloc.id}`, this.selectedBloc)
        .then(response => {
          const index = this.blocs.findIndex(bloc => bloc.id === this.selectedBloc.id);
          if (index !== -1) {
            this.blocs[index] = response.data;
          }
          this.showEditModal = false;
          $('#editBlocModal').modal('hide');
        })
        .catch(error => {
          console.error('Erreur lors de la modification du bloc:', error);
        });
    },
    deleteBloc(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce bloc ?')) {
        axios.delete(`/blocs/${id}`)
          .then(response => {
            this.blocs = this.blocs.filter(bloc => bloc.id !== id);
          })
          .catch(error => {
            console.error('Erreur lors de la suppression du bloc:', error);
          });
      }
    },
    exportToExcel() {
      axios.get('/blocs')
        .then(response => {
           const jsondata = response.data;
           try {
    const worksheet = utils.json_to_sheet(jsondata);
    const workbook = utils.book_new();
    workbook.SheetNames.push('Blocks');
    workbook.Sheets['Blocks']=worksheet ;
    writeFile(workbook, 'Blocks.xlsx');
    } catch (error) {
    console.error('An error occurred while exporting the data to Excel:', error);
    alert('An error occurred while exporting the data to Excel. Please try again later.');
     }
        }) ;
   
    },
    
    exportToPdf() {
      const blocs = this.blocs;
      const doc = new jsPDF();
      doc.text('Blocks', 10, 10);
      autoTable(doc, {
        head: [['ID', 'nom', 'Numbre de boutique']],
        body: blocs.map(bloc => [bloc.id, bloc.name, bloc.number_shop]),
          });
      const pdfBuffer = doc.output('blob');
      const data = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blocks.pdf';
      a.click();
    },
  }
};
</script>
