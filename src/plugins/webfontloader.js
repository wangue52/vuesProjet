/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */
export async function loadFonts() {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ 'webfontloader')

  webFontLoader.load({
    google: {
      api: 'https://fonts.googleapis.com/css2',
      families: ['Montserrat:ital,wght@0,700;1,700&display=swap'],
    },
  })
}
export default function () {
  loadFonts()
}

