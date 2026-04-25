const router = require("express").Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  getChatLogs,
  getChatLogDetail,
} = require("../controllers/adminController");

router.use(protect);
router.use(adminOnly);

router.get("/users", getAllUsers);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/chatlogs", getChatLogs);
router.get("/chatlogs/:id", getChatLogDetail);

module.exports = router;
