import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleName',
  standalone: true
})
export class RoleNamePipe implements PipeTransform {

  transform(value: string) {
    const roles: any = {
      manager: 'Administrador',
      employee: 'Empleado',
      customer: 'Cliente'
    };
    return roles[value];
  }

}
