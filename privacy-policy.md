{
  "name": "bashnya",
  "version": "1.0.0",
  "private": true,
  "description": "Башня: игра на одно касание",
  "scripts": {
    "serve": "npx serve www",
    "add:android": "npx cap add android",
    "icons": "npx @capacitor/assets generate --android --assetPath resources",
    "sync": "npx cap sync android",
    "open:android": "npx cap open android"
  },
  "dependencies": {
    "@capacitor/android": "^7.0.0",
    "@capacitor/app": "^7.0.0",
    "@capacitor/core": "^7.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^7.0.0"
  }
}
