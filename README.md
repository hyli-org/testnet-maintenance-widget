# Testnet maintenance widget

# Usage

Import the custom element, declare it

```ts
import { declareCustomElement } from "testnet-maintenance-widget";
declareCustomElement();
```

Then use it in your HTML:

```html
<maintenance-widget nodeurl="http://localhost" show-asleep="false" show-heavy-load="false"></maintenance-widget>
```
