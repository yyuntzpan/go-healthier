import express from "express";
const router = express.Router();
import db from "../../utils/connect-mysql.js";
import userController from "../../controllers/userController.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment-timezone";

// 會員註冊 把會員在簽端填的資料寫入database
router.post("/add", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 生成鹽值並雜湊密碼
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await db.query(
      "INSERT INTO members (member_name, member_email, member_password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.json({ success: true, memberId: result.insertId });
  } catch (error) {
    console.error("加入會員時發生了點失誤:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});
//jwt編碼
router.get("/jwt1", (req, res) => {
  const data = {
    id: 20,
    account: "hahaha",
  };
  //把dev.env中的JWT_KEY加密
  const token = jwt.sign(data, process.env.JWT_KEY);
  console.log({ token });
  res.send(token);
  //加密的jwt的編碼 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImFjY291bnQiOiJoYWhhaGEiLCJpYXQiOjE3MjA0OTIyNTl9.4adY7ysms-CqkYNGqUpIwQhl7BaXDo2xGQrTWbPOy90
});
//jwt解碼
router.get("/jwt2", (req, res) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImFjY291bnQiOiJoYWhhaGEiLCJpYXQiOjE3MjA0OTIyNTl9.4adY7ysms-CqkYNGqUpIwQhl7BaXDo2xGQrTWbPOy90";
  let payload = {};
  try {
    payload = jwt.verify(token, process.env.JWT_KEY);
    console.log({ payload });
    res.send({ payload });
  } catch (ex) {
    //token解碼失敗
    payload = { ex };
  }
});
// jwt 登入
router.post("/login-jwt", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    body: req.body,
    data: {
      sid: 0,
      email: "",
      name: "",
      token: "",
    },
  };

  try {
    // 修改 SQL 查詢以使用 member_email
    const sql = "SELECT * FROM members WHERE member_email=?";
    const [rows] = await db.query(sql, [req.body.member_email]);

    if (!rows.length) {
      // 帳號是錯的
      output.code = 400;
      return res.json(output);
    }

    // 使用 bcrypt 比較密碼
    const result = await bcrypt.compare(
      req.body.member_password,
      rows[0].member_password
    );
    if (!result) {
      // 密碼是錯的
      output.code = 420;
      return res.json(output);
    }

    // 登入成功
    output.success = true;
    const payload = {
      id: rows[0].member_id,
      email: rows[0].member_email,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY);
    output.data = {
      id: rows[0].member_id,
      email: rows[0].member_email,
      name: rows[0].member_name,
      nick_name: rows[0].nick_name,
      avatar: rows[0].avatar,
      mobile: rows[0].mobile,
      city: rows[0].city_id,
      district: rows[0].district_id,
      address: rows[0].address,
      token,
    };
    console.log("Login successful, output.data:", output.data);
    res.json(output);
  } catch (error) {
    console.error("登入過程中發生錯誤:", error);
    output.code = 500;
    output.error = "伺服器內部錯誤";
    res.status(500).json(output);
  }
});

