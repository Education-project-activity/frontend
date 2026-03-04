import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TuiIcon} from '@taiga-ui/core';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    TuiIcon,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

}
