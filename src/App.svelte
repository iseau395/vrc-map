<script lang="ts">
    import SettingsPanel from "./components/settings/SettingsPanel.svelte";
    import Button from "./components/Button.svelte";
    import Map from "./map/Map.svelte";

    import { getSlot, setSlot } from "./map/var";
    import { load } from "./map/saving";

    function deleteSave() {
        localStorage.removeItem(getSlot());
        const slots = localStorage.getItem("all-slots-list")?.split("|");
        if (slots)
            localStorage.setItem(
                "all-slots-list",
                slots.filter((v) => v != getSlot()).join("|")
            );
        else localStorage.setItem("all-slots-list", getSlot());
        load(getSlot());
    }

    function deleteAllSaves() {
        const settings = localStorage.getItem("settings");
        localStorage.clear();
        localStorage.setItem("settings", settings);

        setSlot("slot1");
        (document.getElementById("slot-selector") as HTMLInputElement).value = "slot1";

        load(getSlot());
    }
</script>

<div />
<div class="map-panel">
    <div>
        <form>
            <Button label="Delete Save" onclick={deleteSave} />
            <Button label="Delete All Saves" onclick={deleteAllSaves} />
            <input id="slot-selector" type="text" value="slot1" />
        </form>
        <p id="slots-list" />

        <Map />
    </div>
</div>
<SettingsPanel />
