import { defineComponent, ref, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { v4 as uuidv4 } from "uuid";
import styles from "@/css/modules/core.module.scss";
import useAxios from "@/hooks/useAxios";
import useAlertDialog from "@/hooks/useAlertDialog";
import useFacebook from "@/hooks/useFacebook";

export default defineComponent({
    setup() {
        const firstname = ref<string>("");
        const midname = ref<string>("");
        const lastname = ref<string>("");
        const isLoading = ref<boolean>(false);
        const withoutLimit = ref<boolean>(false);

        const fb = useFacebook();
        const http = useAxios();
        const dialog = useAlertDialog();
        const v$ = useVuelidate({firstname: { required }}, { firstname });

        const fullname = computed(() => {
            return [firstname.value, midname.value, lastname.value]
                .filter(n => typeof n == "string" && n.trim() !== "")
                .map(n => n.trim())
                .join(" ")
                .trim()
        });

        async function changeName() {
            v$.value.$validate();

            if (v$.value.$error) {
                return;
            }

            isLoading.value = true;

            try
            {
                let response = null;

                if (fb.metaData.value.canChangeName) {
                    response = await http({
                        method: "post",
                        url: "https://accountscenter.facebook.com/api/graphql/#from=extension",
                        headers: {
                            "x-fb-friendly-name": "useFXIMNameValidatorQuery",
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        data: {
                            fb_api_caller_class: "RelayModern",
                            fb_api_req_friendly_name: "useFXIMNameValidatorQuery",
                            server_timestamps: true,
                            doc_id: "6814821225214519",
                            variables: JSON.stringify({
                                identity_ids: [fb.id.value!.toString()],
                                first_name: firstname.value,
                                middle_name: midname.value,
                                last_name: lastname.value,
                                scale: 1.5,
                                platform: "FACEBOOK"
                            })
                        }
                    })
        
                    const fxValidate = response.data.data.fx_identity_management.validate_name_v2;
        
                    if (fxValidate.is_valid == false) {
                        throw fxValidate.error_message.text;
                    }
                }

                const confirm = await dialog.confirm("Apakah kamu yakin ingin mengubah nama sekarang?", {
                    confirmText: "Iya",
                    cancelText: "Tidak"
                });

                if (!confirm.context.isConfirmed) {
                    return;
                }

                response = await http({
                    method: "post",
                    url: "https://accountscenter.facebook.com/api/graphql/#from=extension",
                    headers: {
                        "x-fb-friendly-name": "useFXIMUpdateNameMutation",
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        __ccg: "EXCELLENT",
                        __hs: fb.metaData.value.hasteSession,
                        __rev: fb.metaData.value.clientRevision,
                        __hsi: fb.metaData.value.hsi,
                        __comet_req: fb.metaData.value.cometEnv,
                        fb_api_caller_class: "RelayModern",
                        fb_api_req_friendly_name: "useFXIMUpdateNameMutation",
                        server_timestamps: true,
                        doc_id: "5763510853763960",
                        variables: JSON.stringify({
                            client_mutation_id: uuidv4(),
                            family_device_id: "device_id_fetch_datr",
                            identity_ids: [fb.id.value!.toString()],
                            interface: "FB_WEB",
                            ...((withoutLimit.value || fb.metaData.value.canChangeName == false) && fb.metaData.value.changeNameDefaultValue ? {
                                full_name: fullname.value,
                                first_name: fb.metaData.value.changeNameDefaultValue.firstName,
                                middle_name: fb.metaData.value.changeNameDefaultValue.middleName,
                                lastname: fb.metaData.value.changeNameDefaultValue.lastName
                                // last_name: (
                                //     fb.metaData.value.canChangeName && (fb.metaData.value.changeNameDefaultValue.fullName.trim().split(" ").length == 1
                                //         || fb.metaData.value.changeNameDefaultValue.fullName.trim().split(" ").pop() !== fb.metaData.value.changeNameDefaultValue.lastName.trim()
                                //     )
                                // ) ? "" : fb.metaData.value.changeNameDefaultValue.lastName
                            } : {
                                full_name: fullname.value,
                                first_name: firstname.value,
                                middle_name: midname.value,
                                last_name: lastname.value,
                            })
                        })
                    }
                });

                if (response.data.errors?.[0]) {
                    throw response.data.errors[0].description.__html;
                }

                if (!response.data.data?.fxim_update_identity_name) {
                    throw "Anda masalah tidak diketahui";
                }

                if (response.data.data.fxim_update_identity_name.error) {
                    throw `${response.data.data.fxim_update_identity_name.error.description} (${response.data.data.fxim_update_identity_name.error.error_code})`;
                }

                dialog.alert("Nama berhasil diubah").then(() => {
                    window.location.reload();
                });
            }
            
            catch (e: any) {
                dialog.alert(e.toString(), { title: "Kesalahan" });
            }

            finally {
                isLoading.value = false;
            }
        }

        return () => (
            <div class={[styles.card, styles.mb_4]}>
                <div class={styles.card_body}>
                    <p class={[styles.text_center, styles.mb_3]}>
                        Terlalu sering mengubah nama akan membuat facebook anda diblokir dari fitur ini untuk sementara
                    </p>
                    <div class={styles.form_control}>
                        <label
                            class={styles.form_control_label}
                            for="first-name"
                        >
                            Nama Depan
                        </label>
                        <input
                            class={[styles.form_control_input, {[styles.form_control_input_invalid]: v$.value.firstname.$error}]}
                            id="first-name"
                            placeholder="Isi nama depan"
                            v-model={firstname.value}
                            onInput={v$.value.firstname.$touch}
                        />
                        {v$.value.firstname.$error && (
                            <div class={styles.form_control_invalid_feedback}>
                                Nama depan harus diisi
                            </div>
                        )}
                    </div>
                    <div class={styles.form_control}>
                        <label
                            class={styles.form_control_label}
                            for="mid-name"
                        >
                            Nama Tengah (Opsional)
                        </label>
                        <input
                            class={styles.form_control_input}
                            id="mid-name"
                            placeholder="Isi nama tengah"
                            v-model={midname.value}
                        />
                        <small>Boleh diabaikan</small>
                    </div>
                    <div class={styles.form_control}>
                        <label
                            class={styles.form_control_label}
                            for="last-name"
                        >
                            Nama Belakang
                        </label>
                        <input
                            class={[styles.form_control_input]}
                            id="last-name"
                            placeholder="Isi nama belakang"
                            v-model={lastname.value}
                        />
                    </div>
                    {/* anti limit hanya bekerja dengan fb yang mempunyai nama lebih dari satu kata */}
                    {fb.metaData.value.canChangeName && fb.metaData.value.account.name.trim().split(" ").length > 1 && (
                        <div class={styles.form_control}>
                            <input
                                type="checkbox"
                                class={styles.form_control_input}
                                v-model={withoutLimit.value}
                                id="bypass-limit"
                            />
                            <label class={styles.form_control_label} for="bypass-limit">Anti Limit</label>
                            <small>Memungkinankan anda mengubah nama tanpa terkena limit 60 hari</small>
                        </div>
                    )}
                    <button
                        class={[styles.button, styles.w_100]}
                        disabled={v$.value.$error || isLoading.value || fb.metaData.value.account.name.trim().toLowerCase() == fullname.value.trim().toLowerCase()}
                        onClick={changeName}
                    >
                        {isLoading.value ? (
                            <FontAwesomeIcon icon="spinner" spin />
                        ) : "Ubah Nama"}
                    </button>
                </div>
            </div>
        )
    }
})