import mongoose from "mongoose";
import { Post, Comment } from "../models";
import { CommentInput, PostInput } from "./types";

export const PostMutation = {
  newPost: async (args: any) => {
    const commentInput: PostInput = args.post;
    const post = new Post({
      title: commentInput.title,
      body: commentInput.body,
    });

    return await post.save();
  },
  newComment: async (args: any) => {
    const commentInput: CommentInput = args.comment;

    const comment = new Comment({
      name: commentInput.name,
      body: commentInput.body,
      email: commentInput.email,
      post: new mongoose.Types.ObjectId(commentInput.postId),
    });

    return await comment.save();
  },
};
