import Widget0, { config as widgetConfig0 } from "./widgets/onboarding-flow/onboarding-flow"
import Widget1, { config as widgetConfig1 } from "./widgets/product-color-widget"

const LocalEntry = {
  identifier: "local",
  extensions: [
    { Component: Widget0, config: { ...widgetConfig0, type: "widget" } },
    { Component: Widget1, config: { ...widgetConfig1, type: "widget" } }
  ],
}

export default LocalEntry