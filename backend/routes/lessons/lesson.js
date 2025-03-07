import express from "express";
import db from "./../../utils/connect-mysql.js";
import moment from "moment-timezone";
import upload from "./../../utils/upload-imgs.js";
const router = express.Router();

const getLessonById = async (req) => {
  // 根據課程ID獲取單個課程的詳細信息
    let success = false;
    let lesson = null;
    const lessonId = req.params.id;

    const sql = `SELECT 
        l.lesson_id,
        l.lesson_name,
        l.lesson_state,
        FORMAT(l.lesson_price, 0) AS lesson_price,
        l.lesson_desc,
        l.lesson_date,
        GROUP_CONCAT(DISTINCT ct.code_desc ORDER BY ct.code_desc SEPARATOR '/') AS categories,
        li.lesson_img,
        c.coach_name,
        g.gym_name
    FROM 
        Lessons l
    JOIN 
        LessonCategories lc ON l.lesson_id = lc.lesson_id
    JOIN 
        CommonType ct ON lc.commontype_id = ct.commontype_id
    JOIN 
        LessonImgs li ON l.LessonImgs_id = li.LessonImgs_id
    JOIN 
        Coaches c ON l.coach_id = c.coach_id
    JOIN 
        Gyms g ON l.gym_id = g.gym_id
    WHERE 
        l.lesson_id = ?
    GROUP BY 
        l.lesson_id`;

        try {
            // 執行 SQL 查詢
            const [rows] = await db.query(sql, [lessonId]);
            if (rows.length > 0) {
                lesson = rows[0];
                success = true;
            }
        } catch (error) {
            console.error('Error fetching lesson by id:', error);
        }
    
        return { success, lesson };
};

const getLessonCategories = async () => {
   // 獲取所有課程類別
    let success = false;
    let categories = [];
  
    try {
      const sql = `SELECT code_desc FROM CommonType WHERE code_type = 4;`;
      [categories] = await db.query(sql);
      success = true;
    } catch (error) {
      console.error('Error fetching lesson categories:', error);
    }
  
    return { success, categories };
  };

// const getLessonType = async (req) => {
//     let success = false;
//     let categories = [];
  
//     const sql = `SELECT * FROM CommonType WHERE code_type = 4;`;
//     [categories] = await db.query(sql);
  
//     success = true;
//     return {
//         success,
//         categories,
//         qs: req.query
//     };
// };

const getLesson = async (req) => {
  // 獲取課程列表，支持按類別和關鍵字篩選
    let success = false;
    let rows = [];
    
    let code_desc = req.query.code_desc || "";
    //  關鍵字的參數
    let keyword = req.query.keyword || "";
    let q_sql = ' WHERE 1 ';

    // 篩選類別
    if(code_desc){
        const categories = code_desc.split('-');
        if (categories.length > 0) {
            q_sql += ` AND l.lesson_id IN (
                SELECT DISTINCT lc.lesson_id 
                FROM LessonCategories lc 
                JOIN CommonType ct ON lc.commontype_id = ct.commontype_id 
                WHERE ct.code_desc IN (${categories.map(cat => `'${cat}'`).join(',')})
            )`;
        }
    }

    // 篩選關鍵字
    if (keyword) {q_sql += ` AND l.lesson_name LIKE '%${keyword}%'`; }

    const sql = `SELECT 
        l.lesson_id,
        l.lesson_name,
        l.lesson_state,
        FORMAT(l.lesson_price, 0) AS lesson_price,
        l.lesson_desc,
        l.lesson_date,
        GROUP_CONCAT(DISTINCT ct.code_desc ORDER BY ct.code_desc SEPARATOR '/') AS categories,
        li.lesson_img,
        c.coach_name,
        g.gym_name
    FROM 
        Lessons l
    JOIN 
        LessonCategories lc ON l.lesson_id = lc.lesson_id
    JOIN 
        CommonType ct ON lc.commontype_id = ct.commontype_id
    JOIN 
        LessonImgs li ON l.LessonImgs_id = li.LessonImgs_id
    JOIN 
        Coaches c ON l.coach_id = c.coach_id
    JOIN 
        Gyms g ON l.gym_id = g.gym_id
    ${q_sql}
    GROUP BY 
        l.lesson_id
    ORDER BY 
        l.lesson_id DESC`;

    try {
      // 執行數據庫查詢
        [rows] = await db.query(sql);
        success = true;
    } catch (error) {
        console.error('Error fetching lessons:', error);
    }

    console.log('Received code_desc:', req.query.code_desc);
    console.log('Received keyword:', req.query.keyword);
    console.log('Generated SQL:', sql);

    return { success, rows };
};

