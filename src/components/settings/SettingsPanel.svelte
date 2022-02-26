<script lang="ts">
    import Switch from "../Switch.svelte";
    import { skills, imperial } from "./settings.js";
    import { onMount } from "svelte";

    let skills_switch: Switch;
    let unit_switch: Switch;

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
            save[1] == "true" && skills_switch.click();
            save[2] == "true" && unit_switch.click();
    }


    onMount(() => {
        if (!localStorage.getItem("settings")) reloadSave();
        loadSave();
    });
</script>

<div class="settings-panel">
    <img
        src="./media/GrayGearIcon.png"
        alt="Toggle Settings"
        class="gear-icon"
    />
    <input class="settings-button" type="checkbox" />
    <div class="settings-wrapper">
        <Switch bind:this={skills_switch} label="Skills Mode" on:click={onskills} />
        <br /><br />
        <Switch bind:this={unit_switch} label="Imperial Mode" on:click={onunit} />
    </div>
</div>

<style>
    .settings-panel {
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-start;
        align-items: flex-end;
    }

    .settings-wrapper {
        width: 50%;
        height: 25%;
        padding: 10px;

        background-color: #ccc;
        color: black;

        display: none;

        border-radius: 10px;

        margin-bottom: 10px;
    }

    input:checked + .settings-wrapper {
        display: block;
    }

    .gear-icon {
        position: absolute;

        width: 50px;
        height: 50px;
    }

    .settings-button {
        display: block;
        position: relative;

        z-index: 1;

        opacity: 0;
        background-image: url("../media/GrayGearIcon.png");
        background-position: center;

        width: 50px;
        height: 50px;

        background-color: transparent;

        margin: 0px;
        padding: 0px;
        border: 0px;
    }
</style>
