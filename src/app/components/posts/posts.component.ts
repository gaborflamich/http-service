import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent {
  posts: any[] = [];
  private url = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {
    http.get<any>(this.url).subscribe((response) => {
      this.posts = response;
    });
  }

  createPost(input: HTMLInputElement) {
    let post = { title: input.value };
    input.value = ''; // Clear the input after use

    this.http.post(this.url, post).subscribe((response) => {
      this.posts.splice(0, 0, post);
    });
  }
}
