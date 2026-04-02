//====================Libs==============
require("dotenv").config();
require("./config/database");
const express = require("express");
const adminRoutes = require("./routes/admin.route");
const projectRoutes = require("./routes/project.route");
const contactRoutes = require("./routes/message.route");
const blogRoutes = require("./routes/blog.route");
const pricingRoutes = require("./routes/pricing.route");
const cors = require("cors");
const bodyParser = require("body-parser");
const httpResponse = require('./utils/httpResponse')

 
//===================server===================
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 app.set("trust proxy", true);

app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
console.log("Blog Routes Loaded");
app.use("/api/blog", blogRoutes);
app.use("/api/pricing", pricingRoutes);

app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  res.status(404).json({ status: "fail", data: "Page Not Found" });
});

app.use((err, req, res, next)=>{
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ status: httpResponse.status.badrequest, message: httpResponse.message.invalidjsonformat, data: null });
  }  
  res.status(err.statusCode || 500).json({message: err.message, status: err.statusCode || 500, data: null})
})

app.listen(process.env.PORT, () => {
  console.log(`server running on http://localhost:${process.env.PORT}/`);
});
