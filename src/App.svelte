<script lang="ts">
    import SettingsPanel from "./components/settings/SettingsPanel.svelte";
    import Button from "./components/Button.svelte";
    import Map from "./map/Map.svelte";

    import { points, gameobjects } from "./map/objects";

    import { slot } from "./map/var";
    import { load, save } from "./map/saving";
    import TextBox from "./components/TextBox.svelte";
import { onDestroy } from "svelte";

    function deleteSave() {
        localStorage.removeItem($slot);
        const slots = localStorage.getItem("all-slots-list")?.split("|");
        if (slots)
            localStorage.setItem(
                "all-slots-list",
                slots.filter((v) => v != $slot).join("|")
            );
        else localStorage.setItem("all-slots-list", $slot);
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

    onDestroy((() => unsubscribe()));
</script>

<div />
<div class="map-panel">
    <div>
        <form>
            <Button label="Delete Save" onclick={deleteSave} />
            <Button label="Delete All Saves" onclick={deleteAllSaves} />
            <TextBox bind:value={$slot}></TextBox>
        </form>
        <p id="slots-list" />

        <Map />
    </div>
</div>
<SettingsPanel />
