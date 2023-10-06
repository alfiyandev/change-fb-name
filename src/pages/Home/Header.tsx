import { defineComponent } from "vue";
import styles from "@/css/modules/core.module.scss";
import useFacebook from "@/hooks/useFacebook";

export default defineComponent({
    setup() {
        const fb = useFacebook();

        return () => (
            <>
                <div class={[styles.card, styles.mb_4, styles.mt_5]}>
                    <div class={[styles.card_body, styles.position_relative]}>
                        <div class={[styles.d_flex, styles.justify_center]}>
                            <div class={styles.position_absolute} style={{ top: "-80px" }}>
                                <img
                                    src={fb.profilePicture.value!}
                                    class={[styles.img_thumbnail, styles.rounded_circle]}
                                    style={{ width: "150px", height: "150px" }}
                                />
                            </div>
                        </div>
                        <br />
                        <div class={styles.mt_4}>
                            <h2 class={styles.text_center}>{fb.name.value}</h2>
                        </div>
                    </div>
                </div>
                {fb.metaData.value.canChangeName == false && (
                    <div class={[styles.card, styles.mb_4]}>
                        <div class={[styles.card_body, styles.text_center, styles.text_danger]}>
                            <p>Nama anda limit karena sudah mengganti nama sebelumnya. tapi tenang saja disini anda dapat mengganti nama fb anda kapanpun walaupun sudah limit</p>
                        </div>
                    </div>
                )}
            </>
            
        )
    }
});