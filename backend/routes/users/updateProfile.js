import express from 'express';
import db from '../../utils/connect-mysql.js';
import bcrypt from "bcrypt";

const router = express.Router();
console.log('updateProfile router module loaded');

// 使用 Promise 來測試資料庫連接
db.query('SELECT 1')
    .then(() => console.log('資料庫連接成功'))
    .catch(err => console.error('資料庫連接錯誤:', err));

router.post('/:member_id', async (req, res) => {
    try {
        console.log('收到更新請求，member_id:', req.params.member_id);
        console.log('請求body:', req.body);

        const { name, nick_name, mobile, address, city, district, password } = req.body;
        const memberId = req.params.member_id;

        // 處理空字符串和零值
        const mobileValue = mobile || null;
        const addressValue = address || null;
        const cityValue = city || null;
        const districtValue = district || null;

        // 構建 SQL 查詢
        let query = `
      UPDATE members 
      SET member_name = ?, nick_name = ?, mobile = ?, address = ?, city_id = ?, district_id = ?
    `;

        let queryParams = [name, nick_name, mobileValue, addressValue, cityValue, districtValue];

        //看看有沒有更改密碼，如果沒改，就更新資料滾回頁面頂端
        let isPasswordChange = false;

        // 只有在提供密碼時才更新密碼
        if (password) {

            //雜湊
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // 更新密碼
            query += `, member_password = ?`;
            queryParams.push(hashedPassword);

            //有更改讓前端跳轉到登入頁
            isPasswordChange = true;
            console.log("isPasswordChange", isPasswordChange);
        }

        query += ` WHERE members.member_id = ?`;
        queryParams.push(memberId);

        // 執行查詢
        const [results] = await db.query(query, queryParams);

        res.json({ message: '個人資料更新成功', affectedRows: results.affectedRows, isPasswordChange: isPasswordChange });
    } catch (error) {
        console.error('更新失敗:', error);
        res.status(500).json({ error: '更新失敗', details: error.message });
    }
});

export default router;


// console.log('updateProfile router module loaded');

// router.post('/:member_id', (req, res) => {
//     console.log('Update profile route hit');
//     console.log(`Received request to update profile for member_id: ${req.params.member_id}`);
//     console.log('Request body:', req.body);
//     res.json({ message: 'Profile update route hit successfully' });
// });

// export default router;