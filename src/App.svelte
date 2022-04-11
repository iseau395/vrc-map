<script lang="ts">
    import Map from "./map/Map.svelte";
    import ToolBar from "./components/titlebar/ToolBar.svelte";
</script>

<ToolBar />
<div class="body">
    <Map />
</div>

<style>
    .body {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>