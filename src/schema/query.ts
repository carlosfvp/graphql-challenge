import { Post, Comment } from "../models";
import { CommentDto, PostDto } from "./types";

export const PostsQuery = {
  posts: async (args: any) => {
    const page = (args.page > 0 ? args.page - 1 : 0) as number;
    const recordsPerPage = (args.recordsPerPage ?? 10) as number;

    let postsArr: PostDto[] = [];
    const posts = await Post.find()
      .limit(recordsPerPage)
      .skip(recordsPerPage * page)
      .exec();

    for (const i in posts) {
      const p = posts[i];
      const comments = await Comment.find({ $in: p.comments }).exec();

      postsArr.push({
        id: p._id.toString(),
        title: p.title,
        body: p.body,
        comments: comments.map((c) => {
          let comment: CommentDto = {
            id: c._id.toString(),
            name: c.name,
            email: c.email,
            body: c.body,
          };
          return comment;
        }),
      });
    }

    return postsArr;
  },
};
