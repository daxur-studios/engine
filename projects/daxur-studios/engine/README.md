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

Install Peer Dependencies

```
    "rxjs": "~7.8.0",
    "three": "^0.153.0",
    "dexie": "^3.2.4"
```

# Engine

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.0.

## Code scaffolding

Run `ng generate component component-name --project engine` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project engine`.

> Note: Don't forget to add `--project engine` or else it will be added to the default project in your `angular.json` file.

## Build

Run `ng build engine` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build engine`, go to the dist folder `cd dist/engine` and run `npm publish`.

## Running unit tests

Run `ng test engine` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
