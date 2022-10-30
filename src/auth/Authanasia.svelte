<script lang="ts">
    import { toast, SvelteToast } from "@zerodevx/svelte-toast";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { signInGoogle, signOut, currentUser } from "../firebase/auth";

    let loginPopupVisible = false;
    let usernameVisible = false;

    const loginPopupTransition = tweened(0, {
        duration: 500,
        easing: cubicOut,
    });

    const authProvidersTransition = tweened(1, {
        duration: 500,
        easing: cubicOut,
    });
    const usernameTransition = tweened(0, {
        duration: 500,
        easing: cubicOut,
    });

    const toastSuccessTheme = {
        theme: {
            "--toastColor": "mintcream",
            "--toastBackground": "rgba(72, 187, 120, 0.9)",
            "--toastBarBackground": "#2F855A",
        },
    };
    const toastErrorTheme = {
        theme: {
            "--toastColor": "mintcream",
            "--toastBackground": "rgba(187, 72, 72, 0.9)",
            "--toastBarBackground": "#852F2F",
        },
    };
</script>

<SvelteToast options={{ reversed: true, intro: { y: 192 } }} />

<div class="profile_container">
    <!-- svelte-ignore missing-declaration -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#if $currentUser == null}
        <img
            src="/login/profile_in.png"
            class="profile_button"
            alt="profile"
            height="75"
            on:click={() => {
                loginPopupVisible = true;
                loginPopupTransition.set(1);
            }}
        />
    {:else}
        <img
            src="/login/profile_out.png"
            class="profile_button"
            alt="profile"
            height="75"
            on:click={() => {
                signOut()
                    .then(() => {
                        toast.push(
                            "Successfully logged out!",
                            toastSuccessTheme
                        );
                    })
                    .catch(err => {
                        console.error(err);

                        toast.push("Failed to log out!", toastErrorTheme);
                    });
            }}
        />
    {/if}
</div>

{#if loginPopupVisible}
    <div class="login_popup_container" style="opacity: {$loginPopupTransition}">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="return_button"
            on:click={async () => {
                await loginPopupTransition.set(0);
                loginPopupVisible = false;
            }}
        >
            <img
                src="login/back.svg"
                alt=""
                style="width:100%;"
                draggable="false"
            />
        </div>

        <!-- svelte-ignore a11y-autofocus -->
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        {#if !usernameVisible}
            <div class="login_popup">
                <div
                    class="login_popup_inner"
                    style="opacity: {$authProvidersTransition}"
                >
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                        class="provider_button"
                        on:click={async () => {
                            signInGoogle()
                                .then(async () => {
                                    await authProvidersTransition.set(0);
                                    usernameVisible = true;
                                    await usernameTransition.set(1);
                                })
                                .catch(err => {
                                    console.error(err);

                                    toast.push(
                                        "Failed to sign in with Google!",
                                        toastErrorTheme
                                    );
                                });
                        }}
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                            alt=""
                        />
                        Login with Google
                    </div>
                    <div class="provider_button">
                        <img
                            src="login/github.png"
                            alt=""
                            style="filter: brightness(20);"
                        />
                        Login with GitHub
                    </div>
                    <div class="provider_button">
                        <img src="login/twitter.png" alt="" />
                        Login with Twitter
                    </div>
                    <div class="provider_button">
                        <img
                            src="https://play-lh.googleusercontent.com/ixHXzBWPmmKWIBxDMfjbIXK10UQCTDvIYOcs_uLXHCRbdsz2siJFYfb7MqckU8eC3Ks"
                            alt=""
                            style="border-radius: 12px"
                        />
                        Login with GD
                    </div>
                </div>
            </div>
        {/if}

        <!-- {#if usernameVisible} -->
        <div class="login_popup">
            <div class="username_container" style="opacity: 1">
                <div class="username_continue">Enter Username to continue:</div>

                <form>
                    <label for="username_input">Username</label>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        id="username_input"
                    />
                </form>
            </div>
        </div>
        <!-- {/if} -->
    </div>
{/if}

<style>
    .username_container {
        display: flex;
        padding: 16px;
        width: 100%;
        height: 100%;
        flex-direction: column;
        font-family: Cabin;
        color: white;
        justify-content: space-evenly;
    }

    .username_continue {
        font-size: 22px;
    }

    #username_input {
        border-radius: 20px;
        width: 100%;
        height: 32px;
        background: #000000bb;
        backdrop-filter: blur(16px);
        color: white;
        padding-left: 15px;
        outline: none;
        margin: 0;
    }

    .profile_container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        margin: 12px;
        right: 0;
    }
    .profile_button {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        align-self: flex-end;
    }
    .login_popup_container {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(20px);
        z-index: 10;
    }
    .login_popup {
        position: absolute;
        border-radius: 16px;
        background-color: #000000bb;
        backdrop-filter: blur(16px);
        box-shadow: 0 8px 16px 0 #000b;
        outline-offset: 2px;
        width: min(80%, 400px);
        height: min(80%, 400px);
    }
    .login_popup_inner {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        justify-content: center;
        align-items: center;
        gap: 16px;
        padding: 16px;
        width: 100%;
        height: 100%;
    }
    .provider_button {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        color: white;
        font-family: Cabin;
        font-size: 16px;
        gap: 16px;
        justify-content: center;
        align-items: center;
        transition: 0.1s ease-in-out;
        cursor: pointer;
        border-radius: 8px;
    }
    .provider_button:hover {
        background-color: #ffffff30;
    }
    .provider_button > img {
        width: 30%;
        height: 30%;
        pointer-events: none;
    }

    .return_button {
        position: absolute;
        top: 10px;
        left: 10px;
        padding: 5px 10px;
        font-family: Cabin;
        font-size: 16px;
        color: white;
        cursor: pointer;
        background-color: #000000bb;
        border-radius: 16px;
        transition: 0.2s linear;
    }
</style>
