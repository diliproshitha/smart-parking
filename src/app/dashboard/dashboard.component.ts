import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  tagId: String = '';
  slots: Observable<any>;

  constructor(
    public userService: UserService,
    private afdb: AngularFireDatabase
  ) {
    this.slots = this.afdb.list('slot/').valueChanges();
  }

  ngOnInit() {
    this.slots = this.afdb.list('slot/').valueChanges();
  }

  ngAfterViewInit() {
    this.slots = this.afdb.list('slot/').valueChanges();
  }

checkTagNull(tagId: string): boolean {
  return tagId === '';
}

reserveSlot(i: string) {
  this.afdb.object(`slot/` + i).update({slotId: i, tagId: this.userService.tagId});
}

}
