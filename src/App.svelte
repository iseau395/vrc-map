<script lang="ts">
    import SettingsPanel from "./components/SettingsPanel.svelte";
    import Button from "./components/Button.svelte";
    import Map from "./map/Map.svelte";

    import { points, gameobjects } from "./stores/objects";

    import { slot } from "./map/var";
    import { load, save } from "./map/saving";
    import TextBox from "./components/TextBox.svelte";
    import { onDestroy } from "svelte";

    function deleteSave() {
        localStorage.removeItem(`slot-${$slot}`);
        const slots = localStorage.getItem("all-slots-list")?.split("|");
        if (slots)
            localStorage.setItem(
                "all-slots-list",
                slots.filter((v) => v != $slot).join("|")
            );
        console.log(slots);
        $slot = slots[0] ?? "slot1";
        load($slot);
    }

    function deleteAllSaves() {
        const settings = localStorage.getItem("settings");
        localStorage.clear();
        localStorage.setItem("settings", settings);

        $slot = "slot1";

        load($slot);
    }

    const slots = localStorage.getItem("all-slots-list")?.split("|") ?? [];
    let old_slot = slots[0];
    const unsub = slot.subscribe((v) => {
        const slots = localStorage.getItem("all-slots-list")?.split("|") ?? [];
        console.log(slots.includes(old_slot));
        if (slots.includes(old_slot)) save(old_slot, $points, $gameobjects);
        old_slot = v;
        load($slot);
    });

    onDestroy(unsub);
</script>

<div class="left-panel">
    <a href="https://github.com/iseau395/vrc-map" target="_blank" rel="noopener noreferrer">Github Repository</a>
</div>
<div class="map-panel">
    <div>
        <Button label="Delete Save" on:click={deleteSave} />
        <Button label="Delete All Saves" on:click={deleteAllSaves} />
        <TextBox bind:value={$slot} />
        <p id="slots-list" />

        <Map />
    </div>
</div>
<SettingsPanel />

<style>
    .map-panel {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .left-panel {
        display: flex;
        align-items: end;
    }

    a {
        margin: 10px;
        color: rgb(0, 50, 200);
    }
</style>