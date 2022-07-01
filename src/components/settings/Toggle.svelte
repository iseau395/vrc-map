<script lang="ts">
    export let value = false;
    export let label = "Missing Label";
</script>

<div class="toggle-wrapper">
    <span>{label}:</span>
    <div>
        <div class="toggle {value ? "toggled" : ""}">
            <div class="toggle-circle"></div>
        </div>
        <input type="checkbox" bind:checked={value}/>
    </div>
</div>

<style>
    div.toggle-wrapper {
        display: flex;
    }

    div.toggle {
        position: absolute;

        background-color: gray;

        width: 45px;
        height: 20px;

        border-radius: 20px;

        display: flex;
        align-items: center;
        justify-content: flex-start;

        padding: 4px;

        animation-duration: 20ms;
    }

    div.toggle.toggled {
        background-color: rgb(100, 100, 250);
        justify-content: flex-end;
    }

    div.toggle-circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;

        background-color: white;
    }

    span {
        font-size: larger;
        margin-right: 10px;
    }

    input {
        position: absolute;

        width: 55px;
        height: 29px;

        margin: 0px;

        opacity: 0;
    }
</style>