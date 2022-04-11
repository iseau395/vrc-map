<script lang="ts">
    import { skills, imperial } from "../../../stores/settings";
    import Checkbox from "../components/Checkbox.svelte";
    import { onMount } from "svelte";

    const onskills = () => {
        $skills = !$skills;
        reloadSave();
    };

    const onunit = () => {
        $imperial = !$imperial;
        reloadSave();
    };

    function reloadSave() {
        localStorage.setItem(
            "settings",
            `skills=${$skills}/imperial=${$imperial}`
        );
    }

    function loadSave() {
        const regex =
            /skills=((?:false)|(?:true))\/imperial=((?:false)|(?:true))/;
        const raw_save = localStorage.getItem("settings");

        if (!regex.test(raw_save)) reloadSave();
        const save = regex.exec(raw_save);

        if (save[1] == "true") {
            onskills();
        }
        if (save[2] == "true") {
            onunit();
        }
    }

    onMount(() => {
        if (!localStorage.getItem("settings")) reloadSave();
        loadSave();
    });
</script>

<Checkbox label="Skills Mode" bind:checked={$skills} on:click={onskills}/>
<Checkbox label="Imperial Units" bind:checked={$imperial} on:click={onunit}/>
