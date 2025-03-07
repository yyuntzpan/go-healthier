import express, { query } from "express";
import db from "../../utils/connect-mysql.js";
import moment from "moment-timezone";
import upload from "../../utils/upload-imgs.js";

const router = express.Router();

const dateFormat = "YYYY-MM-DD";

const getArticleList = async (req) => {
  // debug 用 message
  let success = false;

  // 有做分頁功能, 先檢查傳來的頁數是不是 < 1
  let page = req.query.page || 1;
  let redirect = '';

  // 篩選文章列表用的參數
  let category = req.query.category || '';
  let categoryID = 1;
  let keyword = req.query.keyword || "";
  let later_than = req.query.later_than || "";


  // 預設 WHERE & JOIN 子句
  let q_sql = " WHERE 1 ";
  let j_sql = ''
  let column_sql = ''
  if (req.my_jwt) {
    j_sql = `LEFT JOIN FavArticles AS FavA ON FavA.article_id_fk = Articles.article_id AND FavA.member_id_fk = ${req.my_jwt.id}`
    column_sql = 'article_id, article_title, update_at, code_desc, article_cover, FavA.member_id_fk'
  } else {
    column_sql = 'article_id, article_title, update_at, code_desc, article_cover'
  }

  // 先判斷有沒有類別
  if (category) {
    switch (category) {
      case "fitness":
        categoryID = 1;
        break;
      case "healthy_diet":
        categoryID = 2;
        break;
      case "medical_care":
        categoryID = 3;
        break;
      case "mental_wellness":
        categoryID = 4;
        break;
      case "happy_learning":
        categoryID = 5;
        break;

      default:
        categoryID = 1;
        break;
    }
    q_sql += ` AND code_id = ${categoryID} `;
  }

  // 判斷有沒有指定關鍵字搜尋
  if (keyword) {
    const keyword_ = db.escape(`%${keyword}%`)
    q_sql += ` AND (article_title LIKE ${keyword_} OR article_desc LIKE ${keyword_} OR article_content LIKE ${keyword_}) `;
  }

  // 判斷有沒有時間篩選
  if (later_than) {
    const m = moment(later_than)
    if (m.isValid()) {
      q_sql += ` AND update_at >= '${m.format(dateFormat)}' `
    }
  }

  // 決定列表文章數 & 分頁用的參數
  const perPage = 12;
  let totalPages = 0;
  let totalRows = 0;
  let rows = [];
  // 得知篩選資料總筆數
  let t_sql = `SELECT COUNT(1) totalRows FROM Articles JOIN CommonType ON CommonType.code_type = 9 AND CommonType.code_id = Articles.code_id_fk ${j_sql} ${q_sql}`;
  try {
    [[{ totalRows }]] = await db.query(t_sql);
    if (totalRows) {
      success = true;
      totalPages = Math.ceil(totalRows / perPage);
      if (page < 1) {
        page = 1;
        redirect = { page: "1" }
      }
      if (page > totalPages) {
        page = totalPages;
        redirect = { page: `${totalPages}` }
      }
    }
  } catch (error) {
    console.log('database query totalRows error: ', error)
    return { success }
  }

  // 從資料庫拿文章列表
  const sql = `SELECT ${column_sql} FROM Articles JOIN CommonType AS CT ON CT.code_type = 9 AND CT.code_id = Articles.code_id_fk ${j_sql} ${q_sql} ORDER BY update_at DESC LIMIT ${(page - 1) * perPage}, ${perPage};`;

  try {
    [rows] = await db.query(sql);
    rows.forEach((element) => {
      const m = moment(element.update_at)
      element.update_at = m.isValid() ? m.format(dateFormat) : "";
    })
    success = true;
    return {
      success,
      perPage,
      page,
      totalRows,
      totalPages,
      rows,
      redirect,
      qs: req.query,
    }
  } catch (error) {
    console.log('database query list error: ', error)
    success = false
    return {
      success,
      rows
    }
  }
}

const getAuthorData = async (author_id, author_is_coach) => {
  let success = false
  let author_sql = ''
  let data = {}
  let result = {
    author_id: 0,
    author_name: '',
    author_desc: '',
    author_image: '',
    author_href: ''
  }

  try {
    if (author_is_coach === 0) {
      author_sql = `SELECT * FROM Authors WHERE author_id = ${author_id}`;
    } else {
      author_sql = `SELECT c.coach_id, c.coach_name, c.coach_info, ci.coach_img FROM Coaches c JOIN CoachImgs ci ON c.coachImgs_id = ci.coachImgs_id WHERE c.coach_id = ${author_is_coach}`;
    }
    [[data]] = await db.query(author_sql)
    if (data) {
      if (author_is_coach === 0) {
        result = {
          ...result,
          author_name: data.author_name,
          author_desc: data.author_desc,
          author_image: `/articles-img/${data.author_image}`,
          author_href: data.author_href
        }
      } else {
        result = {
          ...result,
          author_id: data.coach_id,
          author_name: data.coach_name,
          author_desc: data.coach_info,
          author_image: `/${data.coach_img}`
        }
      }
      success = !!result
    }
  } catch (error) {
    console.log('database fetch author error: ', error)
  }
  return {
    success,
    result
  }
}

