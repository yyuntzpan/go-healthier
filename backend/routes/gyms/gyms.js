import express from "express";
import db from "../../utils/connect-mysql.js";
import moment from "moment-timezone";

const router = express.Router();

//搜尋場館類型以渲染checkboxes
const getGymFeatures = async (req) => {
  let success = false;
  let features = [];

  try {
    const sql = `SELECT feature_name FROM Features;`;
    [features] = await db.query(sql);
    success = true;
  } catch (error) {
    console.error("Error fetching features:", error);
  }

  return {
    success,
    features,
    qs: req.query, //???
  };
};

// 獲取場館列表
const getFullGymData = async (req) => {
  //關鍵字的參數
  let keyword = req.query.keyword || "";
  let feature = req.query.features || "";
  let friendly = req.query.friendly || "";

  let q_sql = " WHERE 1 "; //就算qs什麼都沒也會是1 = true
  //篩選類別
  const params = [];

  if (feature) {
    const featuresArray = req.query.features
      .split(",")
      .map((feature) => feature.trim());
    q_sql += ` AND features.feature_name IN (${featuresArray
      .map(() => "?")
      .join(",")})`;
    params.push(...featuresArray);
  }

  // 篩選關鍵字
  if (keyword) {
    // const keyword_ = db.escape(`%${keyword}%`);
    // q_sql += ` AND (gym_name LIKE ${keyword_} OR gym_address LIKE ${keyword_}) `;
    q_sql += ` AND (gym_name LIKE ? OR gym_address LIKE ? ) `;
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  if (friendly === true || friendly === "true") {
    q_sql += `AND is_elderly = ?`;
    params.push(friendly);
  }

  const sql = `SELECT gyms.*, GROUP_CONCAT(DISTINCT features.feature_name) AS feature_list, GROUP_CONCAT( gym_images.image_filename) AS image_list FROM Gyms gyms LEFT JOIN GymFeatures AS gym_features ON gyms.gym_id = gym_features.gym_id JOIN Features AS features ON gym_features.feature_id = features.feature_id LEFT JOIN GymImages gym_images ON gyms.gym_id = gym_images.gym_id ${q_sql} GROUP BY gyms.gym_id order by gyms.gym_id desc;`;
  try {
    // 執行 SQL 查詢
    const [rows] = await db.query(sql, params);
    console.log(sql, params);
    // 對每一行數據進行處理
    const processedRows = rows.map((row) => {
      return {
        ...row, // 保留原有的所有屬性
        feature_list: row.feature_list.split(","), // 將 feature_list 轉換為陣列.
        image_list: row.image_list.split(","), // 將 image_list 轉換為陣列
      };
    });

    console.log(processedRows);
    return {
      processedRows,
      qs: req.query,
    };
  } catch (error) {
    console.error("Error fetching gyms:", error);
  }

  console.log("有收到資料Feature:", req.query.features);
  console.log("有收到資料Keyword:", req.query.keyword);
  console.log("有收到資料SQL:", sql);
};

const getOneGymData = async (req, res) => {
  const gymId = +req.params.gym_id || 0;
  console.log(gymId);
  if (!gymId) {
    // return res.json({success:false, error:"無此場館"})
  }
  try {
    const sql = `SELECT 
    gyms.*, 
    GROUP_CONCAT(DISTINCT  features.feature_id) AS feature_id,
    GROUP_CONCAT(DISTINCT  features.feature_name) AS feature_list,
    GROUP_CONCAT(DISTINCT gym_images.image_filename) AS image_list
FROM 
    Gyms gyms
LEFT JOIN 
    GymFeatures gym_features ON gyms.gym_id = gym_features.gym_id
LEFT JOIN 
    Features features ON gym_features.feature_id = features.feature_id
LEFT JOIN 
    GymImages gym_images ON gyms.gym_id = gym_images.gym_id
WHERE gyms.gym_id = ?
GROUP BY 
    gyms.gym_id;`;
    const [row] = await db.query(sql, [gymId]);
    // 對每一行數據進行處理
    const processedRow = row.map((row) => {
      return {
        ...row, // 保留原有的所有屬性
        gym_price: row.gym_price.split(", ").map((price) => {
          const [type, amount] = price.split("NT$");
          return {
            type: type.trim(),
            amount: parseFloat(amount.replace(/,/g, "")), // 移除逗號並轉換為數字
          };
        }),
        gym_equipment: row.gym_equipment.split("、"),
        feature_id: row.feature_id.split(","),
        feature_list: row.feature_list.split(","), // 將 feature_list 轉換為陣列.
        image_list: row.image_list.split(","), // 將 image_list 轉換為陣列
        features: row.feature_list.split(","), // 將 feature_list 轉換為陣列.
        images: row.image_list.split(","), // 將 image_list 轉換為陣列
      };
    });

    // console.log(processedRow);
    return {
      processedRow,
    };
  } catch (error) {
    console.error("Error fetching gyms:", error);
  }
};

//獲取場館頁面
router.get("/api", async (req, res) => {
  let data = "";
  try {
    data = await getFullGymData(req);
  } catch (error) {
    console.error("Route error:", error);
    data = { success: false, error: "Internal Server Error" };
  }
  res.json(data);
});

//得到課程類別
router.get("/features", async (req, res) => {
  try {
    const data = await getGymFeatures(req);
    if (data.success) {
      // 提取feature_name值到一個新陣列
      const featureNames = data.features.map((feature) => feature.feature_name);

      // 發送處理後的資料給前端
      res.json({
        success: true,
        features: featureNames,
      });
    } else {
      res.status(404).json({ success: false, message: "NO GymFeatures found" });
    }
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//得到單個Gym詳情
router.get("/api/:gym_id", async (req, res) => {
  let data = "";
  try {
    data = await getOneGymData(req);
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
  res.json(data);
});

router.post("/add/reservation", async (req, res) => {
  try {
    const sql =
      "INSERT INTO GymReservations (reserve_name, reserve_phone, reserve_email, reserve_time, gym_id, member_id,is_member)VALUES (?, ?, ?, ?, ?, ?,CASE WHEN ? IS NOT NULL THEN 1 ELSE 0 END);";

    const { name, phone, email, reservationTime, gym_id, memberId } = req.body;

    if (!name || !phone || !email || !reservationTime || !gym_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const timeStamp = moment(reservationTime).format("YYYY-MM-DD HH:mm:ss");

    const [result] = await db.query(sql, [
      name,
      phone,
      email,
      timeStamp,
      gym_id,
      memberId || null,
      memberId, // 使用 member_id 來決定 is_member
    ]);

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error adding reservation:", error);
    res
      .status(500)
      .json({ success: false, message: "Error adding reservation" });
  }
});

//檢查場館的收藏狀態
router.get("/check-fav/:userId/:gymId", async (req, res) => {
  const { userId, gymId } = req.params;
  try {
    const sql = `SELECT * FROM FavGyms WHERE member_id_fk = ? AND gym_id_fk = ?;`;
    const [result] = await db.query(sql, [userId, gymId]);
    const isFavorite = result.length > 0;
    res.json({ success: true, isFavorite });
  } catch (error) {
    console.error("Error 檢查 Gymfavorite 狀態:", error);
  }
});

//加入收藏
router.post("/api/favorites/:userId/:gymId", async (req, res) => {
  const { userId, gymId } = req.params;

  // const checkSql = `SELECT COUNT(*) as count FROM FavGyms WHERE member_id_fk = ? AND gym_id_fk = ?;`;
  // const [checkResult] = await db.query(checkSql, [userId, gymId]);
  // const count = checkResult[0].count;
  // if (count > 0) {
  //   return res.json({ success: true, message: "Already in favorites" });
  // }
  try {
    const sql = `INSERT INTO FavGyms (member_id_fk,gym_id_fk) VALUES (?, ?);`;
    const [result] = await db.query(sql, [userId, gymId]);
    res.json({ success: true, result });
    console.log("Favorite added successfully");
    return;
  } catch (error) {
    console.error("Error adding Gymfavorite:", error);
    res
      .status(500)
      .json({ success: false, message: "Error adding Gym favorite" });
  }
});

//取消收藏
router.delete("/api/favorites/:userId/:gymId", async (req, res) => {
  try {
    const { userId, gymId } = req.params;
    const sql = `DELETE FROM FavGyms WHERE member_id_fk = ? AND gym_id_fk = ? ;`;
    const [result] = await db.query(sql, [userId, gymId]);
    res.json({ success: true, result });
  } catch (error) {
    console.error("Error adding Gymfavorite:", error);
    res
      .status(500)
      .json({ success: false, message: "Error adding Gym favorite" });
  }
});

export default router;