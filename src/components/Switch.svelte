<script lang="ts">
    export let label: string;
    let checkbox: HTMLInputElement;
    export function click() {
        checkbox.click();
    }
</script>

<span>{label}: </span>
<label>
    <input type="checkbox" bind:this={checkbox} on:click />
    <span class="slider" />
</label>

<style>
    /* yoinked from https://www.w3schools.com/howto/howto_css_switch.asp (with some alterations) */

    label {
        position: relative;
        display: inline-block;
        width: 33px;
        height: 20px;
    }

    /* Hide default HTML checkbox */
    input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* The slider */
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #6d6868;
        -webkit-transition: 0.1s;
        transition: 0.1s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        -webkit-transition: 0.1s;
        transition: 0.1s;
    }

    input:checked + .slider {
        background-color: blue;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px blue;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(13px);
        -ms-transform: translateX(13px);
        transform: translateX(13px);
    }
</style>
