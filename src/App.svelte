<script lang="ts">
    import NavBar from "./navbar/NavBar.svelte";
    import Map from "./map/Map.svelte";
    import { mobileAndTabletCheck } from "./util/mobile-check";

    const mobile = mobileAndTabletCheck();
</script>

<NavBar />
{#if !mobile}
<Map />
{:else}
<p>
    Hey, it looks like you are on a mobile device like a phone or tablet! This field map doesn't work on mobile devices, so try to instead use a computer.
</p>
{/if}

<style>
    p {
        color: red;
    }
</style>