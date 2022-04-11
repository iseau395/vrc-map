<script lang="ts">
    import DropdownElement from "./DropdownElement.svelte";

    export let label: string;
</script>

<DropdownElement>
    <input type="button" on:click/>
    <p>
        {label}
    </p>
</DropdownElement>

<style>
    p {
        display: inline;

        position: absolute;

        display: flex;
        align-items: center;

        z-index: 0;

        display: inline;

        margin: 0px;
        margin-left: 4px;
        
        color: black;
    }

    input {
        width: 100%;
        height: 17px;

        z-index: 1;

        margin: 0px;

        opacity: 0;

        border-radius: 0px;
        border-width: 0px;
    }
</style>