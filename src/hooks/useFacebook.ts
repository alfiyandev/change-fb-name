import { createGlobalState } from "@vueuse/core";
import { readonly, ref, computed, Ref, DeepReadonly, WritableComputedRef } from "vue";
import axios from "axios";

interface UseFacebookReturn {
    cookies: DeepReadonly<Ref<Record<string, any>>>
    metaData: DeepReadonly<Ref<Record<string, any>>>
    profilePicture: WritableComputedRef<string | null>
    name: WritableComputedRef<string>
    id: WritableComputedRef<number | null>
    isLogin: WritableComputedRef<boolean>
    loadCookies: () => Promise<void>
    loadMetaData: () => Promise<void>
}

export default createGlobalState<() => UseFacebookReturn>((): UseFacebookReturn => {
    const cookies  = ref<Record<string, any>>({});
    const metaData = ref<Record<string, any>>({});

    async function loadCookies(): Promise<void> {
        cookies.value = await new Promise(resolve => {
            chrome.cookies.getAll({domain: "facebook.com"}, (cookie) => {
                const result: Record<string, any> = cookie.reduce((cookie, item) => ({...cookie, [item.name]: item.value}), {});
                resolve(result)
            });
        });
    }

    async function loadMetaData(): Promise<void> {
        metaData.value = await new Promise(resolve => {
            if (!isLogin.value) {
                return resolve({})
            }

            axios.get(`https://accountscenter.facebook.com/profiles/${id.value}/name`).then(response => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(response.data, "text/html");

                const script = Array.from(dom.querySelectorAll("script[type='application/json']"));
                const contentScript = script.find(el => Boolean(el.innerHTML.match(/DTSGInitialData/)));

                if (!contentScript) {
                    return resolve({});
                }

                const data: Array<[string, any[], Record<string, any>, number]> = JSON.parse(contentScript.innerHTML).require[0].pop()[0].__bbox.define
                // console.log(data.reduce((data, item) => ({...data, [item[0]]: item[2]}), {}));
                const result = data.reduce((data: Record<string, any>, item) => {
                    switch (item[0]) {
                        case "DTSGInitialData":
                            data["dtsg"] = item[2].token;
                            break;
                        case "LSD":
                            data["lsd"] = item[2].token;
                            break;
                        case "ServerNonce":
                            data["serverNonce"] = item[2].ServerNonce;
                            break;
                        case "CurrentUserInitialData":
                            data["account"]              = {};
                            data["account"]["userId"]    = item[2].USER_ID;
                            data["account"]["appId"]     = item[2].APP_ID;
                            data["account"]["shortName"] = item[2].SHORT_NAME;
                            data["account"]["name"]      = item[2].NAME;
                            break;
                        case "SiteData":
                            data["spinB"]          = item[2].__spin_b;
                            data["spinR"]          = item[2].__spin_r;
                            data["spinT"]          = item[2].__spin_t;
                            data["hsi"]            = item[2].hsi;
                            data["hasteSession"]   = item[2].haste_session;
                            data["pixelRatio"]     = item[2].pr;
                            data["cometEnv"]       = item[2].comet_env;
                            data["clientRevision"] = item[2].client_revision;
                            data["serverRevision"] = item[2].server_revision;
                            break;
                    }

                    return data;
                }, {});

                for (const el of script) {
                    if (el.innerHTML.match(/jazoest=([0-9]+)/)) {
                        result["jazoest"] = el.innerHTML.match(/jazoest=([0-9]+)/)?.[1]
                    }

                    if (el.innerHTML.match(/"can_change_name":(true|false)/)) {
                        const data = JSON.parse(el.innerHTML).require;
                        for (const item of data[0].pop()) {
                            if (item.__bbox) {
                                for (const bbox of item.__bbox.require) {
                                    if (bbox[0] == "RelayPrefetchedStreamCache") {
                                        const fximIdentity = bbox.pop()[1].__bbox.result.data.fxim_identity_for_id;
                                        const name = fximIdentity.screen_rules.name;
                                        result["canChangeName"] = name.legacy_name_data.can_change_name;
                                        result["changeNameDefaultValue"] = {
                                            firstName: name.default_value.firstname,
                                            lastName: name.default_value.lastname,
                                            fullName: name.default_value.fullname,
                                            middleName: name.default_value.middlename
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                resolve(result);
            }).catch(() => resolve({}))
        })
    }

    const profilePicture = computed<string | null>(() => {
        return (id.value
            ? `https://graph.facebook.com/${id.value}/picture?height=512&width=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`
            : null
        );
    });

    const name = computed<string>(() => {
        return String(metaData.value.account?.name || "")
    })

    const id = computed<null | number>(() => {
        return (Number(cookies.value.c_user) || null)
    });

    const isLogin = computed<boolean>(() => {
        return id.value !== null
    });

    return {
        cookies: readonly(cookies),
        metaData: readonly(metaData),
        profilePicture,
        name,
        id,
        isLogin,
        loadCookies,
        loadMetaData
    }
});