<script lang="ts">
    import { SvelteToast } from "@zerodevx/svelte-toast"

    import Auth from "./auth/Auth.svelte"
    import Editor from "./editor/Editor.svelte"
    import { currentUserData } from "./firebase/auth"
</script>

<SvelteToast options={{ reversed: true, intro: { y: 192 } }} />

{#if typeof $currentUserData != "string"}
    <Editor />
    <Auth loadedUserData={$currentUserData} />
{:else}
    <h1><pre>loading</pre></h1>
{/if}
<!-- <Countdown /> -->
<!-- 
<button
    style="position: absolute"
    on:click={() => {
        verifyCode({ uid: 782044, code: 123456 })
            .then((r) => console.log(r))
            .catch((e) => console.error(e))
    }}>verify</button
> -->
