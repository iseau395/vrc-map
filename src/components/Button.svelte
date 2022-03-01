<script lang="ts">
    export let label: string;
</script>

<button on:click>{label}</button>

<style>
    button {
        background-color: rgb(100, 100, 100);
        color: rgb(10, 10, 10);
    }
</style>
