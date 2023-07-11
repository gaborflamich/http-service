import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent {
  @ViewChild('titleInput') titleInput?: ElementRef;

  isRead: boolean = false;
  posts: any[] = [];
  postTitle: string = '';
  editMode: boolean = false;
  currentPost: any;

  private url = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {
    http.get<any>(this.url).subscribe((response) => {
      this.posts = response.slice(0, 10);
    });
  }

  // Focus input field after the view is initialized
  ngAfterViewInit() {
    if (this.titleInput && this.titleInput.nativeElement) {
      this.titleInput.nativeElement.focus();
    }
  }

  createOrUpdatePost(input: HTMLInputElement) {
    if (this.editMode) {
      this.savePostTitle(this.currentPost);
    } else {
      this.createPost(input);
    }
    input.value = '';
    this.postTitle = '';
    this.editMode = false;
  }

  createPost(input: HTMLInputElement) {
    let post = { title: input.value };
    input.value = ''; // Clear the input after use

    this.http.post(this.url, post).subscribe((response) => {
      // Add the server's response to the posts array
      this.posts.splice(0, 0, post);
    });
  }

  updatePost(post: { isRead: boolean; id: any }) {
    post.isRead = true; // update the post object
    this.http.patch(`${this.url}/${post.id}`, { isRead: true }); // assuming post has an id
  }

  onEditPost(post: { id: any; title: string }) {
    // Set post title to the input field
    this.postTitle = post.title;
    this.editMode = true;
    this.currentPost = post;
    setTimeout(() => {
      if (this.titleInput && this.titleInput.nativeElement) {
        this.titleInput.nativeElement.focus();
      }
    }, 0);
  }

  onDeletePost(post: { id: any; title: string }) {
    this.http.delete(`${this.url}/${post.id}`).subscribe(() => {
      // Upon success, remove post from local array
      this.posts = this.posts.filter((p) => p.id !== post.id);
    });
  }

  savePostTitle(post: { id: any; title: string }) {
    post.title = this.postTitle;
    this.http.patch(`${this.url}/${post.id}`, { title: post.title });
  }
}
