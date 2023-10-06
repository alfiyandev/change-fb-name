import { defineComponent } from "vue";
import styles from "@/css/modules/core.module.scss";
import useFacebook from "@/hooks/useFacebook";

export default defineComponent({
    setup() {
        const fb = useFacebook();

        return () => {
            if (!fb.metaData.value.canChangeName) {
                const changeNameUrl = `https://accountscenter.facebook.com/profiles/${fb.id.value}/name`;
                return (
                    <div class={[styles.card, styles.mb_4]}>
                        <div class={styles.card_title}>
                            <h3 class={styles.text_center}>Tips</h3>
                        </div>
                        <div class={styles.card_body}>
                            <p>Pastikan nama yang ingin anda ganti valid karena tidak semua karakter diterima oleh Facebook</p>
                            <p>Cara mengetahuinya: </p>
                            <ul>
                                <li>Pergi ke halaman ubah nama <a href={changeNameUrl} target="_blank">{changeNameUrl}</a></li>
                                <li>Isikan <b>nama depan</b>, <b>nama tengah</b>, dan <b>nama belakang</b> dengan nama yang anda inginkan</li>
                                <li>Lalu klik <b>Ubah</b>. jika tidak ada keterangan kesalahan atau berganti ke halaman <b>Pertinjau Nama</b> berarti karakter yang anda pakai valid. langung saja kembali jangan klik <b>Selesai</b></li>
                            </ul>
                        </div>
                    </div>
                )
            }
        }
    }
})