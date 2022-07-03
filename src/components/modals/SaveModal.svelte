<script lang="ts">
    import Modal from "../modals/Modal.svelte";
    import TextBox from "../interactive/TextBox.svelte";
    import Button from "../interactive/Button.svelte";

    import { save_modal } from "../modals/modals";
</script>

<Modal title="Settings" on:close={() => $save_modal = false}>

</Modal>