// 課程收藏
router.post("/add-lesson-favorite", async (req, res) => {
  const { member_id, lesson_id } = req.body;
  if (!member_id || !lesson_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing member_id or lesson_id" });
  }
  try {
    console.log("Attempting to add favorite:", { member_id, lesson_id });
    // 先檢查是否已經存在收藏
    const checkSql =
      "SELECT COUNT(*) as count FROM FavLesson WHERE member_id = ? AND lesson_id = ?";
    const [checkResult] = await db.query(checkSql, [member_id, lesson_id]);
    if (checkResult[0].count > 0) {
      return res.json({ success: true, message: "Already in favorites" });
    }
    // 如果不存在，則添加收藏
    const sql = "INSERT INTO FavLesson (member_id, lesson_id) VALUES (?, ?)";
    await db.query(sql, [member_id, lesson_id]);
    console.log("Favorite added successfully");
    res.json({ success: true, message: "Added to favorites" });
  } catch (error) {
    console.error("Detailed error adding favorite:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// 獲取用戶的收藏課程
router.get("/favorites-lesson/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const sql = `
            SELECT 
                L.lesson_id,
                L.lesson_name,
                L.lesson_price,
                L.lesson_desc,
                L.lesson_date,
                GROUP_CONCAT(DISTINCT ct.code_desc ORDER BY ct.code_desc SEPARATOR '、') AS skills,
                li.lesson_img,
                g.gym_name AS gym
            FROM 
                Lessons L
            JOIN 
                FavLesson fl ON L.lesson_id = fl.lesson_id
            JOIN 
                LessonCategories lc ON L.lesson_id = lc.lesson_id
            JOIN 
                CommonType ct ON lc.commontype_id = ct.commontype_id
            JOIN 
                LessonImgs li ON L.lesson_id = li.LessonImgs_id
            JOIN 
                Gyms g ON L.gym_id = g.gym_id
            WHERE 
                fl.member_id = ?
            GROUP BY 
                L.lesson_id, g.gym_name, li.lesson_img
        `;
    const [favorites] = await db.query(sql, [userId]);
    res.json({ success: true, favorites });
  } catch (error) {
    console.error("獲取課程收藏時發生錯誤:", error);
    res
      .status(500)
      .json({ success: false, message: "伺服器錯誤", error: error.message });
  }
});

// 刪除課程收藏
router.delete("/remove-lesson-favorite", async (req, res) => {
  const { member_id, lesson_id } = req.body;
  if (!member_id || !lesson_id) {
    return res
      .status(400)
      .json({ success: false, message: "缺少 member_id 或 lesson_id" });
  }
  try {
    console.log("嘗試刪除收藏:", { member_id, lesson_id });
    const sql = "DELETE FROM FavLesson WHERE member_id = ? AND lesson_id = ?";
    const [result] = await db.query(sql, [member_id, lesson_id]);

    if (result.affectedRows > 0) {
      console.log("收藏刪除成功");
      res.json({ success: true, message: "已從收藏中移除" });
    } else {
      res.status(404).json({ success: false, message: "找不到要刪除的收藏" });
    }
  } catch (error) {
    console.error("刪除收藏時發生錯誤:", error);
    res
      .status(500)
      .json({ success: false, message: "伺服器錯誤", error: error.message });
  }
});

// 檢查收藏狀態
router.get("/check-favoriteLesson/:userId/:lessonId", async (req, res) => {
  const { userId, lessonId } = req.params;
  try {
    const sql =
      "SELECT COUNT(*) as count FROM FavLesson WHERE member_id = ? AND lesson_id = ?";
    const [rows] = await db.query(sql, [userId, lessonId]);
    const isFavorite = rows[0].count > 0;
    res.json({ success: true, isFavorite });
  } catch (error) {
    console.error("檢查收藏狀態時發生錯誤:", error);
    res
      .status(500)
      .json({ success: false, message: "伺服器錯誤", error: error.message });
  }
});
// 課程收藏結束

// 添加教練收藏
router.post("/add-favorite", async (req, res) => {
  const { member_id, coach_id } = req.body;
  if (!member_id || !coach_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing member_id or coach_id" });
  }
  try {
    console.log("Attempting to add favorite:", { member_id, coach_id });
    // 先檢查是否已經存在收藏
    const checkSql =
      "SELECT COUNT(*) as count FROM FavCoach WHERE member_id = ? AND coach_id = ?";
    const [checkResult] = await db.query(checkSql, [member_id, coach_id]);
    if (checkResult[0].count > 0) {
      return res.json({ success: true, message: "Already in favorites" });
    }
    // 如果不存在，則添加收藏
    const sql = "INSERT INTO FavCoach (member_id, coach_id) VALUES (?, ?)";
    await db.query(sql, [member_id, coach_id]);
    console.log("Favorite added successfully");
    res.json({ success: true, message: "Added to favorites" });
  } catch (error) {
    console.error("Detailed error adding favorite:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// 獲取用戶的收藏教練
router.get("/favorites-gym/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const sql = `
SELECT 
    gyms.*, 
    GROUP_CONCAT(DISTINCT  features.feature_id) AS feature_id,
    GROUP_CONCAT(DISTINCT  features.feature_name) AS feature_list,
    GROUP_CONCAT( gym_images.image_filename) AS image_list,
    member_id_fk
FROM 
    Gyms gyms
LEFT JOIN 
    GymFeatures gym_features ON gyms.gym_id = gym_features.gym_id
LEFT JOIN 
    Features features ON gym_features.feature_id = features.feature_id
LEFT JOIN 
    GymImages gym_images ON gyms.gym_id = gym_images.gym_id
JOIN FavGyms ON gym_id_fk = gyms.gym_id
WHERE member_id_fk = ?
GROUP BY 
    gyms.gym_id, member_id_fk;
            `;
    const [favorites] = await db.query(sql, [userId]);
    res.json({ success: true, favorites });
  } catch (error) {
    console.error("獲取場館收藏時發生錯誤:", error);
    res
      .status(500)
      .json({ success: false, message: "伺服器錯誤", error: error.message });
  }
});

// 獲取用戶的收藏教練
router.get("/favorites/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const sql = `
            SELECT 
                c.coach_id,
                c.coach_name,
                c.coach_phone,
                c.coach_gender,
                c.coach_info,
                c.coach_price,
                c.create_date,
                c.update_at,
                GROUP_CONCAT(DISTINCT ct.code_desc ORDER BY ct.code_desc SEPARATOR '、') AS skills,
                ci.coach_img,
                g.gym_name AS gym
            FROM 
                Coaches c
            JOIN 
                FavCoach fc ON c.coach_id = fc.coach_id
            JOIN 
                CoachSkills cs ON c.coach_id = cs.coach_id
            JOIN 
                CommonType ct ON cs.commontype_id = ct.commontype_id
            JOIN 
                CoachImgs ci ON c.coachImgs_id = ci.coachImgs_id
            JOIN 
                Gyms g ON c.gym_id = g.gym_id
            WHERE 
                fc.member_id = ?
            GROUP BY 
                c.coach_id, g.gym_name, ci.coach_img
        `;
    const [favorites] = await db.query(sql, [userId]);
    res.json({ success: true, favorites });
  } catch (error) {
    console.error("獲取收藏時發生錯誤:", error);
    res
      .status(500)
      .json({ success: false, message: "伺服器錯誤", error: error.message });
  }
});

// 獲取用戶的收藏文章
router.get("/favorites-articles/:userId", async (req,res)=>{
  const output = {
    success: false,
    message: '',
    rows: [],
  }
  const { userId } = req.params;

  if (!req.my_jwt || !parseInt(userId)) {
    output.message = 'not logged in or invalid input'
    res.status(400).json(output)
  }

  try {
    const sql = `SELECT article_id, article_title, update_at, code_desc, article_cover, member_id_fk FROM FavArticles JOIN Articles ON article_id_fk = article_id JOIN CommonType ON code_type = 9 AND code_id = code_id_fk WHERE member_id_fk = ?;`;

    [output.rows] = await db.query(sql, [userId])
    if (output.rows) {
      for(let i of output.rows) {
        const m = moment(i.update_at);
        const update_at = m.isValid() ? m.format('YYYY-MM-DD') : '';
        i.update_at = update_at;
      }
      output.success = true;
      res.status(200).json(output);
    }
  } catch (error) {
    output.message = 'database fetch fail'
    res.status(500).json(output)
  }
})

// 刪除教練收藏
router.delete("/remove-favorite", async (req, res) => {
  const { member_id, coach_id } = req.body;
  if (!member_id || !coach_id) {
    return res
      .status(400)
      .json({ success: false, message: "缺少 member_id 或 coach_id" });
  }
  try {
    console.log("嘗試刪除收藏:", { member_id, coach_id });
    const sql = "DELETE FROM FavCoach WHERE member_id = ? AND coach_id = ?";
    const [result] = await db.query(sql, [member_id, coach_id]);

    if (result.affectedRows > 0) {
      console.log("收藏刪除成功");
      res.json({ success: true, message: "已從收藏中移除" });
    } else {
      res.status(404).json({ success: false, message: "找不到要刪除的收藏" });
    }
  } catch (error) {
    console.error("刪除收藏時發生錯誤:", error);
    res
      .status(500)
      .json({ success: false, message: "伺服器錯誤", error: error.message });
  }
});

// 檢查收藏狀態
router.get("/check-favorite/:userId/:coachId", async (req, res) => {
  const { userId, coachId } = req.params;
  try {
    const sql =
      "SELECT COUNT(*) as count FROM FavCoach WHERE member_id = ? AND coach_id = ?";
    const [rows] = await db.query(sql, [userId, coachId]);
    const isFavorite = rows[0].count > 0;
    res.json({ success: true, isFavorite });
  } catch (error) {
    console.error("檢查收藏狀態時發生錯誤:", error);
    res
      .status(500)
      .json({ success: false, message: "伺服器錯誤", error: error.message });
  }
});

// 教練預約
router.post("/add/coachReserve", async (req, res) => {
  try {
    // 驗證並格式化日期時間
    const reserveTime = new Date(req.body.reserve_time);
    if (isNaN(reserveTime.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "無效的日期時間格式" });
    }
    reserveTime.setHours(reserveTime.getHours() + 8);
    // 格式化為 MySQL datetime 格式
    const formattedReserveTime = reserveTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const sql =
      "INSERT INTO coachReserve (`reserve_name`, `reserve_phone`, `reserve_email`, `reserve_time`, `coach_id`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";
    const [result] = await db.query(sql, [
      req.body.reserve_name,
      req.body.reserve_phone,
      req.body.reserve_email,
      formattedReserveTime,
      req.body.coach_id,
    ]);
    res.json({ success: true, result });
  } catch (error) {
    console.error("新增教練預約時發生錯誤:", error);
    res
      .status(500)
      .json({ success: false, message: "資料庫錯誤", error: error.message });
  }
});
// 獲取用戶的教練預約
router.get("/bookings/:userId", async (req, res) => {
  try {
    const sql = `
        SELECT cr.*, c.coach_name, g.gym_name
        FROM coachReserve cr
        JOIN Coaches c ON cr.coach_id = c.coach_id
        JOIN Gyms g ON c.gym_id = g.gym_id
        WHERE cr.reserve_name = (SELECT member_name FROM members WHERE member_id = ?)
        ORDER BY cr.reserve_time DESC
      `;
    const [bookings] = await db.query(sql, [req.params.userId]);
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("獲取教練預約時發生錯誤:", error);
    res.status(500).json({ success: false, message: "資料庫錯誤" });
  }
});

//會員場館預約
router.get("/myReservations/:userId", userController.myReservations)

//會員訂單頁
router.get("/myOrders/:userId", userController.myOrders);

//處理會員在登入頁面時檢查輸入的email是否存在於資料庫當中的路由
router.post("/cheak_email", userController.cheakEmail);

//忘記密碼的路由
router.post("/test_forget_password", userController.forgotPassword);
//驗證重設密碼的路由
router.get("/verify_reset_token", userController.verifyResetToken);
//重設密碼的路由
router.post("/changePassword", userController.changePassword);

// router.get('/gym-reservation', async (req, res) => {
//   try{
//     const sql =`SELECT * FROM GymReservations`
//   }
// })

export default router;