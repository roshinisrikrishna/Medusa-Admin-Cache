import Widget0, { config as widgetConfig0 } from "./widgets/customer-widget"
import Widget1, { config as widgetConfig1 } from "./widgets/multiple-product-widget"
import Widget2, { config as widgetConfig2 } from "./widgets/onboarding-flow/onboarding-flow"
import Widget3, { config as widgetConfig3 } from "./widgets/order-widget"
import Widget4, { config as widgetConfig4 } from "./widgets/product-color-widget"
import Widget5, { config as widgetConfig5 } from "./widgets/product-widget"
import Widget6, { config as widgetConfig6 } from "./widgets/sample-widget"
import Page0 from "./routes/analytics/page"
import Page1 from "./routes/resetPassword/page"
import Page2 from "./routes/screen-access/page"

const LocalEntry = {
  identifier: "local",
  extensions: [
    { Component: Widget0, config: { ...widgetConfig0, type: "widget" } },
    { Component: Widget1, config: { ...widgetConfig1, type: "widget" } },
    { Component: Widget2, config: { ...widgetConfig2, type: "widget" } },
    { Component: Widget3, config: { ...widgetConfig3, type: "widget" } },
    { Component: Widget4, config: { ...widgetConfig4, type: "widget" } },
    { Component: Widget5, config: { ...widgetConfig5, type: "widget" } },
    { Component: Widget6, config: { ...widgetConfig6, type: "widget" } },
    { Component: Page0, config: { path: "/analytics", type: "route" } },
    { Component: Page1, config: { path: "/resetPassword", type: "route" } },
    { Component: Page2, config: { path: "/screen-access", type: "route" } }
  ],
}

export default LocalEntry