import { FormControl } from '@angular/forms';

export function MinImages(c: FormControl) {
    if (c.value === 0) {
        return {
            MinImages: {
                valid: false
            }
        };
    }
}