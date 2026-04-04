const errorHandler = require("../utils/errorHandler");
const httpResponse = require("../utils/httpResponse");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Comment = require("../models/comment.schema");

const getAllComments = asyncWrapper(async (req, res, next) => {
  const {userId} = req.body
  const comments = await Comment.find({ userId }).sort({
    createdAt: 1,
  });
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.getComments,
    data: { comments },
  });
});

const postComment = asyncWrapper(async (req, res, next) => {
  const { commentText, userId } = req.body;
  if (userId != req.user.id) {
    if (req.user.role != "CEO") {
      const error = errorHandler.create(
        httpResponse.message.unauthorized,
        httpResponse.status.unauthorized
      );
      return next(error);
    }
  }
  const newComment = Comment({
    commentText,
    userId: req.user.id,
    username: req.user.username,
  });
  await newComment.save();
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.createComment,
    data: { newComment },
  });
});

const deleteComment = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const removerId = req.user.id;
  const commentowner = await Comment.findById({ _id: id }).select("userId");

  if (!commentowner) {
    const error = errorHandler.create(
      httpResponse.message.commentNotFound,
      httpResponse.status.notfound
    );
    return next(error);
  }

  if (commentowner.userId.toString() !== removerId.toString()) {
    const error = errorHandler.create(
      httpResponse.message.unauthorized,
      httpResponse.status.unauthorized
    );
    return next(error);
  }
  await Comment.findByIdAndDelete({ _id: id });

  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.deleteComment,
  });
});

module.exports = {
  getAllComments,
  postComment,
  deleteComment,
};
