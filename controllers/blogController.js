const Blog = require("../models/blog");

exports.getOne = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const existingBlog = Blog.findById(blogId);
    res
      .status(200)
      .json({ message: "blog found", blogId: blogId, blog: existingBlog });
  } catch (error) {
    res.status(500).json({ message: "blog not found", error: error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ blogs: blogs });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};

exports.create = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
    };

    if (!data.title || !data.content || !data.image) {
      res
        .status(400)
        .json({ message: "All fields required to create new blog" });
    }

    let newBlog = new Blog({
      title: data.title,
      content: data.content,
      image: data.image,
    });

    await newBlog.save();

    res
      .status(200)
      .json({ message: "blog created successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "user creation failed", error: error });
  }
};

exports.update = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const data = {
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
    };

    const existingBlog = await Blog.findById(blogId);

    await Blog.findByIdAndUpdate(
      { _id: blogId },
      {
        title: data.title || existingBlog.title,
        content: data.content || existingBlog.content,
        image: data.image || existingBlog.image,
      }
    );

    const updatedBlog = await Blog.findById(blogId);

    res
      .status(200)
      .json({ message: "blog updated successfully", updatedBlog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "blog update failed", error: error });
  }
};

exports.delete = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const deletedBlog = await Blog.findById(blogId);
    await Blog.findByIdAndDelete(blogId);
    res.status(200).json({
      messsage: "blog deleted successfully",
      deletedBlog: deletedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: "could not delete blog", error: error });
  }
};
