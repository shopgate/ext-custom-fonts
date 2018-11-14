# Shopgate Connect - Custom Fonts Extension

[![GitHub license](http://dmlc.github.io/img/apache2.svg)](LICENSE)
[![Build Status](https://travis-ci.org/shopgate/ext-custom-fonts.svg?branch=master)](https://travis-ci.org/shopgate/ext-custom-fonts) [![Coverage Status](https://coveralls.io/repos/github/shopgate/ext-custom-fonts/badge.svg?branch=master)](https://coveralls.io/github/shopgate/ext-custom-fonts?branch=master)

This extension adds an additional CSS rule set to a "body" selector. By using it you can add specific font rules in order to make a web font specified in "url" config to be shown.

## Configuration

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
