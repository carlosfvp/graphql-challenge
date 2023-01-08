# graphql-code-challenge-scaffold

## How to run

- `npm install`
- `npm start`
- Open browser at http://localhost:3000/graphql

## Aditional libraries

- `@graphql-tools/schema` this library allows me to easily include custom directives to the schema
- `graphql-constraint-directive` this library includes custom directives for most common input validations (lenght of string, min, max, etc.)

## Query/Mutation examples

```
query posts {
  posts(recordsPerPage: 1000000) {
    id
    title
    body
    comments{
      email
    }
  }
}

mutation NewPost($post: PostInput!) {
  newPost(post: $post) {
    title
    body
  }
}

mutation NewComment($comment: CommentInput!) {
  newComment(comment: $comment) {
    id
    name
    body
    email
  }
}
```

Variables

```
{
  "post": {
    "title": "Long post title",
    "body": "body of post"
  },
  "comment": {
    "postId": "63ba25c649e1e48850fe29c2",
    "name": "Long comment name",
    "email": "prueba@mail.com",
    "body": "body of comment"
  }
}
```

`Carlos Villacorta`
