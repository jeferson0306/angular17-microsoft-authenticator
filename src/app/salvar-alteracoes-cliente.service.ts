import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SalvarAlteracoesClienteService {

    constructor(private http: HttpClient) {
    }

    salvarCadastroController(cliente: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json', 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0'
        });
        return this.http.post(`${environment.baseUrl}/api/v1/clientes/editar-cliente`, cliente, {headers});
    }

}
