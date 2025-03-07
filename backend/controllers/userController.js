import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import db from "../utils/connect-mysql.js";

const userController = {
    forgotPassword: async (req, res) => {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: '電子信箱不得為空' });
        }

        try {
            const [user] = await db.query('SELECT * FROM members WHERE member_email = ?', [email]);

            if (!user || user.length === 0) {
                return res.status(404).json({ message: '資料錯誤' });
            }
            // 檢查是否正確獲取
            console.log('User found:', user);

            // 檢查最近一次重置密碼請求的時間
            const lastRequestTime = new Date(user[0].lastRequestTime || 0);
            const sendMailNow = new Date();
            const MIN_INTERVAL = 60000; // 最小間隔時間，單位毫秒，這裡設置為1分鐘

            if (sendMailNow - lastRequestTime < MIN_INTERVAL) {
                return res.status(429).json({ message: '請求太頻繁，請稍後再試' });
            }

            // 更新用戶的最近請求時間
            await db.query('UPDATE members SET lastRequestTime = ? WHERE member_id = ?', [sendMailNow, user[0].member_id]);

            // resetToken 生成重置token，發送重置密碼的電子郵件，並將token存在database
            const token = Math.random().toString(16).slice(2);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MY_EMAIL,
                    pass: process.env.MY_PASSWORD
                }
            });

            await transporter.sendMail({
                from: process.env.MY_EMAIL,
                to: user[0].member_email,//你要寄給誰
                subject: '重設密碼',//信件主旨
                html: `<p>${user[0].member_name} 您好</p><p>請點以下連結重新設定密碼：</p><a href="http://localhost:3000/users/change_password/${token}">重設密碼連結</a><br/><br/><p>連結會在 3分鐘 後或重設密碼後失效</p>`
            });

            //resetExpiration是一個時間戳記，用來判斷token是否過期
            const now = new Date();//現在時間
            const valid = new Date(now.getTime() + 180000);//有效期為從現在的時間起3分鐘後
            // 把有效期存成 resetExpiration 格式為 YYYY-MM-DD HH:mm:ss，再存到資料庫
            const resetExpiration = valid.toISOString().slice(0, 19).replace('T', ' ');

            //處理utc時區問題
            // 將 UTC 時間轉換為 UTC+8 時區的時間   
            const resetExpirationToUTC8 = new Date(resetExpiration + 'Z');
            // 轉換為 UTC+8 時區的時間
            resetExpirationToUTC8.setHours(resetExpirationToUTC8.getHours());

            await db.query('UPDATE members SET resetToken = ?, resetExpiration = ? WHERE member_id = ?', [token, resetExpirationToUTC8, user[0].member_id])

            res.json({ message: '申請成功！請確認電子郵件' });
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ message: '伺服器內部錯誤' });
        }
    },

    // 處理驗證resetToken是否過期
    verifyResetToken: async (req, res) => {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        try {
            const [user] = await db.query('SELECT * FROM members WHERE resetToken = ?', [token]);

            if (!user || user.length === 0) {
                return res.status(400).json({ message: '重置連結已過期，請重新申請' });
            }
            //現在的時間
            const resetExpiration = new Date(user[0].resetExpiration);
            const currentTime = new Date();
            //如果resetExpiration小於現在時間戳記，代表token已過期
            if (resetExpiration < currentTime) {
                await db.query('UPDATE members SET resetToken = NULL, resetExpiration = NULL WHERE member_id = ?', [user[0].member_id]);
                return res.status(400).json({ message: '重置連結已過期，請重新申請' });
            }

            res.json({ message: '重置連結有效，請繼續' });
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ message: '伺服器內部錯誤' });
        }
    },

    // 處理會員重設密碼的function
    changePassword: async (req, res) => {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token 和新密碼是必填的' });
        }

        try {
            const [user] = await db.query('SELECT * FROM members WHERE resetToken = ?', [token]);

            if (!user || user.length === 0) {
                return res.status(400).json({ message: '無效的或已過期的重置連結' });
            }
            //現在的時間
            const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            //如果resetExpiration小於現在時間戳記，代表token已過期，並清除resetToken與resetExpiration
            if (user[0].resetExpiration < currentTime) {
                await db.query('UPDATE members SET resetToken = NULL, resetExpiration = NULL WHERE member_id = ?', [user[0].member_id]);
                return res.status(400).json({ message: '重置連結已過期，請重新申請重置密碼' });
            }
            //使用bcrypt重新產生密碼，並更新密碼存到資料庫
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await db.query('UPDATE members SET member_password = ?, resetToken = NULL, resetExpiration = NULL WHERE member_id = ?', [hashedPassword, user[0].member_id]);

            res.json({ message: '密碼已成功重置' });
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ message: '伺服器內部錯誤' });
        }
    },

    //處理會員在登入頁面時檢查輸入的email是否存在於資料庫當中
    cheakEmail: async (req, res) => {
        const { email } = req.body; // 從 body 中獲取 email
        if (!email) {
            return res.status(400).json({ error: '必須填入email' });
        }
        try {
            const [rows] = await db.query('SELECT * FROM members WHERE member_email = ?', [email]);
            res.json({ exists: rows.length > 0 });
        } catch (error) {
            console.error('Error checking email:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    //處理會員個人資料頁的訂單
    myOrders: async (req, res) => {
        const { userId } = req.params;
        try {
            const [orders] = await db.query(`SELECT 
                po.Productorders_orders_id,
                po.ProductOrders_m_id_fk,
                po.ProductOrders_orders_date,
                po.ProductOrders_recipient_name,
                od.OrdersDetail_id,
                od.OrdersDetail_product_quantity,
                od.OrdersDetail_unit_price_at_time,
                po.orderDetail_number,
                p.Product_id,
                p.Product_name,
                p.Product_photo
            FROM 
                ProductOrders po
            JOIN 
                OrdersDetail od ON po.Productorders_orders_id = od.OrdersDetail_order_id_fk
            JOIN 
                Products p ON od.OrdersDetail_product_id_fk = p.Product_id 
            WHERE 
                po.ProductOrders_m_id_fk = ?
            ORDER BY 
                po.Productorders_orders_id DESC`,
                [userId]);

            // 將訂單按 orderDetail_number 分組
            const groupedOrders = orders.reduce((acc, order) => {
                if (!acc[order.orderDetail_number]) {
                    // 把資料庫中ProductOrders_orders_date只取出年月日
                    const orderDate = new Date(order.ProductOrders_orders_date);
                    const myOrderDate = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;

                    acc[order.orderDetail_number] = {
                        orderDetail_number: order.orderDetail_number,
                        orderDate: myOrderDate, // 被取出的只有年月日的下單時間
                        items: [],
                        totalQuantity: 0,
                        totalPrice: 0
                    };
                }

                // 只保留第一張商品圖片
                const firstPhoto = order.Product_photo.split(',')[0];

                acc[order.orderDetail_number].items.push({
                    id: order.OrdersDetail_id,
                    imgSrc: firstPhoto,
                    name: order.Product_name,
                    quantity: order.OrdersDetail_product_quantity,
                    price: order.OrdersDetail_unit_price_at_time
                });

                acc[order.orderDetail_number].totalQuantity += order.OrdersDetail_product_quantity;
                acc[order.orderDetail_number].totalPrice += order.OrdersDetail_product_quantity * order.OrdersDetail_unit_price_at_time;

                return acc;
            }, {});

            const processedOrders = Object.values(groupedOrders);

            res.json({ success: true, orders: processedOrders });
        } catch (error) {
            console.error('獲取會員訂單時發生錯誤:', error);
            res.status(500).json({ success: false, message: '資料庫錯誤' });
        }
    },
    //處理會員個人資料頁的場館預約
    myReservations: async (req, res) => {
        const userId = req.params.userId;
        try {
            const sql = `
      SELECT
          group_concat(gi.image_filename) as gymimg,
          gr.reserve_time,
          g.gym_name
      FROM
          GymReservations gr
      JOIN
          Gyms g ON gr.gym_id = g.gym_id
      JOIN
          GymImages gi ON g.gym_id = gi.gym_id
      WHERE
          gr.member_id = ?
	GROUP BY gr.reserve_time, g.gym_name
      ORDER BY
          gr.reserve_time`;

            const [rows] = await db.query(sql, [userId]);
            for (let i of rows ){
                let fistgym =i.gymimg.split(',')[0];
                i.gymimg=fistgym;
                console.log(fistgym);
            }
            // console.log(sql)
            res.json({ success: true, reservations: rows });
        } catch (error) {
            console.error("取得會員場館預約時發生錯誤:", error);
            res.status(500).json({ success: false, message: "資料庫錯誤" });
        }
    },


};

export default userController;