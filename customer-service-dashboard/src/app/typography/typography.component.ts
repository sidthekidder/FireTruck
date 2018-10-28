import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {

  inputProblemType: String
  inputSolution: String

  constructor(private dataService: DataService) { 
  	this.inputProblemType = ''
  	this.inputSolution = ''
  }

  ngOnInit() {
  }

  hitPostApi() {
  	 this.dataService.createSolution({
		problemType: this.inputProblemType,
		solution: this.inputSolution
    }).subscribe(sol => window.alert('Successfully created issue'));
  }

}
