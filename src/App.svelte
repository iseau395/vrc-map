<script lang="ts">
    import SettingsModal from "./components/settings/SettingsModal.svelte";
    import SaveModal from "./components/modals/SaveModal.svelte";
    import NavBar from "./components/navbar/NavBar.svelte";
    import Map from "./map/Map.svelte";

    import { settings_modal, save_modal } from "./components/modals/modals";

    const hover_query = window.matchMedia("(hover: hover)");
    const pointer_query = window.matchMedia("(pointer: fine)");

    let has_hover = hover_query.matches;
    let has_pointer = pointer_query.matches;

    hover_query.onchange = (q) => {
        has_hover = q.matches;
    };
    pointer_query.onchange = (q) => {
        has_pointer = q.matches;
    };

    $: hasMouse = has_hover || has_pointer;

    let map: Map;
</script>

<NavBar />

{#if hasMouse}
<Map bind:this={map}/>
{:else}
<p>
    It looks like you are on a device without a mouse or touchpad. If you can, please plug in one of these devices, as this field map is designed to use them.
    If you can't plug one in, then try to switch to another device which can have on plugged in.
</p>
{/if}

{#if $settings_modal}
<SettingsModal />
{:else if $save_modal}
<SaveModal on:save={(ev) => map.save(ev.detail)} on:load={(ev) => confirm("Are you sure?") && map.load(ev.detail)} />
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