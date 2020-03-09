import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { PouchService } from '../../providers/pouch-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  departments: any[];

  constructor(private _router: Router, public pouchService: PouchService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));

    return this.pouchService.getStaff(localStorageItem).then(staff => {
      this.departments = [];
      for (var index in next.data) {
        if (staff.department === next.data[index].department) {
          this.departments.push(next.data[index].department);
          return true;
        }
      }
      if (this.departments.length == 0) {
        // navigate to not authorised page
        this._router.navigate(['/not-authorised']);
        return false;
      }
    });
  }
}
