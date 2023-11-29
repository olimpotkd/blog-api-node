const registerUser = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "User registered",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const login = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "user login refactor",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const getUserProfile = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Profile route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Users route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Update users route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Delete users route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  registerUser,
  login,
  getUserProfile,
  getAllUsers,
  deleteUser,
  updateUser,
};
