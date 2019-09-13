import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Relacion } from '../../models/relacion.model';
import { UsuarioRegister } from '../../models/register.model';

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialog-register.component.html',
  styleUrls: ['./dialog-register.component.css']
})
export class DialogRegisterComponent implements OnInit {
  registerForm: FormGroup;
  relaciones: Relacion[] = [
    {value: 'Cliente', viewValue: 'Cliente'},
    {value: 'EmpresaPrestadora', viewValue: 'Empresa Prestadora'},
    {value: 'PrestadorDeMovil', viewValue: 'Prestador de Movil'},
    {value: 'Personal', viewValue: 'Personal'},
    {value: 'Otros', viewValue: 'Otros'}
  ];
  clienteLabel = 'Cliente';

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<DialogRegisterComponent>,
    private toastrService: ToastrService) { }

    ngOnInit() {
      this.registerForm = this.formBuilder.group({
        nombre: ['', Validators.required],
        relacion: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        cliente: ['', Validators.required]
      });
    }

    get f() {
      return this.registerForm.controls;
    }

    selectRelacion(value: string): void {
      switch (value) {
        case 'Cliente':
          this.clienteLabel = 'Código Cliente';
          break;
        case 'EmpresaPrestadora':
          this.clienteLabel = 'Código Empresa Paramedic';
          break;
        case 'PrestadorDeMovil':
          this.clienteLabel = 'Moviles';
          break;
        case 'Personal':
          this.clienteLabel = 'Nro Legajo';
          break;
        case 'Otros':
          this.clienteLabel = 'Referencias';
          break;
        default:
          this.clienteLabel = 'Cliente';
          break;
    }
  }

    onSendClick(): void {
      const oRegister: UsuarioRegister = <UsuarioRegister> {
        nombre : this.f.nombre.value,
        relacion : this.f.relacion.value,
        email : this.f.email.value,
        clienteLabel : this.clienteLabel,
        cliente : this.f.cliente.value
      };

      this.authenticationService
        .register(oRegister)
        .subscribe(
          usuario => {
            this.toastrService.info('¡Solicitud enviada! Pronto lo estaremos contactando.');
            this.dialogRef.close();
          },
          error => {
            this.toastrService.error(error.error.detail);
          }
      );
    }

    onCancelClick(): void {
      this.dialogRef.close();
    }
}
