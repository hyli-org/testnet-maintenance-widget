import { defineCustomElement } from "vue";
import MW from "./MaintenanceWidget.ce.vue";

// convert into custom element constructor
export const MaintenanceWidget = defineCustomElement(MW);

export const declareCustomElement = () => {
    if (!customElements.get("maintenance-widget")) {
        customElements.define("maintenance-widget", MaintenanceWidget);
    }
};

export type MaintenanceWidgetProps = {
    showAsleep?: boolean;
    showHeavyLoad?: boolean;
    // To overwrite the default node URL
    nodeurl?: string;
};
