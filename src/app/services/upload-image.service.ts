import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

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
}
