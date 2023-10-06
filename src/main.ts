import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFacebook, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import App from "./App.tsx";
import "./css/style.scss";

library.add(
    faFacebook,
    faWhatsapp,
    faInstagram,
    faSpinner
)

createApp(App).mount("#app")
