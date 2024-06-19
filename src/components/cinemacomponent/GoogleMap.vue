<template>
    <div>
        <div ref="mapContainer" class="map-container"></div>
        <div class="address-input">
            <input v-model="newAddress" placeholder="輸入新地址" @blur="geocodeNewAddress" />
            <button @click="saveNewAddress">保存</button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axiosApi from '@/plugins/axiosConfig.js';
const props = defineProps({
    address: {
        type: String,
        default: null
    },
    cinemaId: {
        type: Number,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    }
});
const mapContainer = ref(null);
const newAddress = ref('');
let map = null;
let marker = null;

const apiKey = import.meta.env.API_KEY;
const mapId = 'b64b6261b917ae52'
const initMap = () => {
    map = new google.maps.Map(mapContainer.value, {
        center: { lat: 25.0330, lng: 121.5654 },
        zoom: 12,
        mapId: mapId
    });
};

const geocodeAddress = (address) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
            if (results[0]) {
                map.setCenter(results[0].geometry.location);
                if (marker) marker.map = null; // Remove existing marker
                marker = new google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: results[0].geometry.location
                });
            } else {
                console.error('No results found');
            }
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });
};
const geocodeNewAddress = () => {
    if (newAddress.value) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: newAddress.value }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    map.setCenter(results[0].geometry.location);
                    if (marker) marker.map = null; // Remove existing marker
                    marker = new google.maps.marker.AdvancedMarkerElement({
                        map,
                        position: results[0].geometry.location
                    });
                } else {
                    console.error('No results found');
                }
            } else {
                console.error('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
};
const saveNewAddress = () => {
    if (newAddress.value) {
        geocodeAddress(newAddress.value);
        const data = {
            cinema_id: props.cinemaId,
            name: props.name,
            phone: props.phone,
            address: newAddress.value,
        }
        console.log(data)
        axiosApi.post('/admin/backstage/updateCinemaAddress',data)
            .then(response => {
                console.log('Address updated successfully', response);
            })
            .catch(error => {
                console.error('Failed to update address', error);
            });
    }
};

watch(() => props.address, (newAddress) => {
    if (newAddress) {
        geocodeAddress(newAddress);
    }
});

onMounted(() => {
    loadGoogleMaps(apiKey).then(() => {
        initMap();
    }).catch((error) => {
        console.error('Failed to load Google Maps API', error);
    });
});
function loadGoogleMaps(apiKey) {
    return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined') {
            resolve(google);
            return true;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(google);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
}
</style>