const getComment = async (req) => {
  let success = false
  let message = '';
  const article_id = parseInt(req.article_id);
  const main = parseInt(req.main);
  const sub = parseInt(req.sub);
  let group = parseInt(req.group);
  const perGroup = 3;
  let totalGroup = 0;
  let totalRows = 0;
  let t_sql = '';
  let sql = '';
  let data = [];

  if (sub > 0) {
    if (main <= 0) {
      return { success, message: 'error main and sub' }
    }
  }

  if (main === 0 && sub === 0) {
    // get all main comment under an article
    t_sql = `SELECT COUNT(main) AS totalRows FROM Comments WHERE article_id_fk = ${article_id} AND sub = 0 GROUP BY article_id_fk;`;
    sql = `SELECT c.article_id_fk, c.member_id_fk, nick_name, avatar, c.comment_id, c.create_at, c.update_at, c.comment_content, c.main, (SELECT COUNT(*) FROM Comments sub WHERE sub.article_id_fk = c.article_id_fk AND sub.main = c.main AND sub.sub != 0) AS sub_count FROM Comments C LEFT JOIN Members ON member_id_fk = member_id WHERE c.article_id_fk = ${article_id} AND c.sub = 0 GROUP BY c.article_id_fk, c.member_id_fk, c.comment_id, nick_name, avatar, c.create_at, c.update_at, c.comment_content, c.main ORDER BY c.update_at DESC LIMIT ${perGroup * (group - 1)},${perGroup};`;
  } else if (sub < 0) {
    // get all sub reply under a main comment
    t_sql = `SELECT COUNT(CASE WHEN sub != 0 THEN 1 END) AS totalRows FROM Comments WHERE article_id_fk = ${article_id} AND main = ${main} AND sub!= 0 GROUP BY article_id_fk;`;
    sql = `SELECT c.article_id_fk, c.member_id_fk, nick_name, avatar, c.create_at, c.update_at, c.comment_content, c.main, c.sub FROM Comments C LEFT JOIN Members ON member_id_fk = member_id WHERE c.article_id_fk = ${article_id} AND c.main = ${main} AND sub!= 0 ORDER BY c.update_at DESC LIMIT ${perGroup * (group - 1)},${perGroup};`;
  } else if (main > 0 && sub === 0) {
    // get specific sub comment under specific main comment
    if (sub > 0) {
      return { success, message: 'yet to design get only one reply' }
    }
    // get only 1 main comment
    return { success, message: 'yet to design get only one comment' }
  }

  [[{ totalRows }]] = await db.query(t_sql);

  if (!totalRows) {
    return message = 'the target has no comments'
  }
  totalGroup = Math.ceil(totalRows / perGroup)

  if (group > totalGroup) {
    group = totalGroup
  }

  try {
    [data] = await db.query(sql);
    // TODO: update database and backend to use UTC
    if (data) {
      success = true
      const currentDateTime = moment()
      for (let i of data) {
        const m = moment(i.update_at);
        const m_create = moment(i.create_at);
        const duration = moment.duration(currentDateTime.diff(m));
        let update_label = m > m_create ? '編輯' : ''

        if (duration.asMinutes() < 60) {
          const update_at_ = Math.ceil(duration.asMinutes())
          i.update_at = `${update_at_}分鐘前${update_label}`
          continue;
        }
        if (duration.asHours() < 60) {
          const update_at_ = Math.floor(duration.asHours())
          i.update_at = `${update_at_}小時前${update_label}`
          continue;
        }
        if (duration.asMonths() < 12) {
          if (duration.asMonths() < 1) {
            const update_at_ = Math.ceil(duration.asDays())
            i.update_at = `${update_at_}天前${update_label}`
            continue;
          } else {
            const update_at_ = Math.floor(duration.asMonths())
            i.update_at = `${update_at_}個月前${update_label}`
            continue;
          }
        }
        if (duration.asMonths() > 12) {
          const update_at_ = Math.floor(duration.asYears())
          i.update_at = `${update_at_}年前${update_label}`
          continue;
        }
      }
    }
  } catch (error) {
    message = `getComment error: ${error}`
  }

  return { success, data, totalGroup, perGroup, totalRows, message };
}

