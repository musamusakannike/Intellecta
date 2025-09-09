const Project = require("../models/project.model");

exports.createProject = async (req, res) => {
  try {
    const { title, description, repoUrl, liveUrl, tags, screenshots } = req.body;
    const author = req.user._id;

    const newProject = new Project({
      title,
      description,
      repoUrl,
      liveUrl,
      tags,
      screenshots,
      author,
    });

    await newProject.save();

    res.status(201).json(newProject);
  } catch (error) {
    console.log("Error in createProject controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.log("Error in getProjects controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id).populate(
      "author",
      "name profilePicture"
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.log("Error in getProjectById controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, repoUrl, liveUrl, tags, screenshots } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    project.title = title;
    project.description = description;
    project.repoUrl = repoUrl;
    project.liveUrl = liveUrl;
    project.tags = tags;
    project.screenshots = screenshots;

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.log("Error in updateProject controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await project.remove();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProject controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
