import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClienteDataService {

    private clienteSource = new BehaviorSubject<any>(null);
    currentCliente = this.clienteSource.asObservable();

    constructor() {
    }

    preencherDadosCliente(cliente: any) {
        this.clienteSource.next(cliente);
    }
}
