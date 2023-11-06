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
    "rxjs": "~7.8.0",
    "three": "^0.153.0",
    "dexie": "^3.2.4"
```
