<script lang="ts">
    import { toast } from "@zerodevx/svelte-toast"
    import { toastErrorTheme, toastSuccessTheme } from "../const"

    import {
        canEdit,
        initUserData,
        signInGithub,
        signInGoogle,
        signOut,
        type UserData,
    } from "../firebase/auth"

    export let loadedUserData: UserData | null

    const loginButtons = [
        {
            image: "google.svg",
            name: "Google",
            cb: () => {
                buttonsDisabled = true
                signInGoogle()
                    .then(() => {
                        loginPopupVisible = false
                        buttonsDisabled = false

                        toast.push("Login Successful!", toastSuccessTheme)
                    })
                    .catch((err) => {
                        console.error(err)
                        buttonsDisabled = false

                        toast.push("Failed to login!", toastErrorTheme)
                    })
            },
        },
        {
            image: "github.svg",
            name: "GitHub",
            cb: () => {
                buttonsDisabled = true
                signInGithub()
                    .then(() => {
                        loginPopupVisible = false
                        buttonsDisabled = false

                        toast.push("Login Successful!", toastSuccessTheme)
                    })
                    .catch((err) => {
                        console.error(err)
                        buttonsDisabled = false

                        toast.push("Failed to login!", toastErrorTheme)
                    })
            },
        },
        {
            image: "twitter.svg",
            name: "Twitter",
            cb: () => {},
        },
        {
            image: "gd.png",
            name: "GD",
            cb: () => {},
        },
    ]

    let loginPopupVisible = false

    let buttonsDisabled = false

    let usernameInput = ""
    $: validUsername = usernameInput.match(/^[A-Za-z0-9_-]{3,15}$/)
</script>

<div class="all">
    {#if loadedUserData == null}
        <button
            class="log_in_out_button invis_button wiggle_button"
            on:click={() => {
                loginPopupVisible = true
            }}
        >
            <img
                draggable="false"
                src="login/profile_in.png"
                alt="login button"
            />
        </button>
    {:else}
        <button
            class="log_in_out_button invis_button wiggle_button"
            on:click={() => {
                signOut()
                    .then(() => {
                        toast.push(
                            "Successfully logged out!",
                            toastSuccessTheme
                        )
                    })
                    .catch((err) => {
                        console.error(err)
                        toast.push("Failed to log out!", toastErrorTheme)
                    })
            }}
        >
            <img
                draggable="false"
                src="login/profile_out.png"
                alt="logout button"
            />
        </button>
        {#if loadedUserData.data != null && typeof loadedUserData.data != "string"}
            <div class="username_display">{loadedUserData.data.username}</div>
        {/if}
    {/if}

    {#if loginPopupVisible && loadedUserData == null}
        <div class="login_popup_container">
            <button
                class="back_button invis_button wiggle_button blur_bg"
                on:click={() => {
                    loginPopupVisible = false
                }}
            >
                <img draggable="false" src="login/back.svg" alt="back arrow" />
            </button>
            <div class="login_popup blur_bg">
                {#each loginButtons as button}
                    <button
                        disabled={buttonsDisabled}
                        class="login_method_button invis_button"
                        on:click={button.cb}
                    >
                        <img
                            draggable="false"
                            src="login/{button.image}"
                            alt="login provider"
                        />
                        Login with {button.name}
                    </button>
                {/each}
            </div>
        </div>
    {/if}

    {#if loadedUserData != null && !$canEdit}
        <div class="login_popup_container">
            {#if typeof loadedUserData.data != "string"}
                <div class="username_form">
                    Create your username: <input
                        bind:value={usernameInput}
                        class="username_input"
                        type="text"
                        required
                    />
                    <button
                        disabled={!validUsername}
                        style:opacity={validUsername ? "1" : "0.25"}
                        class="checkmark_button invis_button wiggle_button"
                        on:click={() => {
                            initUserData(loadedUserData.user.uid, usernameInput)
                        }}
                    >
                        <img
                            draggable="false"
                            src="login/check.png"
                            alt="checkmark"
                            width="50px"
                        />
                    </button>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .all {
        position: absolute;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        pointer-events: none;
        z-index: 50;
    }
    .all * {
        pointer-events: auto;
    }
    .log_in_out_button {
        position: absolute;
        margin-top: 16px;
        margin-right: 14px;
    }
    .username_display {
        position: absolute;
        margin-top: 32px;
        margin-right: 100px;
        font-family: Pusab;
        font-size: 32px;
        color: white;
        text-align: right;
        text-shadow: 0 2px 6px #000d;
        -webkit-text-stroke: 1px black;
    }
    .log_in_out_button > img {
        width: 75px;
    }
    .login_popup_container {
        width: 100%;
        height: 100%;
        background-color: #0008;
        backdrop-filter: blur(32px);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .blur_bg {
        background-color: #1113;
        backdrop-filter: blur(16px);
    }
    .login_popup {
        position: absolute;
        width: min(400px, 90%);
        height: min(400px, 90%);
        border-radius: 16px;
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
        padding: 8px;
        gap: 8px;
    }
    .login_method_button > * {
        width: 60px;
        height: 60px;
        object-fit: contain;
    }
    .login_method_button {
        background-color: transparent;
        border-radius: 8px;
        transition: all 0.1s;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: white;
        font-family: Cabin;
        font-size: 16px;
        gap: 16px;
    }
    .login_method_button:enabled {
        cursor: pointer;
    }
    .login_method_button:enabled:hover {
        background-color: #fff2;
    }
    .login_method_button:disabled {
        opacity: 0.25;
    }
    .back_button {
        position: absolute;
        top: 8px;
        left: 8px;
        width: 70px;
        height: 50px;
        color: white;
        border-radius: 8px;
        font-family: Cabin;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.1s;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .username_form {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        align-items: center;
        font-family: Pusab;
        font-size: 32px;
        color: white;
        gap: 16px;
    }
    .username_input {
        width: 300px;
        height: 60px;
        outline: none;
        border: 2px solid white;
        background-color: #1113;
        backdrop-filter: blur(16px);
        border-radius: 8px;
        font-family: Pusab;
        font-size: 24px;
        color: white;
        text-align: center;
    }
</style>
