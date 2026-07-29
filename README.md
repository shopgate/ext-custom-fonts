# Shopgate Connect - Custom Fonts Extension

[![GitHub license](http://dmlc.github.io/img/apache2.svg)](LICENSE)
[![Build Status](https://travis-ci.org/shopgate/ext-custom-fonts.svg?branch=master)](https://travis-ci.org/shopgate/ext-custom-fonts) [![Coverage Status](https://coveralls.io/repos/github/shopgate/ext-custom-fonts/badge.svg?branch=master)](https://coveralls.io/github/shopgate/ext-custom-fonts?branch=master)

This extension adds an additional CSS rule set to a "body" selector. By using it you can add specific font rules in order to make a web font specified in "url" config to be shown.

## Basic Configuration

Set the following values in your Shopgate Connect Admin:
* `url` - (text) URL for font import.
* `rules` - (object) Additional css params for \<body> element. Please use glamor style (camelCase, no prefixes)

### Example

```json
{
  "url": "https://fonts.googleapis.com/css?family=Roboto:400,400i,500,700,900",
  "rules": {
    "font": "16px/1.5 Roboto, Arial, sans-serif !important"
  }
}
```

Produces additional <link> element in the PWA app:
```html
<link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,700,900" rel="stylesheet">
```

And additional css rule is added to global stylesheet:
```css
body {
  font: 16px/1.5 Roboto, Arial, sans-serif !important;
}
```

> **Note on newer PWA versions (root typography):** On PWA versions that render base typography
> through the `--sg-root-*` custom properties, the `font` shorthand's **font-family** and
> **font-size** are applied to the root element so they stay in sync with the theme. Its
> **line-height** part is not applied here — base line-height is the `body1` typography variant, so
> configure it via the [`typography`](#extending-typography-of-the-pwa-theme) setting
> (`body1.lineHeight`) instead. Older PWA versions keep applying the whole `rules` object to
> `<body>` unchanged.

## Extending Typography of the PWA Theme
Starting with version 7.29.0, the PWA includes a theming system that allows you to customize various typography-related settings.

The theme’s typography configuration defines consistent text styles—such as those used for headings, body text, and other elements—that can be applied throughout the app to maintain a unified look and feel.

The default typography settings can be extended or overridden using the typography property in the extension configuration.
When this feature was first introduced, the theme was primarily applied to components newly developed for CMS 2.0, such as headline elements.

### Example
The following example shows a basic configuration that replaces the default `fontFamily` with a custom one. The `allVariants` object defines typography settings that are applied to all typography variants - here it changes the default text color. The `h1` object sets a custom font family, font weight and font size that's only used for h1 headlines (h2-h6 is certainly also supported).

The following example demonstrates a basic configuration that replaces the default `fontFamily` with a custom one.
The `h1` object customizes the H1 headline style by specifying a custom font family, font weight, and font size. (Styles for h2–h6 can also be defined in the same way.)

```json
{
  "fontFamily": "My Custom Font Regular",
  "h1": {
    "fontFamily": "My Custom Font Bold",
    "fontWeight": 900,
    "fontSize": 32,
  }
}
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) file for more information.

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) file for more information.

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

This extension is available under the Apache License, Version 2.0.

See the [LICENSE](./LICENSE) file for more information.
