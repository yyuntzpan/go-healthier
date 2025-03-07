import express from 'express';
import db from '../../utils/connect-mysql.js';
import jsonwebtoken from 'jsonwebtoken';

const router = express.Router();

router.post('/', async function (req, res, next) {
    if (!req.body.providerId || !req.body.uid) {
        return res.json({ status: 'error', message: '缺少google登入資料' });
    }

    const { memberName, email, uid } = req.body;

    const google_uid = uid;

    try {
        // 查詢資料庫是否有同 google_uid 的資料
        const [rows] = await db.execute('SELECT * FROM Members WHERE google_uid = ?', [google_uid]);

        let userData;

        if (rows.length > 0) {
            // 用户已存在
            userData = rows[0];
        } else {
            // 用户不存在，創建新用户
            const [result] = await db.execute(
                'INSERT INTO Members (member_name, member_email, google_uid) VALUES (?, ?, ?)',
                [memberName, email, google_uid]
            );
            // 查詢新用戶資料
            const [newUserRows] = await db.execute('SELECT * FROM Members WHERE member_id = ?', [result.insertId]);
            userData = newUserRows[0];
        }

        // 生成訪問令牌 (access token)
        const payload = {
            id: userData.member_id,
            email: userData.member_email,
        };

        const token = jsonwebtoken.sign(payload, process.env.JWT_KEY, {
            expiresIn: '3d',// 令牌效期 3 天
        });

        // 使用 httpOnly cookie 讓瀏覽器存 access token
        // res.cookie('accessToken', accessToken, { httpOnly: true });

        const googleLoginData = ({
            success: true,
            data: {
                id: userData.member_id,
                google_uid: userData.google_uid,//資料庫中用戶的google_uid
                email: userData.member_email,
                name: userData.member_name,
                nick_name: userData.nick_name || '',
                avatar: userData.avatar,
                mobile: userData.mobile || '',
                city: userData.city_id || '',
                district: userData.district_id || '',
                address: userData.address || '',
                token,
            },
        });
        console.log('googleLoginData:', googleLoginData);

        res.json(googleLoginData);

    } catch (error) {
        console.error('Error handling Google login:', error);
        return res.status(500).json({ status: 'error', message: '伺服器內部錯誤' });
    }
});

export default router;
