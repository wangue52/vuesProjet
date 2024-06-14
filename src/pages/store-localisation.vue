<script>
import axios from '@/axios';

import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';


export default {
  data() {
    return {
      stores: [],
      showMap: false,
      map: null,
      markers: [] ,
      fetchInterval: null ,
      routing:null ,
    
    };
  },
  mounted() {
    this.fetchStores();
  },
  methods: {
    fetchStores() {
      axios.get('/stores')
        .then(response => {
          this.stores = response.data.data;
        })
        .catch(error => {
          console.error('Error fetching stores:', error);
        });
    },
    showStoreDetails() {
      this.showMap = true;
      this.$nextTick(() => {
    this.initMap();
  });
    },
    initMap() {
      if (!this.map) {
        this.map = L.map('map').setView([0, 0], 13);
        navigator.geolocation.getCurrentPosition(position => {
          const userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
          this.map.panTo(userLocation);

          // Add a marker for the user's location
          const userMarker = L.marker(userLocation, { icon: L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            shadowSize: [41, 41]

          }),
         }).addTo(this.map) ;

          // Add a waypoint for the user's location to the routing control
          this.routing.setWaypoints([L.Routing.waypoint(userLocation)]);
        }, error => {
          console.error('Error getting user location:', error);
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Ajouter les calques de routes
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: '&copy; Contributeurs OpenStreetMap',
    }).addTo(this.map);

    // Ajouter les calques de bâtiments
    L.tileLayer('https://{s}.tile.openstreetmap.org/osmbuildings/{z}/{x}/{y}.png', {
      attribution: '&copy; Contributeurs OpenStreetMap',
    }).addTo(this.map);

    // Ajouter les calques de cours d'eau
    L.tileLayer('https://{s}.tile.openstreetmap.org/waterways/{z}/{x}/{y}.png', {
      attribution: '&copy; Contributeurs OpenStreetMap',
    }).addTo(this.map);

    // Ajouter les calques de transport en commun
    L.tileLayer('https://{s}.tile.openstreetmap.fr/transport/{z}/{x}/{y}.png', {
      attribution: '&copy; Contributeurs OpenStreetMap',
    }).addTo(this.map);

    // Ajouter les calques de points d'intérêt
    L.tileLayer('https://{s}.tile.openstreetmap.org/pois/{z}/{x}/{y}.png', {
      attribution: '&copy; Contributeurs OpenStreetMap',
    }).addTo(this.map);

    // Ajouter les calques de limites administratives
    L.tileLayer('https://{s}.tile.openstreetmap.org/admin/{z}/{x}/{y}.png', {
      attribution: '&copy; Contributeurs OpenStreetMap',
    }).addTo(this.map);
    this.routing = L.Routing.control({
      waypoints: [],
      routeWhileDragging: true,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org'
      }),
      lineOptions: {
        styles: [{ color: '#5D94FF', weight: 4 }]
      },
      altLineOptions: {
        styles: [{ color: '#5D94FF', dashArray: '7, 12', weight: 2 }]
      }
    }).addTo(this.map);
    // Ajouter les marqueurs des magasins
    this.stores.forEach(store => {
      const marker = L.marker([store.latitude, store.longitude]).addTo(this.map);
      marker.bindPopup(`
        <h3>${store.name}</h3>
        <p>${store.matricule}</p>
        <p>${store.city}, ${store.district}</p>
      `);
      this.markers.push(marker);
    });

      }

      this.markers.forEach(marker => {
        this.map.removeLayer(marker);
      });
      this.markers = [];

      this.stores.forEach(store => {
        const marker = L.marker([store.latitude, store.longitude]).addTo(this.map);
        marker.bindPopup(`
          <h3>${store.name}</h3>
          <p>${store.matricule}</p>
          <p>${store.city}, ${store.district}</p>
        `);
        this.markers.push(marker);
      });

      this.map.fitBounds(this.markers.map(marker => marker.getLatLng()));
    },
    beforeDestroy() {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
    }
  }
};

</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-scroll-view v-if="stores.length">
          <v-row>
            <v-col cols="12" md="6" lg="4" v-for="store in stores" :key="store.id">
              <v-card class="">
                <v-card-text>
                  <v-list-item-content>
                    <v-list-item-title>{{ store.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ store.matricule }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content v-if="store.city || store.district">
                    <v-list-item-subtitle>
                      {{ store.city ? store.city + ', ' : '' }}{{ store.district }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="showStoreDetails">
                     Details
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-scroll-view>
        <v-empty v-else>aucune boutique disponible</v-empty>
        <v-dialog v-model="showMap" persistent max-width="1000px" @opened="initMap" >
          <v-card>
            <v-card-title>emplacement de la boutique</v-card-title>
            <v-card-text>
              <div class="map-container" id="map" style="height: 500px;"></div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="v-btn"  @click="showMap = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

