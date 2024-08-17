import {Component, OnInit} from '@angular/core';
import {ClienteResponse} from "../cliente-response.model";
import {ClienteDataService} from "../cliente-data-service";
import {Router} from "@angular/router";
import {SalvarAlteracoesClienteService} from "../salvar-alteracoes-cliente.service";
import {ToastrService} from "ngx-toastr";
import {MsalService} from "@azure/msal-angular";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};

@Component({
  selector: 'app-retorno',
  standalone: true,
  imports: [
    NgClass,
    FormsModule
  ],
  templateUrl: './retorno.component.html',
  styleUrl: './retorno.component.css'
})
export class RetornoComponent implements OnInit {

  cliente: any = {
    cdDocPes: '', lastAcqDt: '', noPes: '', dsSbrPes: '', dtNsc: '', dsGeneroPessoa: '', telefoneCompleto: '', email: {
      dsEmailCttPes: '', inNotEmail: ''
    }
  };
  originalCliente: any;
  isEditable = false;
  isChanged = false;
  editMode = false;
  profile: ProfileType | undefined;

  constructor(private clienteDataService: ClienteDataService, private router: Router, private salvarAlteracoesClienteService: SalvarAlteracoesClienteService, private toastr: ToastrService, private msalService: MsalService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getProfile(environment.apiConfig.uri);
    this.clienteDataService.currentCliente.subscribe(cliente => {
      this.cliente = this.substituirValoresNulosPorStringVazia({...cliente});
      this.formatarTelefone();
      this.originalCliente = JSON.parse(JSON.stringify(this.cliente));
    });
  }

  getProfile(url: string) {
    this.http.get(url)
      .subscribe(profile => {
        this.profile = profile;
      });
  }

  substituirValoresNulosPorStringVazia(obj: any): any {
    Object.keys(obj).forEach(key => {
      if (obj[key] === null || obj[key] === "NULL") {
        if (key === 'email') {
          obj[key] = {dsEmailCttPes: '', inNotEmail: ''};
        } else if (key === 'telefone') {
          obj[key] = {nuDddTelCttPes: '', nuTelCttPes: ''};
        } else {
          obj[key] = '';
        }
      } else if (typeof obj[key] === 'object') {
        obj[key] = this.substituirValoresNulosPorStringVazia(obj[key]);
      }
    });
    return obj;
  }

  formatarCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  novaConsulta() {
    this.router.navigate(['/consulta']);
  }

  alterarCadastro(): void {
    this.isEditable = !this.isEditable;
    this.editMode = !this.editMode;
    if (!this.isEditable) {
      this.cliente = JSON.parse(JSON.stringify(this.originalCliente));
      this.isChanged = false;
    }
  }

  formatarTelefone() {
    const telefone = this.cliente?.telefone;
    const ddd = telefone?.nuDddTelCttPes;
    const numero = telefone?.nuTelCttPes;

    if (ddd && numero) {
      const numeroLimpo = (ddd + numero).replace(/\D/g, '');
      if (numeroLimpo.length === 11) {
        this.cliente.telefoneCompleto = `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 3)} ${numeroLimpo.substring(3, 7)}-${numeroLimpo.substring(7)}`;
      } else {
        this.cliente.telefoneCompleto = numeroLimpo;
      }
    } else {
      this.cliente.telefoneCompleto = '';
    }
  }

  isEmailValid(email: string): boolean {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailPattern.test(email);
  }

  isTelefoneValid(telefone: string): boolean {
    const telefoneSemMascara = telefone.replace(/\D/g, '');
    return telefoneSemMascara.length >= 10 && telefoneSemMascara.length <= 11;
  }

  transformToUpperCase(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.cliente.noPes = this.cliente.noPes.toUpperCase();
    this.cliente.dsSbrPes = this.cliente.dsSbrPes.toUpperCase();
  }

  salvarAlteracoes(): void {
    if (this.isChanged) {
      if (!this.isEmailValid(this.cliente.email.dsEmailCttPes)) {
        this.toastr.error('O email inserido é inválido. Por favor, insira um email válido.', "Email invalido", {timeOut: 6000});
        return;
      }

      if (!this.isTelefoneValid(this.cliente.telefoneCompleto)) {
        this.toastr.error('O telefone inserido é inválido. Por favor, insira um telefone válido.', "Telefone invalido", {timeOut: 6000});
        return;
      }

      this.cliente.email.inNotEmail = this.cliente.email.inNotEmail ? 'S' : 'N';

      if (this.cliente.telefoneCompleto) {
        const telefoneSemMascara = this.cliente.telefoneCompleto.replace(/\D/g, '');
        const ddd = telefoneSemMascara.substring(0, 2);
        const numero = telefoneSemMascara.substring(2);
        this.cliente.telefone = {nuDddTelCttPes: ddd, nuTelCttPes: numero, cdUsrAtlz: this.cliente.cdUsrAtlz};
      }

      this.salvarAlteracoesClienteService.salvarCadastroController(this.cliente).subscribe({
        next: (response: ClienteResponse) => {
          if (response.cdDocPesDoDsEmailCttPesInformado) {
            this.toastr.error(`Não é possível atualizar, pois o email ${this.cliente.email.dsEmailCttPes} já está associado ao cpf ${response.cdDocPesDoDsEmailCttPesInformado} na base.`, "Email associado a outro cpf", {timeOut: 8000});
          } else {
            this.toastr.success('Cadastro atualizado com sucesso!', "Cadastro atualizado", {timeOut: 4000});
            this.isEditable = false;
            this.editMode = false;
            this.originalCliente = JSON.parse(JSON.stringify(this.cliente));
            this.isChanged = false;
          }
        }, error: () => {
          this.toastr.error('Erro ao salvar o cadastro - Contate o administrador do sistema.', "Erro ao salvar o cadastro", {timeOut: 6000});
        }
      });
    }
  }

  verificaAlteracoes(): void {
    this.isChanged = JSON.stringify(this.originalCliente) !== JSON.stringify(this.cliente);
  }
}
