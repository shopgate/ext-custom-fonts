# Custom Fonts extension

[![Build Status](https://travis-ci.org/shopgate/ext-custom-fonts.svg?branch=master)](https://travis-ci.org/shopgate/ext-custom-fonts)

[![Coverage Status](https://coveralls.io/repos/github/shopgate/ext-custom-fonts/badge.svg?branch=master)](https://coveralls.io/github/shopgate/ext-custom-fonts?branch=master)

## Purpose of this extension
This extension adds an additional CSS rule set to a "body" selector. By using it you can add specific font rules in order to make a web font specified in "url" config to be shown.

## Examples

### Usage
Extension config:
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
