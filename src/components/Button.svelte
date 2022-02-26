<script lang="ts">
    export let label: string;
    export let onclick: svelte.JSX.MouseEventHandler<HTMLButtonElement>;
</script>

<button on:click={onclick}>{label}</button>

<style>
    button {
        background-color: rgb(100, 100, 100);
        color: rgb(10, 10, 10);
    }
</style>
