import { Component, OnChanges, Input, SimpleChange } from '@angular/core';

@Component({
    selector: 'password-strength-bar',
    styleUrls: ['password-strength-bar.component.scss'],
    templateUrl: 'password-strength-bar.component.html'
})
export class PasswordStrengthBar implements OnChanges {
    @Input() passwordToCheck: string;
    @Input() barLabel: string;
    bar0: string;
    bar1: string;
    bar2: string;
    bar3: string;
    bar4: string;

    private colors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];

    private static measureStrength(p) {
        let _force = 0;
        let _regex = /[$-/:-?{-~!"^_`\[\]]/g; // "

        let _lowerLetters = /[a-z]+/.test(p);
        let _upperLetters = /[A-Z]+/.test(p);
        let _numbers = /[0-9]+/.test(p);
        let _symbols = _regex.test(p);

        let _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];

        let _passedMatches = 0;
        for (let _flag of _flags) {
            _passedMatches += _flag === true ? 1 : 0;
        }

        _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
        _force += _passedMatches * 10;

        // penality (short password)
        _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

        // penality (poor variety of characters)
        _force = (_passedMatches === 1) ? Math.min(_force, 10) : _force;
        _force = (_passedMatches === 2) ? Math.min(_force, 20) : _force;
        _force = (_passedMatches === 3) ? Math.min(_force, 40) : _force;

        return _force;

    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        let password = changes['passwordToCheck'].currentValue;
        console.log(password);
        this.setBarColors(5, '#DDD');
        if (password) {
            let c = this.getColor(PasswordStrengthBar.measureStrength(password));
            this.setBarColors(c.idx, c.col);
        }
    }

    private getColor(s) {
        let idx = 0;
        if (s <= 10) {
            idx = 0;
        } else if (s <= 20) {
            idx = 1;
        } else if (s <= 30) {
            idx = 2;
        } else if (s <= 40) {
            idx = 3;
        } else {
            idx = 4;
        }
        return {
            col: this.colors[idx],
            idx: idx + 1
        };
    }

    private setBarColors(count, col) {
        for (let _n = 0; _n < count; _n++) {
            this['bar' + _n] = col;
        }
    }
}
