const createComment = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "comment creation route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const getComment = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get single comment route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const getAllComments = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get comments route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Delete comments route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const updateComment = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Update comment route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
};
