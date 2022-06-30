<script lang="ts">
    import Modal from "./components/Modal.svelte";
    import NavBar from "./components/navbar/NavBar.svelte";
    import Map from "./map/Map.svelte";

    const hasMouse = 'onmousemove' in window;

    const modal = {
        visible: true,
        body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum quo facere molestias culpa nobis magnam quibusdam? Ut quas voluptatibus voluptates eveniet natus molestias fuga deleniti voluptate labore commodi optio nobis totam quod cupiditate quasi eos culpa, aperiam impedit ea. Dicta pariatur fugiat porro, inventore provident obcaecati animi aliquam deserunt voluptate corporis sint voluptatem ipsum hic est. Illo voluptatum fugit blanditiis repellendus labore consequuntur omnis expedita, doloribus voluptatem tempora similique reprehenderit quos harum esse ipsam nulla sequi, maiores at a quibusdam praesentium debitis iure provident libero. Molestiae, et dolorem sunt sint labore temporibus doloremque quasi repudiandae odit nobis modi mollitia nam?",
        title: "This is a title"
    };
</script>

<NavBar />

{#if hasMouse}
<Map />
{:else}
<p>
    It looks like you are on a touchscreen only device like a phone or tablet.
    This field map doesn't work on touchscreen devices (yet), so try to instead use a device with a keyboard and mouse.
</p>
{/if}

{#if modal.visible}
<Modal title={modal.title} body={modal.body} on:click={() => modal.visible = false}/>
{/if}

<style>
    p {
        color: white;
        background-color: rgb(230, 125, 125);
        display: block;

        margin: 1cm;

        border-style: solid;
        border-width: 2px;
        border-color: red;

        max-width: 500px;

        border-radius: 10px;

        padding: 0.2cm;
    }
</style>