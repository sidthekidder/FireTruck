import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

  inputType: String
  inputLocation: String
  inputSeverity: String
  inputDescription: String

  constructor(private dataService: DataService) {
  	this.inputType = ''
  	this.inputLocation = ''
  	this.inputSeverity = ''
  	this.inputDescription = ''
  }

  ngOnInit() {
  }

  hitPostApi(){
    this.dataService.createLog({
		problemType: this.inputType,
		severity: this.inputSeverity,
		location: this.inputLocation,
		description: this.inputDescription,
    }).subscribe(hero => window.alert('Successfully created issue'));
  }

}
