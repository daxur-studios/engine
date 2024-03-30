# Getting Started

```
npm i @daxur-studios/engine
```

Or if developing the engine locally
add to package.json

```
"start": "npm link @daxur-studios/engine && ng serve"
```

Add this to your tsconfig.json, this is needed to fix injection errors

```
"paths": {
    "@angular/*": ["./node_modules/@angular/*"],
    "@daxur-studios/engine": ["./node_modules/@daxur-studios/engine"]
},
```

Add this to your global styles.scss

```
@import url("../node_modules/@daxur-studios/engine/assets/daxur-engine.css");
```

Update assets in angular.json

```
"assets": [
    "src/assets",
    {
    "glob": "**/*",
    "input": "./node_modules/@daxur-studios/engine/assets",
    "output": "/assets/daxur-engine"
    }
],
```

Install Peer Dependencies

```
    "three": "^0.162.0",
    "@types/three": "^0.162.0",
    "dexie": "^3.2.4"
```

Install Types (IMPORTANT)

```
"@types/three"
```

# Errors

If you get this error make sure you've added it to the correct assets array, not the one in the test section

```
loader.service.ts:33
       GET http://localhost:4200/assets/daxur-engine/draco/draco_wasm_wrapper.js net::ERR_ABORTED 404 (Not Found)
```

## Cannot read property 'firstCreatePass' of null

add this to angular.json at architect.configurations.development

```
"preserveSymlinks": true,
```
