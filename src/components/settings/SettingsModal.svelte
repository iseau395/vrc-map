<script lang="ts">
    import Modal from "../Modal.svelte";
    import Toggle from "./Toggle.svelte";

    import { settings_modal } from "../modals";
    import { use_grid } from "./settings";
</script>

<Modal title="Settings" on:click={() => $settings_modal = false}>
    <Toggle label="Use Grid (g)" bind:value={$use_grid}/>
</Modal>