<script lang="ts">
    export let label = "";
</script>

<div on:click>{label}</div>

<style>
    div {
        height: 35px;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 20px;

        width: max-content;

        background-color: rgb(0, 100, 200);

        display: flex;

        align-items: center;
        justify-content: center;

        cursor: pointer;

        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }

    div:hover {
        background-color: rgb(0, 150, 250);
    }
</style>