<script  lang="ts">

  import { onMount } from 'svelte'
	import type {MapOptions} from 'leaflet';

//  import { idlFactory as marketPlaceIDL } from "frontend/declarations/earth-guide/earth-guide.did.js";

 
    
    let mapElement;
    let map;

	onMount(async () => {
    const Canister = await import('/frontend/src/components/utils/canisterFactory.js');
  	const IcHttp = await import('/frontend/src/components/utils/ichttp.js');


            const leaflet = await import('leaflet');

            map = leaflet.map(mapElement)
                    .setView([50.340201864627815, 19.522147178649906], 14)
                    .setMinZoom(14)
            map.doubleClickZoom.disable();

            leaflet.tileLayer('https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map);

            leaflet.marker([51.5, -0.09]).addTo(map)
                .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    });
    

</script>

<main>
    <div bind:this={mapElement}  on:doubleclick|stopPropagation={() => console.log('doubleclick')}></div>
</main>

<style>
    @import 'leaflet/dist/leaflet.css';
    main div {
        height: 800px;
    }
</style>
