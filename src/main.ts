import "./global.css";
import App from "./App.svelte";

import { signOut } from "./firebase/auth";

const app = new App({
    target: document.getElementById("app"),
});

export default app;
