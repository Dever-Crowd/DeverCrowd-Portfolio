const { body } = require("express-validator");
const sanitizeHtml = require("sanitize-html");

const projectValidtor = () => [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("timeToFinish")
    .trim()
    .notEmpty()
    .withMessage("Time to finish is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Time to finish must be between 2 and 50 characters"),

  body("client")
    .trim()
    .notEmpty()
    .withMessage("Client name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Client name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Client name must contain only letters and numbers"),

  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "in progress", "review", "completed"])
    .withMessage(
      "Status must be one of: pending, in progress, review, completed",
    ),

  body("pic").optional().isURL().withMessage("Image must be a valid URL"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Category must contain only letters and numbers"),
];

const messageValidtor = () => [
  body("name")
    .trim()
    .isString()
    .withMessage("Username must be a string")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 2 })
    .withMessage("Username must be at least 2 characters")
    .matches(/^[A-Za-z0-9 ]+$/)
    .withMessage("Username must contain only letters and numbers"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("requestedServices")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 2 })
    .withMessage("Description must be at least 10 characters"),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters"),
  body("knownBy")
    .trim()
    .notEmpty()
    .withMessage("Knownby is required")
    .isLength({ min: 2 })
    .withMessage("Knownby must be at least 2 characters"),
];

const commentValidtor = () => [
  body("commentText")
    .notEmpty()
    .withMessage("Comment text is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Comment must be between 5 and 500 characters"),
];

const taskValidtor = () => [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("deadline")
    .notEmpty()
    .withMessage("Deadline is required")
    .isISO8601()
    .withMessage("Invalid deadline format"),
  body("status")
    .optional()
    .isIn(["completed", "InProgress", "pending", "review"])
    .withMessage(
      "Status must be one of: completed, InProgress, pending, review",
    ),
  body("references")
    .notEmpty()
    .withMessage("References is required")
    .isLength({ min: 2 })
    .withMessage("References must be at least 2 characters"),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isLength({ min: 2 })
    .withMessage("Type must be at least 2 characters"),
  body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),
];

const loginValidator = () => [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const registerValidator = () => [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 5, max: 20 })
    .withMessage("Username must be at least 5 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Username must contain only letters, numbers, and underscores",
    ),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 24 })
    .withMessage("Password must be between 6 and 24 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("Password must contain a special character"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isLength({ min: 1, max: 20 })
    .withMessage("Role must be between 1 and 20 characters")
    .isIn([
      "Viewer",
      "Security",
      "UIUX",
      "CMO",
      "CTO",
      "Frontend",
      "Backend",
      "CEO",
      "Flutter"
    ])
    .withMessage("Invalid role")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Role must contain only letters, numbers, and underscores"),
  body("nickname")
    .notEmpty()
    .withMessage("Nickname is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Nickname must be between 2 and 20 characters")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("Nickname must contain only letters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("pic").optional().isURL().withMessage("Image must be a valid URL"),
];
const sanitizeContent = (value) =>
  sanitizeHtml(value || "", {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
    allowedAttributes: {
      a: ["href", "target"],
      img: ["src", "alt", "style"],
      "*": ["style"],
    },
    allowedSchemes: ["http", "https", "data"],
    disallowedTagsMode: "discard",
  });


  const blogValidation = [
    // TITLE
    body("title")
      .isString()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be 3–100 characters"),
  
    // SUBTITLE
    body("subtitle")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 3, max: 150 })
      .withMessage("Subtitle must be 3–150 characters"),
  
    // CATEGORY
    body("category")
      .isString()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Category must be 2–50 characters"),
  
    // SLUG
    body("slug")
      .optional()
      .isSlug()
      .withMessage("Slug must be URL-friendly (no spaces)"),
  
    // TAGS
    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array"),
  
    body("tags.*")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Each tag must be a non-empty string"),
  
    // BODY
    body("body")
      .isString()
      .trim()
      .isLength({ min: 10 })
      .withMessage("Body must be at least 10 characters")
      .customSanitizer(sanitizeContent),
  
    // WRITER PIC
    body("writer_pic")
      .optional()
      .isURL()
      .withMessage("Writer pic must be a valid URL"),
  
    // STATUS
    body("status")
      .optional()
      .isIn(["draft", "published"])
      .withMessage("Status must be 'draft' or 'published'"),
  
    // VIEWS
    body("views")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Views must be a positive number"),
  
    // LIKES
    body("likes")
      .optional()
      .isArray()
      .withMessage("Likes must be an array"),
  
    // DATE
    body("publish_date")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid date format"),
  ];

module.exports = {
  projectValidtor,
  messageValidtor,
  commentValidtor,
  loginValidator,
  registerValidator,
  taskValidtor,
  blogValidation,
};