router.get("/api/listData", async (req, res) => {
  const data = await getArticleList(req);
  res.json(data);
});

router.get("/api/articleIndex", async (req, res) => {
  // 定義最新文章及熱門文章
  let latestQuery = { ...req, query: { later_than: "2024-01-01" } };
  let hotQuery = { ...req, query: { keyword: "挑戰" } };
  // debug 用參數, 存列表的參數
  let success = false;
  let latestList = [];
  let hotList = [];

  // 從資料庫拿最新及熱門文章列表
  const latestData = await getArticleList(latestQuery);
  if (latestData.success) {
    latestList = latestData.rows;
  }
  const hotData = await getArticleList(hotQuery);
  if (hotData.success) {
    hotList = hotData.rows;
  }

  // 兩個列表都成功 success = true
  if (hotData.success && latestData.success) {
    success = true;
  }

  res.json({
    success,
    latestList,
    hotList
  })
})

router.get("/api/entry/:article_id", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    result: {},
    furtherReading: [],
    authorInfo: {}
  }

  let j_sql = '';
  let column_sql = '';
  if (req.my_jwt) {
    j_sql = `LEFT JOIN FavArticles AS FavA ON FavA.article_id_fk = Articles.article_id AND FavA.member_id_fk = ${req.my_jwt.id}`
    column_sql = 'article_id, article_title, author_id, author_is_coach, update_at, code_id, article_cover, article_desc, article_content, FavA.member_id_fk';
  } else {
    column_sql = 'article_id, article_title, author_id, author_is_coach, update_at, code_id, article_cover, article_desc, article_content';
  }

  const {article_id}= req.params;
  if (isNaN(article_id) || article_id <= 0) {
    output.error = 'invalid article id';
    return res.status(404).json(output);
  }

  let articleCategory = 0;
  let category = '';
  let author_id = 0;
  let author_is_coach = 0;
  const sql = `SELECT ${column_sql} FROM Articles JOIN CommonType AS CT ON CT.code_type = 9 AND CT.code_id = Articles.code_id_fk JOIN Authors ON author_id_fk = author_id ${j_sql} WHERE article_id = ${article_id}`;

  try {
    [[output.result]] = await db.query(sql);
    output.success = !!output.result;
    if (output.success) {
      const m = moment(output.result.update_at);
      output.result.update_at = m.isValid() ? m.format(dateFormat) : "";
      articleCategory = output.result.code_id;
      author_id = output.result.author_id;
      author_is_coach = output.result.author_is_coach;

      if(req.my_jwt && output.result.member_id_fk === null) {
        output.result.member_id_fk = 0
      }
    } else {
      output.error = 'invalid article id'
      return res.status(404).json(output)
    }
  } catch (error) {
    console.log('database fetch article error: ', error)
    output.error = `database fetch article error: ${error}`
    return res.status(500).json(output)
  }

  try {
    if (articleCategory) {
      switch (articleCategory) {
        case 1:
          category = "fitness";
          break;
        case 2:
          category = "healthy_diet";
          break;
        case 3:
          category = "medical_care";
          break;
        case 4:
          category = "mental_wellness";
          break;
        case 5:
          category = "happy_learning";
          break;

        default:
          category = '';
          break;
      }
    }

    const req2 = { ...req, query: { category: category } }

    const listData = await getArticleList(req2)
    if (listData.success) {
      output.furtherReading = listData.rows
      output.furtherReading.forEach((element) => {
        const m = moment(element.update_at)
        element.update_at = m.isValid() ? m.format(dateFormat) : "";
      })
    }
  } catch (error) {
    console.log('database fetch further reading list error: ', error)
    output.code = 400
    output.message += `database fetch further reading list error: ${error}`
  }

  try {
    const authorData = await getAuthorData(author_id, author_is_coach)
    if (authorData.success) {
      output.authorInfo = authorData.result
    }
  } catch (error) {
    console.log('database fetch author data error', error)
    output.code = 400
    output.message += `database fetch author data error: ${error}`
  }

  res.json(output)
})

