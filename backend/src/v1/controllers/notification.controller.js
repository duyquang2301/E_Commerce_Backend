'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");
const { listNotificationByUser } = require("../services/notification.service");


class NotificationController {

  ListNotificationByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Create New ListNotificationByUser Success!!!",
      metadata: await listNotificationByUser(req.query)
    }).send(res);
  }
}

module.exports = new NotificationController()