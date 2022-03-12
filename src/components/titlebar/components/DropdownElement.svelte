<div>
    <slot />
</div>

<style>
    div {
        display: flex;
        align-items: center;
        cursor: pointer;
        z-index: -1;

        border-style: solid;
        border-color: black;

        border-width: 0px;
        border-bottom-width: 1px;
        border-left-width: 1px;
        border-right-width: 1px;
    }

    div:hover {
        background-color: rgb(220, 220, 220);
    }
</style>