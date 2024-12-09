'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");


class CommentController {

  createComment = async (req, res, next) => {
    new CREATED({
      message: "Create New Comment Success!!!",
      metadata: await CommentService.createComment(req.body)
    }).send(res);
  }

  findComments = async (req, res, next) => {
    new SuccessResponse({
      message: "Find Comment Success!!!",
      metadata: await CommentService.findCommentByParentId(req.query)
    }).send(res);
  }

  deleteComment = async (req, res, next) => {
    new CREATED({
      message: "Deleted Comment Success!!!",
      metadata: await CommentService.deleteComment(req.body)
    }).send(res);
  }
}

module.exports = new CommentController()