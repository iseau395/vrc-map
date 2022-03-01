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
                slots.filter((v) => v != `slot-${$slot}`).join("|")
            );
        // else localStorage.setItem("all-slots-list", $slot);
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

    let old_slot = $slot;
    const unsubscribe = slot.subscribe(() => {
        const slots = localStorage.getItem("all-slots-list")?.split("|");
        if (slots.includes(old_slot)) save(old_slot, $points, $gameobjects);
        old_slot = $slot;
        load($slot);
    });

    onDestroy(() => unsubscribe());
</script>

<div class="left-panel">
    <a href="https://github.com/iseau395/vrc-map" target="_blank" rel="noopener noreferrer">Github Repository</a>
</div>
<div class="map-panel">
    <div>
        <form>
            <Button label="Delete Save" on:click={deleteSave} />
            <Button label="Delete All Saves" on:click={deleteAllSaves} />
            <TextBox bind:value={$slot} />
        </form>
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