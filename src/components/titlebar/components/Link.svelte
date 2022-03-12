<svelte:options immutable={true}/>

<script lang="ts">
    import DropdownElement from "./DropdownElement.svelte";

    export let link: string;
    export let label: string;
</script>

<DropdownElement>
    <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
    >{label}</a>
    <img src="./media/external-link.png" alt="External Link"/>
</DropdownElement>

<style>
    a {
        height: 15px;
        width: 100%;
        color: black;
        z-index: 1;
        
        text-decoration: none;

        padding-top: 2px;
        padding-bottom: 2px;
    }

    img {
        width: 15px;
        z-index: 0;
        position: absolute;
        left: 90%;
    }
</style>