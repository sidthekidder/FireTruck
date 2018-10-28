import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  logs: any

  constructor(private dataService: DataService) { 
  	this.logs = []
  }

  ngOnInit() {
  	this.dataService.getAllLogs().subscribe((data) => this.logs = data.message)
  }

}
