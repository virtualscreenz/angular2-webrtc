import { Component, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'nav-component',
    templateUrl: './nav.template.html'
})

export class NavComponent {

    user: Observable<any>;
    @Output() toggleoutput = new EventEmitter();

    constructor(private store: Store<any>) {
        this.user = this.store.select(store => store.user);
    }

    loginUser(): void {
        this.store.dispatch({ type: 'LOGIN_USER' });
    }

    logoutUser(): void {
        this.store.dispatch({ type: 'LOGOUT_USER' });
    }

    // Emits Output if nav should be toggled
    toggle(): void {
        this.toggleoutput.emit();
    }
}