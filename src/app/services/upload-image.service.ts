import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  http: HttpClient = inject(HttpClient);

  url: string = 'https://api.cloudinary.com/v1_1/' + environment.CLOUDINARY_CLOUD_NAME + '/image/upload';

  constructor() { }

  uploadImg(data: any): Observable<any> {
    return this.http.post(this.url, data);
  }

  checkImageExistence(url: string): Observable<boolean> {
    return this.http.head(url, { observe: 'response' }).pipe(
      map(response => {
        return response.status === 200;
      }),
      catchError(() => {
        return [false];
      })
    );
  }
}
