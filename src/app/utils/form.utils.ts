import { FormGroup } from "@angular/forms";

export function getDirtyValues(formGroup: FormGroup): any {
    const dirtyValues: any = {};
    Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.get(key);
        if (control?.dirty) {
            dirtyValues[key] = control.value;
        }
    });
    return dirtyValues;
}
