import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {  Validators,  FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../authentication.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioRegister, Relacion } from '../../models/index';
import { FormComponent } from '@app/modules/shared/helpers/FormComponent';

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialog-register.component.html',
  styleUrls: ['./dialog-register.component.css']
})
export class DialogRegisterComponent extends FormComponent  implements OnInit {
  relaciones: Relacion[];
  clienteLabel = 'Cliente';
  esPersonal = false;
  esMedico = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<DialogRegisterComponent>,
    private toastrService: ToastrService) { super(); }

    ngOnInit() {
      this.relaciones = this.authenticationService.getRelacion();
      this.formGroup = this.formBuilder.group({
        relacion: ['', Validators.required],
        nombre: [''],
        email: ['', [Validators.required, Validators.email]],
        cliente: [''],
        nroDoc: ['']
      });
    }

  onChangeRelacion(value: string): void {
    this.esPersonal = false;
    this.esMedico = false;
    this.f.nombre.setValidators([Validators.required]);
    this.f.cliente.setValidators([Validators.required]);
    this.f.nroDoc.setValidators(null);

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
        this.esPersonal = true;
        this.f.nombre.setValidators(null);
        this.f.nroDoc.setValidators([Validators.required]);
        this.f.cliente.setValidators(null);
        break;
      case 'Medico':
          this.esMedico = true;
          this.f.nombre.setValidators(null);
          this.f.nroDoc.setValidators([Validators.required]);
          this.f.cliente.setValidators(null);
          break;
      case 'Otros':
        this.clienteLabel = 'Referencias';
        break;
      default:
        this.clienteLabel = 'Cliente';
        break;
      }
      this.f.nombre.updateValueAndValidity();
      this.f.nroDoc.updateValueAndValidity();
      this.f.cliente.updateValueAndValidity();
  }

    onSendClick(): void {
      const oRegister: UsuarioRegister = <UsuarioRegister> {
        nombre : this.f.nombre.value,
        relacion : this.f.relacion.value,
        email : this.f.email.value,
        clienteLabel : this.clienteLabel,
        cliente : this.f.cliente.value,
        nroDoc : this.f.nroDoc.value
      };

      this.authenticationService
        .register(oRegister)
        .subscribe(
          usuario => {
            this.toastrService.info('¡Solicitud enviada! Pronto lo estaremos contactando.');
            this.dialogRef.close();
          },
          error => {
            throw error;
          }
      );
    }

    onCancelClick(): void {
      this.dialogRef.close();
    }
}
