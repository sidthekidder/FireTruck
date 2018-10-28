import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
@Injectable()
export class IconsComponent implements OnInit {

  issues: any

  constructor(private dataService: DataService) { 
  	this.issues = []
  }

  ngOnInit() {
  	this.dataService.getAllUnresolvedIssues().subscribe((data) => this.issues = data.message)
  }

}
