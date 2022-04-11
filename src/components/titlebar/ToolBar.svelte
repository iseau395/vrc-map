<script lang="ts">
    import Slot from "./sections/Slot.svelte";
    import View from "./sections/View.svelte";
    import Help from "./sections/Help.svelte";

    const bar_contents = [
        {
            label: "Slot",
            component: Slot
        },
        {
            label: "View",
            component: View
        },
        {
            label: "Help",
            component: Help
        }
    ];
</script>

<div class="bar">
    {#each bar_contents as button}
        <div style="height: 24px; display: flex; align-items: center;">
            <span>
                {button.label}
            </span>
            <div class="dropdown-content">
                <svelte:component this={button.component} />
            </div>
        </div>
        <div class="seperator-line" />
    {/each}
</div>

<style>
    .bar {
        height: 24px;
        background-color: whitesmoke;
        border-bottom: black;

        display: flex;
        flex-direction: row;
        align-items: center;

        margin-bottom: 10px;

        border-style: solid;
        border-color: black;

        border-width: 0px;
        border-bottom-width: 1px;
    }

    span {
        padding-left: 10px;
        padding-right: 10px;

        padding-top: 3px;
        padding-bottom: 3px;

        border-style: solid;
        border-width: 0px;
        border-bottom-width: 1px;

        color: black;

        text-align: center;

        cursor: pointer;
    }

    .seperator-line {
        background-color: black;
        display: inline;
        width: 1px;
        height: 60%;
    }

    span:hover {
        background-color: rgb(220, 220, 220);
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        /* padding: 12px 16px; */
        z-index: 1;

        left: auto;

        left: inherit;

        top: 25px;
    }

    span:hover + .dropdown-content {
        display: block;
    }

    span + .dropdown-content:hover {
        display: block;
    }
</style>