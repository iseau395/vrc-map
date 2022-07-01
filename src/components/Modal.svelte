<script lang="ts">
    export let title = "Title Missing";
</script>

<div class="modal-background">
    <div class="modal">
        <div class="modal-top-bar">
            <h1>{title}</h1>
            <svg on:click>
                <line x1="5" y1="5" x2="35" y2="35" style="stroke:white;stroke-width:4"></line>
                <line x1="35" y1="5" x2="5" y2="35" style="stroke:white;stroke-width:4"></line>
            </svg>
        </div>
        <slot />
    </div>
</div>

<style>
    div.modal {
        width: 80vmin;
        height: 80vmin;

        max-width: 500px;
        max-height: 500px;

        background-color: rgb(30, 30, 45);
        border-radius: 5%;

        z-index: 2;

        position: relative;

        margin-left: auto;
        margin-right: auto;
        margin-top: 7vh;

        padding: 2vh;

        color: white;
        font-size: large;
    }

    div.modal-background {
        z-index: 1;

        background-color: rgba(0, 0, 0, 0.75);

        width: 100%;
        height: 100%;

        position: absolute;
    }

    div.modal-top-bar {
        display: flex;
        justify-content: space-between;
    }

    h1 {
        margin-top: 5px;
        display: inline;
    }

    svg {
        display: block;
        width: 40px;
        height: 40px;
    }
</style>