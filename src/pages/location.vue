<template>
  <div>
    <h1>gestion des location</h1>
    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else>
      <div>
        <h2>location</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Store Matricule</th>
              <th>Store Name</th>
              <th>Store Address</th>
              <th>Period Location</th>
              <th>Rental Date</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rental in rentals" :key="rental.id">
              <td>{{ rental.client_name }}</td>
              <td>{{ rental.store_matricule }}</td>
              <td>{{ rental.store_name }}</td>
              <td>{{ rental.store_address }}</td>
              <td>{{ rental.period_location }}</td>
              <td>{{ rental.rental_date }}</td>
              <td>{{ rental.price_store }}</td>
              <td>
                <button @click="showRental(rental.id)" class="btn btn-info">
                  View
                </button>
                <button @click="editRental(rental.id)" class="btn btn-warning">
                  Editer
                </button>
                <button @click="deleteRental(rental.id)" class="btn btn-danger">
                  supprimer
                </button>
                <button @click="generateQrCode(rental.id)" class="btn btn-success">
                  Generer QR Code
                </button>
                <button @click="generatePdf(rental.id)" class="btn btn-primary">
                  Generate PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="showRentalModal">
        <!-- Rental Details Modal -->
        <div class="modal fade show" id="rentalDetailsModal" tabindex="-1" aria-modal="true" role="dialog" style="display: block;">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Rental Details</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showRentalModal = false">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label for="client_name">Client Name:</label>
                  <input type="text" class="form-control" id="client_name" v-model="rental.client_name" readonly>
                </div>
                <div class="form-group">
                  <label for="store_matricule">Store Matricule:</label>
                  <input type="text" class="form-control" id="store_matricule" v-model="rental.store_matricule" readonly>
                </div>
                <!-- Add other fields for details -->
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="showRentalModal = false">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showEditModal">
        <!-- Edit Rental Modal -->
        <div class="modal fade show" id="editRentalModal" tabindex="-1" aria-modal="true" role="dialog" style="display: block;">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Rental</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showEditModal = false">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="updateRental">
                  <div class="form-group">
                    <label for="client_name">Client Name:</label>
                    <input type="text" class="form-control" id="client_name" v-model="rental.client_name">
                  </div>
                  <div class="form-group">
                    <label for="store_matricule">Store Matricule:</label>
                    <input type="text" class="form-control" id="store_matricule" v-model="rental.store_matricule">
                  </div>
                  <!-- Add other fields for editing -->
                  <button type="submit" class="btn btn-primary">Save Changes</button>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="showEditModal = false">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showQrCodeModal">
        <!-- QR Code Modal -->
        <div class="modal fade show" id="qrCodeModal" tabindex="-1" aria-modal="true" role="dialog" style="display: block;">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">QR Code</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showQrCodeModal = false">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <img :src="qrCodeUrl" alt="QR Code" width="200" height="200">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="showQrCodeModal = false">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showPdfModal">
        <!-- PDF Modal -->
        <div class="modal fade show" id="pdfModal" tabindex="-1" aria-modal="true" role="dialog" style="display: block;">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">PDF</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showPdfModal = false">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <iframe :src="pdfUrl" width="100%" height="500" frameborder="0"></iframe>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="showPdfModal = false">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Add Form to Create New Rentals -->
      <div>
        <h2>nouvelle location</h2>
        <form @submit.prevent="createRental">
          <div class="form-group">
            <label for="client_name">Client Name:</label>
            <input type="text" class="form-control" id="client_name" v-model="newRental.client_name" required>
          </div>
          <div class="form-group">
            <label for="store_matricule">Store Matricule:</label>
            <input type="text" class="form-control" id="store_matricule" v-model="newRental.store_matricule" required>
          </div>
          <!-- Add other fields for the new rental form -->
          <button type="submit" class="btn btn-primary">Creer la boutique</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from '@/axios';
export default {
  data() {
    return {
      rentals: [],
      isLoading: true,
      newRental: {
        client_name: '',
        store_matricule: '',
        // Add other fields for new rental
      },
      rental: {},
      showRentalModal: false,
      showEditModal: false,
      showQrCodeModal: false,
      showPdfModal: false,
      qrCodeUrl: '',
      pdfUrl: ''
    };
  },
  mounted() {
    this.fetchRentals();
  },
  methods: {
    async fetchRentals() {
      try {
        const response = await axios.get('/rentals');
        this.rentals = response.data.data;
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    },
    createRental() {
    axios.post('/rentals', this.newRental)
        .then(response => {
          this.rentals.push(response.data);
          this.newRental = {
            client_name: '',
            store_matricule: '',
            // Reset other fields
          };
        })
        .catch(error => {
          console.error('Error creating rental:', error);
        });
    },
    showRental(id) {
      axios.get(`/api/rentals/${id}`)
        .then(response => {
          this.rental = response.data;
          this.showRentalModal = true;
        })
        .catch(error => {
          console.error('Error fetching rental details:', error);
        });
    },
    editRental(id) {
      axios.get(`/rentals/${id}`)
        .then(response => {
          this.rental = response.data;
          this.showEditModal = true;
        })
        .catch(error => {
          console.error('Error fetching rental details:', error);
        });
    },
    updateRental() {
      axios.put(`/rentals/${this.rental.id}`, this.rental)
        .then(response => {
          // Update the corresponding rental in the rentals array
          const index = this.rentals.findIndex(r => r.id === this.rental.id);
          if (index !== -1) {
            this.rentals[index] = response.data;
          }
          this.showEditModal = false;
        })
        .catch(error => {
          console.error('Error updating rental:', error);
        });
    },
    deleteRental(id) {
      axios.delete(`/rentals/${id}`)
        .then(response => {
          // Remove the deleted rental from the rentals array
          this.rentals = this.rentals.filter(r => r.id !== id);
        })
        .catch(error => {
          console.error('Error deleting rental:', error);
        });
    },
    generateQrCode(id) {
      axios.get(`/rentals/${id}/qrcode`)
        .then(response => {
          this.qrCodeUrl = response.data.qrcode_url;
          this.showQrCodeModal = true;
        })
        .catch(error => {
          console.error('Error generating QR Code:', error);
        });
    },
    generatePdf(id) {
      window.open(`/rentals/${id}/pdf`, '_blank'); // Open PDF in a new tab
    }
  }
};
</script>
<style scoped>

</style>
