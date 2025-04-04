import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Generic GET method
   * @param path - API endpoint path
   * @param params - Optional query parameters
   */
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${path}`, { params });
  }

  /**
   * Generic POST method
   * @param path - API endpoint path
   * @param body - Request body
   */
  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${path}`, body);
  }

  /**
   * Generic PUT method
   * @param path - API endpoint path
   * @param body - Request body
   */
  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${path}`, body);
  }

  /**
   * Generic PATCH method
   * @param path - API endpoint path
   * @param body - Request body
   */
  patch<T>(path: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${path}`, body);
  }

  /**
   * Generic DELETE method
   * @param path - API endpoint path
   */
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${path}`);
  }

  /**
   * Helper method to format API paths
   * @param parts - Path parts to join
   */
  formatPath(...parts: string[]): string {
    return parts.map(part => part.replace(/^\/+|\/+$/g, '')).join('/');
  }
} 