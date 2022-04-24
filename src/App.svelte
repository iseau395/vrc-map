<script lang="ts">
    import NavBar from "./navbar/NavBar.svelte";
    import Map from "./map/Map.svelte";

    const hasMouse = 'onmousemove' in window;
</script>

<NavBar />
{#if hasMouse}
<Map />
{:else}
<p>
    It looks like you are on a touchscreen only device like a phone or tablet.
    As this field map doesn't work on touchscreen devices (yet), so try to instead use a computer.
</p>
{/if}

<style>
    p {
        color: white;
        background-color: rgb(230, 125, 125);
        display: block;

        margin: 1cm;

        border-style: solid;
        border-width: 2px;
        border-color: red;

        max-width: 500px;

        border-radius: 10px;

        padding: 0.2cm;
    }
</style>