// 獲取課程列表頁面
router.get('/lessons', async (req, res) => {
    try {
        const data = await getLesson(req);
        if (data.redirect) {
            return res.redirect(data.redirect);
        }
        if (data.success) {
            res.render('articles/list', data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// 得到課程類別
router.get('/categories', async (req, res) => {
    try {
      const data = await getLessonCategories();
      if (data.success) {
        res.json(data);
      } else {
        res.status(404).json({ success: false, message: 'No categories found' });
      }
    } catch (error) {
      console.error('Route error:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

// 獲取課程列表 API
router.get("/api", async (req, res) => {
    try {
        const data = await getLesson(req);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get("/api/hotLessons", async (req, res) => {
  try {
      const sql = `
      SELECT 
        l.lesson_id,
        l.lesson_name,
        l.lesson_state,
        FORMAT(l.lesson_price, 0) AS lesson_price,
        l.lesson_desc,
        DATE_FORMAT(l.lesson_date, '%Y-%m-%d %H:%i') AS lesson_date,
        GROUP_CONCAT(DISTINCT ct.code_desc ORDER BY ct.code_desc SEPARATOR '/') AS categories,
        li.lesson_img,
        c.coach_name,
        g.gym_name
      FROM 
        Lessons l
      JOIN 
        LessonCategories lc ON l.lesson_id = lc.lesson_id
      JOIN 
        CommonType ct ON lc.commontype_id = ct.commontype_id
      JOIN 
        LessonImgs li ON l.LessonImgs_id = li.LessonImgs_id
      JOIN 
        Coaches c ON l.coach_id = c.coach_id
      JOIN 
        Gyms g ON l.gym_id = g.gym_id
      WHERE 
       lesson_price<1000
      GROUP BY 
        l.lesson_id
      ORDER BY 
        l.lesson_id`;

      const [rows] = await db.query(sql);

      if (rows.length > 0) {
          res.json({ success: true, hotLessons: rows });
      } else {
          res.status(404).json({ success: false, message: 'No hot lessons found' });
      }
  } catch (error) {
      console.error('Error fetching hot lessons:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});


// 獲取單個課程詳情 API
router.get("/api/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `
        SELECT 
          l.lesson_id,
          l.lesson_name,
          l.lesson_state,
          FORMAT(l.lesson_price, 0) AS lesson_price,
          l.lesson_desc,
          DATE_FORMAT(l.lesson_date, '%Y-%m-%d %H:%i') AS lesson_date,
          GROUP_CONCAT(DISTINCT ct.code_desc ORDER BY ct.code_desc SEPARATOR '/') AS categories,
          li.lesson_img,
          c.coach_name,
          g.gym_name
        FROM 
          Lessons l
        JOIN 
          LessonCategories lc ON l.lesson_id = lc.lesson_id
        JOIN 
          CommonType ct ON lc.commontype_id = ct.commontype_id
        JOIN 
          LessonImgs li ON l.LessonImgs_id = li.LessonImgs_id
        JOIN 
          Coaches c ON l.coach_id = c.coach_id
        JOIN 
          Gyms g ON l.gym_id = g.gym_id
        WHERE 
          l.lesson_id = ?
        GROUP BY 
          l.lesson_id
      `;
  
      const [rows] = await db.query(sql, [id]);
      if (rows.length > 0) {
        res.json({ success: true, lesson: rows[0] });
      } else {
        res.status(404).json({ success: false, message: 'Lesson not found' });
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // 處理前端所發送的創建訂單請求，並將訂單狀態設為預設值pending
  router.post("/create-order", async (req, res) => {
    const { member_id, lesson_id } = req.body;
    try {
      const sql = "INSERT INTO LessonOrders (member_id, lesson_id, order_status) VALUES (?, ?, 'pending')";
      const [result] = await db.query(sql, [member_id, lesson_id]);
      res.json({ success: true, orderId: result.insertId });
    } catch (error) {
      console.error('創建訂單時發生錯誤:', error);
      res.status(500).json({ success: false, message: '伺服器錯誤' });
    }
  });

  router.post("/update-order", async (req, res) => {
    // const { order_number } = req.body;
    // console.log('接收到的 order_number:', order_number);
  
    // if (!order_number) {
    //   return res.status(400).json({ success: false, message: '缺少 order_number' });
    // }
  
    try {
      const sql = "UPDATE LessonOrders SET order_status = 'paid', payment_date = NOW()";
      const [result] = await db.query(sql);
      
      console.log('更新結果:', result);
  
      if (result.affectedRows > 0) {
        res.json({ success: true, message: '訂單狀態更新成功' });
      } else {
        res.status(404).json({ success: false, message: '未找到訂單或狀態未更改' });
      }
    } catch (error) {
      console.error('更新訂單狀態時發生錯誤:', error);
      res.status(500).json({ success: false, message: '伺服器錯誤' });
    }
  });

  router.get("/user-lessons/:memberId", async (req, res) => {
    const { memberId } = req.params;
    try {
      const sql = `
      SELECT 
  l.lesson_id,
  l.lesson_name,
  FORMAT(l.lesson_price, 0) AS lesson_price,
  l.lesson_desc,
  DATE_FORMAT(l.lesson_date, '%Y-%m-%d %H:%i') AS lesson_date,
  li.lesson_img,
  c.coach_name,
  g.gym_name,
  lo.order_status,
  (SELECT GROUP_CONCAT(DISTINCT ct.code_desc ORDER BY ct.code_desc SEPARATOR '/') 
   FROM LessonCategories lc 
   JOIN CommonType ct ON lc.commontype_id = ct.commontype_id 
   WHERE lc.lesson_id = l.lesson_id) AS categories
FROM 
  LessonOrders lo
JOIN 
  Lessons l ON lo.lesson_id = l.lesson_id
JOIN 
  LessonImgs li ON l.LessonImgs_id = li.LessonImgs_id
JOIN 
  Coaches c ON l.coach_id = c.coach_id
JOIN 
  Gyms g ON l.gym_id = g.gym_id
WHERE 
  lo.member_id = ? AND lo.order_status = 'paid'
ORDER BY 
  lo.order_date DESC
    `;
  
      const [rows] = await db.query(sql, [memberId]);
      res.json({ success: true, lessons: rows });
    } catch (error) {
      console.error('Error fetching user lessons:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
export default router;
