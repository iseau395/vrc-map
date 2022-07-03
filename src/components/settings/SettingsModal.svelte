<script lang="ts">
    import Modal from "../modals/Modal.svelte";
    import Toggle from "../interactive/Toggle.svelte";

    import { settings_modal } from "../modals/modals";
    import { use_grid } from "./settings";
</script>

<Modal title="Settings" on:close={() => $settings_modal = false}>
    <Toggle label="Use Grid (g)" bind:value={$use_grid}/>
</Modal>