# Proyecto Movil (React)

App movil con React + Vite + TypeScript + Tailwind. Login y dashboard de usuarios mas
catalogo de productos usando FakeStoreAPI.

## Requisitos implementados (User Stories)

- **US03 - Catalogo general**: consume `GET /products`, muestra lista de productos
  con imagen, titulo y precio, indicador de carga y manejo de error con "Reintentar".
- **US04 - Filtrar por categoria**: `GET /products/categories` como chips filtrables,
  `GET /products/category/{category}` al seleccionar y opcion "Ver todos" para
  restablecer el catalogo.
- **US05 - Detalle del producto**: `GET /products/{id}` con imagen, titulo, precio,
  descripcion, categoria y rating. El rol se lee de la sesion local; solo el
  Administrador ve y usa los botones "Editar" (`PUT`) y "Eliminar" (`DELETE`).

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

## Comandos utiles

```bash
npm run dev      # servidor de desarrollo (puerto 3000)
npm run build    # compila TypeScript + build de produccion en dist/
npm run lint     # oxlint
npm run preview  # previsualizar el build de produccion
```

---

## Compilar APK (Android)

La app web se empaqueta en Android con [Capacitor](https://capacitorjs.com)
(`@capacitor/core`, `@capacitor/cli` y `@capacitor/android` ya estan en
`package.json`). La config esta en `capacitor.config.ts` (appId
`com.fleet.proyecto.movil`).

### Requisitos

- Node.js y npm.
- **JDK 17** y **Android SDK** (Android Studio). Gradle usa las variables
  `ANDROID_HOME` / `ANDROID_SDK_ROOT` para localizar el SDK.

### Pasos

```bash
# 1. Compilar la app web
npm run build

# 2. Añadir la plataforma Android (solo la primera vez; genera la carpeta android/)
npx cap add android

# 3. Copiar el build de dist/ al proyecto android
npx cap sync android

# 4. Compilar el APK (release)
cd android
.\gradlew.bat assembleRelease
cd ..

# APK resultante:
#   android/app/build/outputs/apk/release/app-release.apk
```

Alternativas:

- `.\gradlew.bat assembleDebug` para un APK de depuracion.
- Abrir la carpeta `android/` en Android Studio y usar "Build > Build App Bundle(s) / APK(s)".

Para ver la app en el telefono con depuracion:

```bash
npx cap run android
```