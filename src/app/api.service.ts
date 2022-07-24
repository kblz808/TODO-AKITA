import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { resolve } from "dns";
import { map, Observable, pipe, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { Todo } from "./todo.model";

@Injectable({providedIn: 'root'})
export class ApiService{
    private readonly baseUrl = environment.baseUrl;

    constructor(private http: HttpClient){}

    addTodo(title: string, description: string, status: string): Observable<Todo> {
        return this.http.post<Todo>(`${this.baseUrl}/todo`, {title, description, status});
    }

    getTodos(): Observable<Todo[]>{

        return this.http.get<Todo[]>(`${this.baseUrl}/todo`).pipe(
            tap(data => data
            )
        )
        
        // return this.http.get<{data: Todo[]}>(`${this.baseUrl}/todo`).pipe(
        //     map((res) => res.data)
        // );
    }

    deleteTodo(id: string):Observable<Todo>{
        return this.http.delete<Todo>(`${this.baseUrl}/todo/${id}`);
    }

    updateTodo(id: string, changes:any):Observable<Todo>{
        return this.http.put<Todo>(`${this.baseUrl}/todo/${id}`, changes);
    }
}