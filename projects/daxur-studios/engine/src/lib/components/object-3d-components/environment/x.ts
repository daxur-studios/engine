import { FormControl, Validators } from '@angular/forms';

export function Editable(config: { min?: number; max?: number }) {
  return function (target: any, key: string) {
    const { min, max } = config;
    // Create a FormControl with initial value, and possibly min/max validators
    const control = new FormControl(target[key], [
      Validators.min(min ?? Number.MIN_SAFE_INTEGER),
      Validators.max(max ?? Number.MAX_SAFE_INTEGER),
    ]);

    // Ensure the target class has a controls map to store the form controls
    if (!target.controls) {
      Object.defineProperty(target, 'controls', {
        value: {},
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    // Add the control to the map
    target.controls[key] = control;

    // Replace the property with a getter and setter that sync with the FormControl
    Object.defineProperty(target, key, {
      get: () => control.value,
      set: (newValue: number) => control.setValue(newValue),
      enumerable: true,
      configurable: true,
    });
  };
}
