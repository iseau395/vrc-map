<script lang="ts">
    import NavBarButton from "./NavBarButton.svelte";
    import Sidemenu from "./Sidemenu.svelte";

    let sidemenu = false;
</script>

<div>
    <span>
        <p>VRC Field Map</p>
    </span>
    <div class="hamburger-button">
        <NavBarButton on:click={() => sidemenu = !sidemenu}>&equiv;</NavBarButton>
    </div>
</div>

{#if sidemenu}
    <Sidemenu></Sidemenu>
{/if}

<style>
    div {
        height: 50px;
        background-color: rgb(0, 0, 30);

        color: white;

        display: flex;
        align-items: center;
        justify-content: space-between;

        -webkit-user-select: none; /* Safari */        
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }

    p {
        font-size: 35px;
        margin: 0px;
        padding-top: 5px;
    }

    span {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .hamburger-button {
        font-size: 45px;
    }
</style>