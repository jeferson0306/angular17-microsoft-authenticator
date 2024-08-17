import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ConsultaClienteService {

    constructor(private http: HttpClient) {
    }

    consultarClienteController(cpf: string): Observable<any> {
        const headers = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0'
        });
        return this.http.get(`${environment.baseUrl}/api/v1/clientes/consultar-cliente-mdm/${cpf}`, {headers});
    }
}
