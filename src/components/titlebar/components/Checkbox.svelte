<script lang="ts">
    import DropdownElement from "./DropdownElement.svelte";

    export let label: string;
    export let checked: boolean = false;
</script>

<DropdownElement>
    <input type="checkbox" bind:checked on:click/>
    <div>
        <input type="checkbox" style="opacity: 1; width: 17px;" bind:checked/>
        <p>
            {label}
        </p>
    </div>
</DropdownElement>

<style>
    div {
        display: inline;

        position: absolute;

        display: flex;
        align-items: center;
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

    p {
        z-index: 0;

        display: inline;

        margin: 0px;
        margin-left: 4px;
        
        color: black;
    }
</style>