import express from "express";
import db from "./../../utils/connect-mysql.js";
import moment from "moment-timezone";
import upload from "./../../utils/upload-imgs.js";
const router = express.Router();

const getCoachById = async (req) => {
    // 根據課程ID獲取單個教練的詳細信息，找到指定教練
      let success = false;
      let coach = null;
      const coachId = req.params.id;
  
      const sql = `SELECT 
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
    CoachSkills cs ON c.coach_id = cs.coach_id
JOIN 
    CommonType ct ON cs.commontype_id = ct.commontype_id
JOIN 
    CoachImgs ci ON c.coachImgs_id = ci.coachImgs_id
JOIN 
    Gyms g ON c.gym_id = g.gym_id
WHERE 
        c.coach_id = ?
GROUP BY 
    c.coach_id, g.gym_name, ci.coach_img`;
  
          try {
              // 執行 SQL 查詢
              const [rows] = await db.query(sql, [coachId]);
              if (rows.length > 0) {
                  coach = rows[0];
                  success = true;
              }
          } catch (error) {
              console.error('Error fetching lesson by id:', error);
          }
      
          return { success, lesson };
  };

  const getCoachCategories = async () => {
    // 搜尋教練技能類別
    let success = false;
    let categories = [];
  
    try {
      const sql = `SELECT code_desc FROM CommonType WHERE code_type = 4;`;
      [categories] = await db.query(sql);
      success = true;
    } catch (error) {
      console.error('Error fetching coach categories:', error);
    }
  
    return { success, categories };
  };

// const getCoachType = async (req) => {
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

const getCoach = async (req) => {
    let success = false;
    let redirect = '';
    let rows = [];
    let totalPages = 0;
    let page = parseInt(req.query.page) || 1;
    
    const q_sql = ' WHERE 1 ';
    const t_sql = `SELECT COUNT(1) totalRows FROM Coaches ${q_sql}`;
    const [[{ totalRows }]] = await db.query(t_sql);

    if (totalRows) {
        success = true;
        const perPage = 5;
        totalPages = Math.ceil(totalRows / perPage);

        if (page < 1) {
            redirect = "?page=1";
            return { success, redirect };
        }
        if (page > totalPages) {
            redirect = `?page=${totalPages}`;
            return { success, redirect };
        }

        const sql = `SELECT 
        c.coach_id,
        c.coach_name,
        c.coach_phone,
        c.coach_gender,
        c.coach_info,
        c.coach_price,
        c.create_date,
        c.update_at,
        GROUP_CONCAT(DISTINCT ct.code_desc ORDER BY ct.code_desc SEPARATOR '/') AS skills,
        ci.coach_img,
        g.gym_name AS gym
    FROM 
        Coaches c
    JOIN 
        CoachSkills cs ON c.coach_id = cs.coach_id
    JOIN 
        CommonType ct ON cs.commontype_id = ct.commontype_id
    JOIN 
        CoachImgs ci ON c.coachImgs_id = ci.coachImgs_id
    JOIN 
        Gyms g ON c.gym_id = g.gym_id
    GROUP BY 
        c.coach_id, g.gym_name, ci.coach_img
    ORDER BY 
        c.coach_id DESC;`;
    
        [rows] = await db.query(sql);
        rows.forEach((el) => {
            const m1 = moment(el.update_at);
            el.lesson_date = m1.isValid() ? m1.format('YYYY-MM-DD hh:mm:ss') : '';
        });
    }

    return { success, rows, totalPages, page };
};

router.get('/coaches', async (req, res) => {
    try {
        const data = await getCoach(req);
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
      const data = await getCoachCategories();  // 使用正確的函數名
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

  router.get("/api", async (req, res) => {
    try {
      const { code_desc, keyword } = req.query;
  
      let sql = `
        SELECT 
            c.coach_id,
            c.coach_name,
            c.coach_phone,
            c.coach_gender,
            c.coach_info,
            c.coach_price,
            c.create_date,
            c.update_at,
            GROUP_CONCAT(DISTINCT ct.code_desc ORDER BY ct.code_desc SEPARATOR '/') AS skills,
            ci.coach_img,
            g.gym_name AS gym
        FROM 
            Coaches c
        JOIN 
            CoachSkills cs ON c.coach_id = cs.coach_id
        JOIN 
            CommonType ct ON cs.commontype_id = ct.commontype_id
        JOIN 
            CoachImgs ci ON c.coachImgs_id = ci.coachImgs_id
        JOIN 
            Gyms g ON c.gym_id = g.gym_id
      `;
  
      const whereConditions = [];
      const params = [];
  
      if (code_desc) {
        const categories = code_desc.split('-');
        whereConditions.push(`c.coach_id IN (
            SELECT DISTINCT cs2.coach_id 
            FROM CoachSkills cs2 
            JOIN CommonType ct2 ON cs2.commontype_id = ct2.commontype_id 
            WHERE ct2.code_desc IN (${categories.map(() => '?').join(',')})
        )`);
        params.push(...categories);
      }
  
      if (keyword) {
        whereConditions.push(`(c.coach_name LIKE ? OR c.coach_info LIKE ?)`);
        params.push(`%${keyword}%`, `%${keyword}%`);
      }
  
      if (whereConditions.length > 0) {
        sql += ` WHERE ${whereConditions.join(' AND ')}`;
      }
  
      sql += `
        GROUP BY 
            c.coach_id, g.gym_name, ci.coach_img
        ORDER BY 
            c.coach_id DESC
      `;
  
      const [rows] = await db.query(sql, params);
  
      res.json({ success: true, rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  router.get("/api/hotCoach", async (req, res) => {
  try{
    let sql = `
    SELECT 
        c.coach_id,
        c.coach_name,
        c.coach_phone,
        c.coach_gender,
        c.coach_info,
        c.coach_price,
        c.create_date,
        c.update_at,
        GROUP_CONCAT(DISTINCT ct.code_desc ORDER BY ct.code_desc SEPARATOR '/') AS skills,
        ci.coach_img,
        g.gym_name AS gym
    FROM 
        Coaches c
    JOIN 
        CoachSkills cs ON c.coach_id = cs.coach_id
    JOIN 
        CommonType ct ON cs.commontype_id = ct.commontype_id
    JOIN 
        CoachImgs ci ON c.coachImgs_id = ci.coachImgs_id
    JOIN 
        Gyms g ON c.gym_id = g.gym_id
    WHERE c.coach_id<=8
    group by c.coach_id
  `;
  const [rows] = await db.query(sql);

  if (rows.length > 0) {
      res.json({ success: true, hotCoaches: rows });
  } else {
      res.status(404).json({ success: false, message: 'No hot coaches found' });
  }
  }catch(error){
    console.error('Error fetching hot coaches:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
    
  });


router.get("/api/:id", async (req, res) => {
    const { id } = req.params;
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
    CoachSkills cs ON c.coach_id = cs.coach_id
JOIN 
    CommonType ct ON cs.commontype_id = ct.commontype_id
JOIN 
    CoachImgs ci ON c.coachImgs_id = ci.coachImgs_id
JOIN 
    Gyms g ON c.gym_id = g.gym_id
WHERE 
        c.coach_id = ?
GROUP BY 
    c.coach_id, g.gym_name, ci.coach_img
      `;
  
      const [rows] = await db.query(sql, [id]);
      if (rows.length > 0) {
        res.json({ success: true, coach: rows[0] });
      } else {
        res.status(404).json({ success: false, message: 'Coach not found' });
      }
    } catch (error) {
      console.error('Error fetching coach:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

export default router;
