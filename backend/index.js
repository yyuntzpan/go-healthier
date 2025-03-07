import express from "express";
import session from "express-session";
import cors from "cors";
import jwt from "jsonwebtoken";
import selectWhereRouter from "./routes/users/selectWhere.js";
import updateProfileRouter from "./routes/users/updateProfile.js";
import db from "./utils/connect-mysql.js";
import imgUpload from "./utils/upload-imgs.js";
import fs from "fs/promises";
import path from "path";
import googleLoginRouter from "./routes/users/googleLogin.js";

// import 各分支的 router
import aRouter from "./routes/articles/articles.js";
import lessonRouter from "./routes/lessons/lesson.js";
import coachRouter from "./routes/coaches/coach.js";
import productRouter from "./routes/product/product-traning-list.js";
import usersRouter from "./routes/users/users.js";
import gymRouter from "./routes/gyms/gyms.js";
import paymentRouter from "./routes/payment/payment.js";
import shipmentRouter from "./routes/product/shipment.js";
import productPayment from "./routes/payment/product-payment.js";

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOption = {
  credentails: true,
  origin: (origin, cb) => {
    // console.log({origin});
    cb(null, true);
  },
};
app.use(cors(corsOption));

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "加密用的字串",
    // cookie:{
    //   maxAge: 1800_000,
    // }
  })
);

// define top level middleware
app.use((req, res, next) => {
  //後端驗證token
  //在top-level middleware處理jwt token
  const auth = req.get("Authorization"); // 先拿到檔頭的 Authorization 項目值
  if (auth && auth.indexOf("Bearer ") === 0) {
    const token = auth.slice(7); //去掉"Bearer "
    try {
      req.my_jwt = jwt.verify(token, process.env.JWT_KEY);
    } catch (ex) { }
  }

  next();
});

// set routes
app.use("/articles", aRouter);
app.use("/lessons", lessonRouter);
app.use("/coaches", coachRouter);
app.use("/product", productRouter);
app.use("/users", usersRouter);
app.use("/gyms", gymRouter);
app.use("/payment", paymentRouter);
app.use("/shipment", shipmentRouter);
app.use("/updateProfile", updateProfileRouter);
app.use("/product-Payment", productPayment);

//google login
app.use("/google-login", googleLoginRouter);

//上傳單個圖片(上傳會員大頭貼)
app.post("/avatar-upload", imgUpload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "沒有檔案上傳" });
    }

    const memberId = req.body.member_id;
    if (!memberId) {
      return res.status(400).json({ error: "member_id 是必要的" });
    }

    const connection = await db.getConnection();
    try {
      // 獲取當前頭像
      const [rows] = await connection.execute(
        "SELECT avatar FROM members WHERE member_id = ?",
        [memberId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Member 404 not found" });
      }

      const oldAvatar = rows[0].avatar;

      // 更新資料庫中的頭像
      await connection.execute(
        "UPDATE members SET avatar = ? WHERE member_id = ?",
        [req.file.filename, memberId]
      );

      // 如果舊頭像不是默認頭像，則刪除它
      if (oldAvatar && oldAvatar !== "default_avatar.png") {
        const oldAvatarPath = path.join("public/users", oldAvatar);
        await fs.unlink(oldAvatarPath).catch(() => { });
      }

      res.json({
        message: "圖片上傳成功",
        avatar: req.file.filename,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//會員個人資料頁的編輯
app.use("/users/updateProfile", updateProfileRouter);

//會員個人資料表下拉選單
app.use("/users/selectWhere", selectWhereRouter);

//後端驗證的token測試路由
app.get("/jwt-data", (req, res) => {
  res.json(req.my_jwt);
});

app.use(express.static("public"));

app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send("wrong path");
});

const port = process.env.WEB_PORT || 3002;
app.listen(port, () => {
  console.log(`Server start, listen port ${port}`);
});
