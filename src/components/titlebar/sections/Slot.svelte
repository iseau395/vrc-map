<script lang="ts">
    import Button from "../components/Button.svelte";

    import { points, gameobjects } from "../../../stores/objects";

    import { slot } from "../../../map/var";
    import { load, save } from "../../../map/saving";
    import { onDestroy } from "svelte";

    function deleteSave() {
        if (!confirm("Are you sure you want to delete your save?")) return;

        localStorage.removeItem(`slot-${$slot}`);
        const slots = localStorage.getItem("all-slots-list")?.split("|");
        if (slots)
            localStorage.setItem(
                "all-slots-list",
                slots.filter((v) => v != $slot).join("|")
            );

        $slot = slots[0] ?? "slot1";
        load($slot);

        alert("Success!");
    }

    function deleteAllSaves() {
        if (!confirm("Are you sure you want to delete all of your saves?")) return;

        const settings = localStorage.getItem("settings");
        localStorage.clear();
        localStorage.setItem("settings", settings);

        $slot = "slot1";

        load($slot);

        alert("Success!");
    }

    function switchSlot() {
        const slots = localStorage.getItem("all-slots-list").split("|");
        const newSlot = prompt(`Which slot to switch to?\nSlots: ${slots.join(", ")}`);

        slot.set(newSlot);

        if (!slots.includes(newSlot))
            localStorage.setItem("all-slots-list", `${slots}|${newSlot}`);
    }

    let old_slot: null | string = null;
    const unsub = slot.subscribe((v) => {
        const slots = localStorage.getItem("all-slots-list")?.split("|") ?? [];
        if (old_slot && slots.includes(old_slot))
            save(old_slot, $points, $gameobjects);
        old_slot = v;
        load($slot);
    });

    onDestroy(unsub);
</script>

<Button label="Delete Slot" on:click={deleteSave} />
<Button label="Delete All Slots" on:click={deleteAllSaves} />
<Button label="Switch Slot..." on:click={switchSlot} />
