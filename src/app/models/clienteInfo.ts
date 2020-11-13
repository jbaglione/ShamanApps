export class ClienteInfo {
  id: number;
  codigo: string;
  razonSocial: string;
  maskAfiliado: string;
  constructor(
    clienteInfo: ClienteInfo
  ) {
    this.id = clienteInfo.id;
    this.codigo = clienteInfo.codigo;
    this.razonSocial = clienteInfo.razonSocial;
    this.maskAfiliado = clienteInfo.maskAfiliado;
  }

  public get maskAfiliadoReal(): any {
    if (this.maskAfiliado != null && this.maskAfiliado != '') {
      let array = this.maskAfiliado.split('');
      let mask: (string | RegExp)[] = [];
      array.forEach(element => {
        if (element == '#') {
          mask.push(new RegExp(/\d/));
        } else {
          mask.push(new RegExp(/[a-zA-Z]/));
        }
      });
      return mask;
    } else {
      return false;
    }
  }

  public get validatorAfiliado(): (string | RegExp) {
    if (this.maskAfiliado != null && this.maskAfiliado != '') {
      let array = this.maskAfiliado.split('');
      let mask: string[] = [];
      array.forEach(element => {
        if (element == '#') {
          mask.push("\\d");
        } else {
          mask.push("[a-zA-Z]");
        }
      });

      let filter = new RegExp(mask.join(""), "gi");
      console.log("filter", filter);

      return filter;
    } else {
      return null;
    }
  }

  public get maskAfiliadoEjemplo(): string {
    return this.maskAfiliado != null && this.maskAfiliado != '' ? this.maskAfiliado.replace(/#/g, '1') : '';
  }
}
