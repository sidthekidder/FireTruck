import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/issue-list', title: 'All Logs',  icon:'content_paste', class: '' },
    { path: '/show-unresolved', title: 'Unresolved Issues',  icon:'bubble_chart', class: '' },
    { path: '/create-issue', title: 'Create New Issue',  icon:'person', class: '' },
    { path: '/create-solution', title: 'Create Solution',  icon:'library_books', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
