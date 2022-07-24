import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, switchMap, take } from 'rxjs';
import { TodoQuery } from '../state/query';
import { TodoStore } from '../state/store';
import { Todo, TodoStatus } from '../todo.model';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading = true;
  todos:Todo[] = [];

  constructor(private router: Router, private todostore: TodoStore, private apiService: ApiService, private todoQuery: TodoQuery, ) { }

  ngOnInit(): void {
    this.todoQuery.getIsLoading().subscribe(res => this.loading = res);
    this.todoQuery.getTodos().subscribe(res => this.todos = res);    

    this.todoQuery.getLoaded().pipe(
      take(1),
      filter(res => !res),
      switchMap(() => {
        this.todostore.setLoading(true);
              
        return this.apiService.getTodos();
      })
    )
    .subscribe(res => {
      this.todostore.update(state => {                
        return{
          todos: res,
          isLoaded: true,
        };
      });

      this.todostore.setLoading(false);
    }, err => {
      console.log(err);
      this.todostore.setLoading(false);
    });
  }
  

  addTodo(){
    this.router.navigateByUrl('/add-todo');
  }

  markAsComplete(id: string){
    this.apiService.updateTodo(id, {status: TodoStatus.DONE}).subscribe(res => {
      this.todostore.update(state => {
        const todos = [...state.todos];
        const index = this.todos.findIndex(t => t._id === id);

        todos[index] = {
          ...todos[index],
          status: TodoStatus.DONE
        };
        return {
          ...state,
          todos
        };
      });
    }, err => console.log(err)
    );
  }

  deleteTodo(id: string){
    this.apiService.deleteTodo(id).subscribe(res => {
      this.todostore.update(state => {
        return {
          ...state,
          todos: state.todos.filter(t => t._id !== id)
        };
      });
    }, err => console.log(err)
    )
  }

}
