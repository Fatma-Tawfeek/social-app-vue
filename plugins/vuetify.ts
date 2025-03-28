// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";
import { aliases, fa } from "vuetify/iconsets/fa";
import { mdi } from "vuetify/iconsets/mdi";
import { VFileUpload } from "vuetify/labs/VFileUpload";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDateInput } from "vuetify/labs/components";

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        icons: {
            defaultSet: "fa",
            aliases,
            sets: {
                fa,
                mdi,
            },
        },
        components: {
            VDateInput,
            VFileUpload,
        },
    });
    app.vueApp.use(vuetify);
});
