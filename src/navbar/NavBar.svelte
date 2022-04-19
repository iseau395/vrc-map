<script lang="ts">
    import NavBarButton from "./NavBarButton.svelte";
</script>

<div>
    <span>
        <NavBarButton><p>VRC Field Map</p></NavBarButton>
    </span>
    <div class="hamburger-button">
        <NavBarButton>≡</NavBarButton>
    </div>
</div>

<style>
    div {
        height: 50px;
        background-color: rgb(0, 0, 30);

        color: white;

        display: flex;
        align-items: center;
        justify-content: space-between;
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