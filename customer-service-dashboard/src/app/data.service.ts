
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as $ from 'jquery';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataService {

  logs: any
  issues: any
  unresolvedIssues: any

  constructor(private http: HttpClient) {
  }

  initLib() {
  }


  getInitData() {

  }

  getAllLogs() {
    return this.http.get('http://localhost:6010/getLogs')
  }

  getAllUnresolvedIssues() {
    return this.http.get('http://localhost:6010/getUnresolved')
  }

  createLog(data) {
    return this.http.post('http://localhost:6010/createLog', data, httpOptions)
    .pipe(catchError(console.log("ERROR WHEN CREATING LOG")))
  }

  createSolution(data) {
    return this.http.post('http://localhost:6010/createSolution', data, httpOptions)
    .pipe(catchError(console.log("ERROR WHEN CREATING SOLUTION")))
  }
}
