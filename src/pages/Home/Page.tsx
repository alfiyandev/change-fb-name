import { defineComponent } from "vue";
import styles from "@/css/modules/core.module.scss";
import Header from "./Header";
import Form from "./Form";
import Tips from "./Tips";
import Donate from "./Donate";

export default defineComponent({
    setup() {
        return () => (
            <div class={styles.container}>
                <Header />
                <Form />
                <Tips />
                <Donate />
                <div class={[styles.text_center, styles.mt_5]}>
                    <p>Made with 💖 by <b>Lumine.</b></p>
                </div>
            </div>    
        )
    }
})