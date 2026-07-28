# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-07-28
### Changed
- On PWA versions that render base typography through the `--sg-root-*` custom properties, the configured `font` shorthand is now decomposed and applied to the root element (`<html>`) via those custom properties instead of overriding `<body>`. This keeps the custom font in sync with the new theme (including the typography variants). Support is detected via the shared configuration collection (the PWA sets `CONFIGURATION_COLLECTION_KEY_HAS_ROOT_TYPOGRAPHY`), so the extension stays self-contained and older PWA versions keep the legacy `<body>` override.

## [1.1.0] - 2025-10-13
### Added
- Theme typography of PWA >= 7.29.0 can be configured via the new "typography" config setting.

## [1.0.0] - 2018-09-18
### Added
- Custom font can be achieved by configuring the extension with "url" and "rules" param. Where "url" is a stylesheet url and rules are additional CSS rules added to a body.

[1.0.0]: https://github.com/shopgate/ext-custom-fonts/tree/v1.0.0