router.post('/api/addfavarticle', async (req, res) => {
  const output = { success: false, }
  const { member_id, article_id } = req.body
  const sql = `INSERT INTO FavArticles (member_id_fk, article_id_fk) VALUES(?, ?);`;

  if (isNaN(member_id) || member_id <= 0) {
    output.error = 'invalid member_id';
    return res.status(400).json(output)
  }
  if (isNaN(article_id) || article_id <= 0) {
    output.error = 'invalid article_id';
    return res.status(400).json(output)
  }

  if (!req.my_jwt) {
    output.error = 'must login to add favorite'
    return res.status(400).json(output)
  }

  try {
    const [result] = await db.query(sql, [member_id, article_id])
    output.success = !!result.affectedRows
    return res.status(200).json(output)
  } catch (error) {
    output.error = `database insert error: ${error}`
    return res.status(500).json(output)
  }
})

router.delete('/api/removefavarticle', async (req, res) => {
  const output = { success: false };
  const { member_id, article_id } = req.body;
  const q_sql = `WHERE member_id_fk = ? AND article_id_fk = ?`
  const sql = `DELETE FROM FavArticles ${q_sql};`;

  if (!req.my_jwt) {
    output.error = 'must login to delete favorite'
    return res.status(400).json(output)
  }

  if (isNaN(member_id) || member_id <= 0) {
    output.error = 'invalid member_id';
    return res.status(400).json(output)
  }
  if (isNaN(article_id) || article_id <= 0) {
    output.error = 'invalid article_id';
    return res.status(400).json(output)
  }

  try {
    const [result] = await db.query(sql, [member_id, article_id])
    output.success = !!result.affectedRows
    return res.json(output)
  } catch (error) {
    output.error = `database delete error: ${error}`
    return res.json(output)
  }
})

router.get('/api/comment', async (req, res) => {
  const output = { success: false }
  const { article_id, main, sub, group } = req.query

  if (isNaN(article_id) || article_id <= 0) {
    output.error = 'invalid article_id'
    return res.status(400).json(output)
  }
  if (isNaN(main) || isNaN(sub) || isNaN(group) || main < 0 || group <= 0) {
    output.error = 'invalid main, sub, or group'
    return res.status(400).json(output)
  }
  const request = { article_id: article_id, main: main, sub: sub, group: group }

  try {
    const data = await getComment(request)
    if (!data || data.message) {
      output.data = data
      output.error = 'fail to retrieve data'
      return res.status(500).json(output)
    }
    output.success = true
    res.status(200).json(data)
  } catch (error) {
    output.error = 'backend error'
    return res.status(500).json(output)
  }

})

router.post('/api/comment', async(req,res)=>{
  const output = { success: false };
  if (!req.my_jwt) {
    output.error = 'must login to leave comment'
    return res.status(400).json(output)
  }

  const { article_id, main, sub, member_id, comment_content } = req.body;
  const sql = `INSERT INTO Comments (comment_content, article_id_fk, member_id_fk, main, sub) VALUES (?, ?, ?, ?, ?);`;

  if (isNaN(article_id) || article_id <= 0) {
    output.error = 'invalid article_id';
    return res.status(400).json(output);
  }
  if (isNaN(member_id) || member_id <= 0) {
    output.error = 'invalid member_id';
    return res.status(400).json(output);
  }
  if (isNaN(main) || isNaN(sub) || main <= 0 || sub < 0) {
    output.error = 'invalid main or sub';
    return res.status(400).json(output);
  }

  try {
    const [result] = await db.query(sql, [comment_content, article_id, member_id, main, sub])
    output.result = result
    output.success = !!result.affectedRows
    if (output.success) {
      return res.status(200).json(output)
    } else {
      output.error = 'database error'
      return res.status(500).json(output)
    }
  } catch (error) {
    output.error = `database fetch error: ${error}`;
    res.status(500).json(output);
  }

})

router.put('/api/comment/:comment_id', async (req, res) => {
  const output = {
    success: false
  }
  const { comment_id } = req.params;
  const { comment_content } = req.body;

  if (isNaN(comment_id) || comment_id <= 0) {
    output.error = 'invalid comment_id';
    return res.status(400).json(output);
  }

  if (!comment_content || comment_content.trim() === '') {
    output.error = 'must provide comment content';
    return res.status(400).json(output);
  }

  if (!req.my_jwt) {
    output.error = 'must login to update comment'
    return res.status(400).json(output)
  }

  const sql = `UPDATE Comments SET comment_content = ?, update_at = NOW()
WHERE comment_id = ?;`;

  try {
    const [data] = await db.query(sql, [comment_content, comment_id]);
    if (data.affectedRows === 0) {
      output.error = 'error updating data in database or invalid comment_id';
      return res.status(500).json(output);
    }
    output.success = true;
    output.data = data;
    res.status(200).json(output);
  } catch (error) {
    output.error = `database update fail: ${error}`
    return res.status(500).json(output)
  }
})

export default router;