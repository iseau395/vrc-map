<script lang="ts">
    import { fly } from 'svelte/transition';
</script>

<div transition:fly="{{ x: 200, duration: 100 }}">
    <a href="./spin-up">Spin Up</a>
    <a href="./tipping-point">Tipping Point</a>
</div>

<style>
    div {
        background-color: rgb(30, 30, 45);
        height: calc(100% - 50px);
        z-index: 1;

        width: 20%;
        position: absolute;
        right: 0px;

        display: flex;
        flex-direction: column;
    }
</style>