<script lang="ts">
    import NavBarButton from "./NavBarButton.svelte";
    import Sidemenu from "./Sidemenu.svelte";

    import { settings_modal } from "../modals";

    let sidemenu = false;
</script>

<div>
    <span>
        <p>VRC Field Map</p>
        <NavBarButton on:click={() => ($settings_modal = true)}>
            Settings
        </NavBarButton>
        <a href="https://github.com/iseau395/vrc-map" target="_blank" rel="noopener noreferrer">
            <NavBarButton>
                GitHub
            </NavBarButton>
        </a>
    </span>
    <div class="hamburger-button">
        <NavBarButton on:click={() => (sidemenu = !sidemenu)}>
            &equiv;
        </NavBarButton>
    </div>
</div>

{#if sidemenu}
    <Sidemenu />
{/if}

<style>
    div {
        height: 50px;
        background-color: rgb(0, 0, 30);

        color: white;

        display: flex;
        align-items: center;
        justify-content: space-between;

        text-align: center;

        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }

    p {
        font-size: 35px;
        margin: 0px;

        padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 10px;
        padding-left: 10px;

        text-align: center;
    }

    span {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: max-content;

        font-size: x-large;
    }

    .hamburger-button {
        font-size: 45px;
        display: flex;
        justify-content: flex-end;
    }

    a {
        color: white;
        text-decoration: none;
    }
</style>
