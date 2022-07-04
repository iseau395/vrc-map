<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import Modal from "../modals/Modal.svelte";
    import TextBox from "../interactive/TextBox.svelte";
    import Button from "../interactive/Button.svelte";

    import { save_modal } from "../modals/modals";

    let slot = "Save Slot 1";

    const dispatch = createEventDispatcher<{"save": string, "load": string}>();
</script>

<Modal title="Save" on:close={() => $save_modal = false}>
    <div>
        Save Slot: <TextBox bind:value={slot}></TextBox>
        <br/>
        <Button label="Save Slot" on:click={() => dispatch("save", slot)}></Button>
        <br/>
        <Button label="Load Slot" on:click={() => dispatch("load", slot)}></Button>
    </div>
</Modal>

<style>
    div {
        display: flex;
        flex-direction: column;
    }
</style>