import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ConsultaClienteService} from "../consulta-cliente.service";
import {ClienteDataService} from "../cliente-data-service";
import {ToastrService} from "ngx-toastr";

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css'
})
export class ConsultaComponent implements OnInit {

  profile: ProfileType | undefined;
  cadastroForm: FormGroup;
  isEditing = false;
  public cpfErrorShown = false;

  constructor(private fb: FormBuilder, private consultaClienteService: ConsultaClienteService, private router: Router, private clienteDataService: ClienteDataService, private toastr: ToastrService, private http: HttpClient) {
    this.cadastroForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      nome: [{value: '', disabled: true}],
      sobrenome: [{value: '', disabled: true}],
      dtNascimento: [{value: '', disabled: true}],
      genero: [{value: '', disabled: true}],
      telefone: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      emailOptin: [{value: '', disabled: true}]
    });
  }

  ngOnInit() {
    this.getProfile(environment.apiConfig.uri);
    this.cadastroForm.get('cpf')?.valueChanges.subscribe(() => {
      this.isInvalidCPF();
    });
  }

  getProfile(url: string) {
    this.http.get(url)
      .subscribe(profile => {
        this.profile = profile;
      });
  }

  consultarCpf() {
    const cpf = this.cadastroForm.get('cpf')?.value;
    if (cpf) {
      this.consultaClienteService.consultarClienteController(cpf).subscribe({
        next: (data) => {
          if (this.isClientDataEmpty(data)) {
            this.toastr.warning('Cliente não encontrado.', 'Atenção!', {timeOut: 5000});
          } else {
            this.clienteDataService.preencherDadosCliente(data);
            this.router.navigate(['/retorno']);
          }
        }, error: (error) => {
          this.toastr.error('Erro ao consultar CPF. Tente novamente.', error, {timeOut: 4000});
        }
      });
    }
  }

  isClientDataEmpty(data: any): boolean {
    return !data.nome && !data.sobrenome && !data.dtNascimento && !data.genero && !data.telefone && !data.email;
  }

  isInvalidCPF(): void {
    const cpf = this.cadastroForm.get('cpf')?.value;
    if (!cpf) {
      return;
    }
    const digits = cpf.replace(/\D/g, '').length;
    if (digits === 11 && !this.isValidCPF(cpf)) {
      if (!this.cpfErrorShown) {
        this.toastr.error('CPF inválido. Certifique-se de que digitou o número corretamente.', "Cpf Invalido", {timeOut: 4000});
        this.cpfErrorShown = true;
      }
    } else {
      this.cpfErrorShown = false;
    }
  }

  isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D+/g, '');
    if (cpf.length !== 11) return false;
    let sum = 0, remainder;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    return remainder === parseInt(cpf.substring(10, 11));
  }

  limparCpf() {
    const cpf = this.cadastroForm.get('cpf');
    cpf?.setValue('')
    cpf?.markAsUntouched()
    this.cpfErrorShown = false;
  }

}
