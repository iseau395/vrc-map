<script lang="ts">
    export let value: string;
</script>

<input bind:value on:input/>

<style>
    input {
        background-color: rgb(100, 100, 100);
        color: rgb(10, 10, 10);
    }
</style>