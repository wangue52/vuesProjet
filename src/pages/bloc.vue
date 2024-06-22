<template>
  <div>
    <h1>Gestion des Blocs</h1>
    <div class="mb-3">
      <button class="btn btn-primary" @click="showCreateModal = true">Ajouter un bloc</button>
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
    <!-- Create Bloc Modal
    <div class="modal fade" id="createBlocModal" :class="{ show: showCreateModal }" tabindex="-1" aria-labelledby="createBlocModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createBlocModalLabel">Ajouter un bloc</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createBloc">
              <div class="mb-3">
                <label for="name" class="form-label">Nom du bloc</label>
                <input type="text" class="form-control" id="name" v-model="newBloc.name" required>
              </div>
              <div class="mb-3">
                <label for="number_shop" class="form-label">Nombre de magasins</label>
                <input type="number" class="form-control" id="number_shop" v-model.number="newBloc.number_shop" required>
              </div>
              <button type="submit" class="btn btn-primary">Créer</button>
            </form>
          </div>
        </div>
      </div>
    </div> -->
    <!-- Edit Bloc Modal -->
    <!-- <div class="modal fade" id="editBlocModal" :class="{ show: showEditModal }" tabindex="-1" aria-labelledby="editBlocModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editBlocModalLabel">Modifier un bloc</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateBloc">
              <div class="mb-3">
                <label for="name" class="form-label">Nom du bloc</label>
                <input type="text" class="form-control" id="name" v-model="selectedBloc.name" required>
              </div>
              <div class="mb-3">
                <label for="number_shop" class="form-label">Nombre de magasins</label>
                <input type="number" class="form-control" id="number_shop" v-model.number="selectedBloc.number_shop" required>
              </div>
              <button type="submit" class="btn btn-primary">Enregistrer</button>
            </form>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import axios from '@/axios';
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
    }
  }
};
</script>
