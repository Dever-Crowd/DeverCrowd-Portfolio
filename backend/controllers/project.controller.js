const Project = require("../models/project.schema");
const httpResponse = require("../utils/httpResponse");
const errorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middlewares/asyncWrapper");

// GET all projects with pagination
const getProjects = asyncWrapper(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = limit * (page - 1);

  const projects = await Project.find().limit(limit).skip(skip);
  
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.getProjects,
    data: { projects },
  });
});

// GET single project by ID
const singleProject = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    const error = errorHandler.create(
      httpResponse.message.projectNotFound,
      httpResponse.status.notfound,
    );
    return next(error);
  }  
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.getProject,
    data: { project },
  });
});

// CREATE project
const createProject = asyncWrapper(async (req, res, next) => {
  const {
    title,
    description,
    timeToFinish,
    client,
    status,
    category,
    cost,
    timeSpend,
    stack,
    scope,
    industry,
    live,
    github,
  } = req.body;

  const pic = req.file ? req.file.path : null;

  const project = new Project({
    title,
    description,
    timeToFinish,
    client,
    status,
    category,
    cost,
    timeSpend,
    pic,
    stack,
    scope,
    industry,
    live,
    github,
  });
  console.log(project);

  await project.save();

  res.status(201).json({
    status: httpResponse.status.created,
    message: httpResponse.message.projectCreated,
    data: { project },
  });
});

// UPDATE project
const updateProject = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;

  const {
    title,
    description,
    timeToFinish,
    client,
    status,
    category,
    cost,
    timeSpend,
    stack,
    scope,
    industry,
    live,
    github,
  } = req.body;

  const project = await Project.findById(id);
  if (!project) {
    const error = errorHandler.create(
      httpResponse.message.projectNotFound,
      httpResponse.status.notfound,
    );
    return next(error);
  }

  // تحديث الحقول فقط إذا تم إرسالها
  project.title = title ?? project.title;
  project.description = description ?? project.description;
  project.pic = req.file?.path ?? project.pic;
  project.timeToFinish = timeToFinish ?? project.timeToFinish;
  project.client = client ?? project.client;
  project.status = status ?? project.status;
  project.category = category ?? project.category;
  project.cost = cost ?? project.cost;
  project.timeSpend = timeSpend ?? project.timeSpend;
  project.stack = stack ?? project.stack;
  project.scope = scope ?? project.scope;
  project.industry = industry ?? project.industry;
  project.live = live ?? project.live;
  project.github = github ?? project.github;

  await project.save();

  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.updateProject,
    data: { project },
  });
});

// DELETE project
const delProject = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const deletedproject = await Project.findByIdAndDelete(id);

  if (!deletedproject) {
    const error = errorHandler.create(
      httpResponse.message.projectNotFound,
      httpResponse.status.notfound,
    );
    return next(error);
  }  

  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.deleteProject,
  });
});

module.exports = {
  getProjects,
  createProject,
  updateProject,
  delProject,
  singleProject,
};
