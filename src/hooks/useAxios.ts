import axios, { AxiosInstance } from "axios";
import useFacebook from "./useFacebook";
import utils from "../utils";

export default function useAxios(): AxiosInstance {
    const instance = axios.create();
    const fb = useFacebook();

    instance.interceptors.request.use((config) => {
        if (config.headers["Content-Type"] === "application/x-www-form-urlencoded" && typeof config.data == "object") {
            config.data = utils.objectToFormData(config.data)
        }
        if (fb.isLogin.value && config.url) {
            const url = new URL(config.url);
            if (url.hostname.match(/(www|m|accountscenter).facebook.com/i)) {
                if (url.pathname.replace(/\/$/, "").trim() === "/api/graphql" && String(config.method).toLowerCase() === "post") {
                    if (config.data instanceof FormData) {
                        config.data.append("av", String(fb.id.value));
                        config.data.append("__usr", String(fb.id.value));
                        config.data.append("__a", "1");
                        config.data.append("__req", utils.randomString(1).toLocaleLowerCase());
                        if (fb.metaData.value.pixelRatio) {
                            config.data.append("dpr", fb.metaData.value.pixelRatio);
                        }
                        if (fb.metaData.value.dtsg) {
                            config.data.append("fb_dtsg", fb.metaData.value.dtsg);
                        }
                        if (fb.metaData.value.lsd) {
                            config.data.append("lsd", fb.metaData.value.lsd);
                            config.headers["x-fb-lsd"] = fb.metaData.value.lsd;
                        }
                        if (fb.metaData.value.jazoest) {
                            config.data.append("jazoest", fb.metaData.value.jazoest);
                        }
                        if (fb.metaData.value.spinR) {
                            config.data.append("__spin_r", fb.metaData.value.spinR);
                        }
                        if (fb.metaData.value.spinB) {
                            config.data.append("__spin_b", fb.metaData.value.spinB);
                        }
                        if (fb.metaData.value.spinT) {
                            config.data.append("__spin_t", fb.metaData.value.spinT);
                        }
                    }
                }
            }
        }

        return config
    });

    return instance;
}