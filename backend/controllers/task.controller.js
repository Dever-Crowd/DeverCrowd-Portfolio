const errorHandler = require("../utils/errorHandler");
const sortTasks = require("../utils/SortingTasks");
const Task = require("../models/task.schema");
const httpResponse = require("../utils/httpResponse");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Admin = require("../models/admin.schema");

const getAllTasks = asyncWrapper(async (req, res, next) => {
  const limit = req.query.limit || 100;
  const page = req.query.page || 1;
  const skip = limit * (page - 1);
  const tasks = await Task.find().limit(limit).skip(skip);

  const sortedTasks = sortTasks(tasks);
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.getAllTasks,
    data: { tasks: sortedTasks },
  });
});

const updateTask = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const {
    title,
    description,
    deadline,
    assignedTo,
    status,
    references,
    type,
    priority,
  } = req.body;
  console.log(req.body);

  const newtask = await Task.findOneAndUpdate(
    { _id: id },
    {
      title,
      description,
      deadline,
      assignedTo,
      status,
      references,
      type,
      priority,
    },
    { new: true }
  );
  if (!newtask) {
    const error = errorHandler.create(
      httpResponse.message.taskNotFound,
      httpResponse.status.notfound
    );
    return next(error);
  }
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.updateTask,
    data: { newtask },
  });
});

const createTask = asyncWrapper(async (req, res, next) => {
  const {
    title,
    description,
    deadline,
    assignedTo,
    status,
    references,
    type,
    priority,
  } = req.body;
  const newtask = new Task({
    title,
    description,
    deadline,
    assignedTo,
    status,
    references,
    type,
    priority,
  });

  await newtask.save();

  //=============== Promise is a honey but not the best type ;) ===================
  await Admin.updateMany(
    { _id: { $in: assignedTo } },
    { $inc: { tasksNumber: 1 } }
  );
  //=============== When we talk about honey, Shahd leads the way. ================

  res.json({
    status: httpResponse.status.created,
    message: httpResponse.message.createTask,
    data: { newtask },
  });
});

const deleteTask = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const task = await Task.findById(id);

  if (!task) {
    const error = errorHandler.create(
      httpResponse.message.taskNotFound,
      httpResponse.status.notfound
    );
    return next(error);
  }
  const assignedTo = task.assignedTo;
  await Task.deleteOne({ _id: id });

  await Admin.updateMany(
    { _id: { $in: assignedTo } },
    { $inc: { tasksNumber: -1 } }
  );
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.deleteTask,
  });
});

module.exports = {
  getAllTasks,
  updateTask,
  createTask,
  deleteTask,
};
