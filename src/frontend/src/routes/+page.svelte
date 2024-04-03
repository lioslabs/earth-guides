<script  lang="ts">

  import { onMount } from 'svelte'
	
  import L from 'leaflet';


  import { createMarker, getMarkers } from '$utils/marketplace';

//  import { idlFactory as marketPlaceIDL } from "frontend/declarations/earth-guide/earth-guide.did.js";

 
    
    let mapElement;
    let map;
    let markers;
    let markerMode = true;

	onMount(async () => {

    const bounds = [ [50.333888, 19.490000], [50.348309, 19.541373] ];


            map = L.map(mapElement)
                .fitBounds(bounds).setMinZoom(15);

            map.doubleClickZoom.disable();
            map.setMaxBounds(map.getBounds())

            L.tileLayer(
              'https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            ).addTo(map);

            map.on('click', (e) => {addMarker(e, L)})
            await update_markers();
    });

    async function update_markers(){
      markers = getMarkers();
    }
    
    function fitMap(map){
        map.fitBounds([ [50.328313, 19.476013], [50.357153, 19.558067] ]);
    }

    function addMarker(event){
        markerMode = !markerMode
        if (markerMode == true) {
              const res = createMarker({"pos": event.latlng}).then((newMarker) => {
              console.log("newmarker", newMarker);
              L.marker(event.latlng).addTo(map)
          });
      }
    }

    $: console.log(markers)
</script>

<main>
    <div bind:this={mapElement}  on:doubleclick|stopPropagation={() => console.log('doubleclick')}></div>
  <div class="toolbar">
    <button id="center" on:click={ () => fitMap(map) }/>
    <button id="marker" on:click={ (event) => addMarker(event) } />
  </div>
</main>

<style lang="de">
    @import 'leaflet/dist/leaflet.css';
    main div {
        height: 800px;
        position: relative;
    }

    .toolbar {
      position: absolute;
      bottom: 20px;
      right: 20px;
      z-index: 99999999;
      height: 200px;
      width: 50px;
      border: 1px solid grey;

    }
    .toolbar button {
      width: 50px;
      height: 50px;
      border: 1px solid grey;
      background-color: grey;
    }
</style>
