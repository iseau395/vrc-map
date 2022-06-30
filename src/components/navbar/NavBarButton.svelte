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
    }

    div:hover {
        background-color: slategray;
    }

    div:active {
        background-color: darkslategray;
    }
</style>