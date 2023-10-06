import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import styles from "@/css/modules/core.module.scss";

export default defineComponent({
    setup() {
        function donate() {
            chrome.tabs.create({url: "https://trakteer.id/lumine_id?open=true", active: true, index: 0});
        }

        return () => (
            <div class={[styles.card, styles.mt_3, styles.mb_3]}>
                <div class={styles.card_body}>
                    <div class={styles.row}>
                        <div class={[styles.col_8]}>
                            <div class={[styles.d_flex, styles.justify_center]}>
                                <div class={styles.d_flex}>
                                    <a href="https://www.facebook.com/lumine.id" target="_blank" class={styles.icon_link}>
                                        <FontAwesomeIcon icon={["fab", "facebook"]} size="3x" />
                                    </a>
                                    <a href="https://wa.me/6281320842002" target="_blank" class={styles.icon_link}>
                                        <FontAwesomeIcon icon={["fab", "whatsapp"]} size="3x" />
                                    </a>
                                    <a href="https://instagram.com/lumine809" target="_blank" class={styles.icon_link}>
                                        <FontAwesomeIcon icon={["fab", "instagram"]} size="3x" />
                                    </a>
                                </div>
                            </div>
                            <div>
                                <p>
                                    Donasi untuk membatu saya membeli kopi agar saya semangat dalam berkarya. Terimakasih
                                </p>
                            </div>
                            <button class={styles.button} onClick={donate}>
                                Donasi Sekarang
                            </button>
                        </div>
                        <div class={[styles.col_4, styles.d_flex, styles.align_items_center]}>
                            <img class={styles.img_responsive} src="/assets/img/donate.png" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})