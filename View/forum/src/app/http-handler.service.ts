import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map} from 'rxjs/operators';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class HttpHandlerService {
  //url of server
  baseUrl: string = environment.baseUrl;

  private headerOptions: any = {
    'Content-type': 'application/json',
  }
  headers: HttpHeaders;

  constructor(private http:HttpClient) {
    this.headers = new HttpHeaders(this.headerOptions);
  }

  //http get request
  get(url: string, params?: object): Observable<any> {
    const apiUrl = `${this.baseUrl}/${url}`;
    return this.http.get<any>(apiUrl,{ headers: this.headers,withCredentials: true})
    .pipe(
      map(this.extractData),
      catchError(this.handleError('get', []))
    );
}

  //http post request with json data
  post(url: string, data?: any, params?: object): Observable<any> {
    const apiUrl = `${this.baseUrl}/${url}`;
    return this.http.post<any>(apiUrl,data,{ headers: this.headers,withCredentials: true })
    .pipe(
      map(this.extractData),
      catchError(this.handleError(url, []))
    );
  }

  //http post request with formdata
  post2(url: string, data?: any, header?: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/${url}`;
    return this.http.post<any>(apiUrl,data,header)
    .pipe(
      //  map(this.extractData),
      catchError(this.handleError(url, []))
    );
  }


  //Separates docs(required data object from server) from res and returns it
  private extractData(res: any) {
    let body = res.docs;
    console.log("this is the extracted data",body)
    return body || { };
  }

  //Display message if any error occured during http response
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log("There was a Error");
      console.error(error);
      console.log(operation);
      return of(result as T);
    };
  }
}
