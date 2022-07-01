<script lang="ts">

</script>

<div on:click>
    <slot></slot>
</div>

<style>
    div {
        min-width: 50px;
        height: 50px;
        text-align: center;

        padding-left: 10px;
        padding-right: 10px;

        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    div:hover {
        background-color: slategray;
    }

    div:active {
        background-color: darkslategray;
    }
</style>