<script lang="ts">
    import Auth from "./auth/Auth.svelte"
    import Editor from "./editor/Editor.svelte"
    import { currentUserData } from "./firebase/auth"

    import { sendMessage } from "./firebase/init"
</script>

<!-- <button
    on:click={() => {
        signInGoogle();
    }}>sign in google</button
>
<button
    on:click={() => {
        signOut();
    }}>sign out</button
> -->
{#if typeof $currentUserData != "string"}
    <Editor />
    <Auth loadedUserData={$currentUserData} />
{:else}
    <h1><pre>loading</pre></h1>
{/if}
<!-- <h2><pre>{JSON.stringify($currentUserData, null, 4)}</pre></h2> -->
<button
    style="position: absolute"
    on:click={() => {
        sendMessage({ username: "DreamingSanity" })
    }}>send message</button
>
