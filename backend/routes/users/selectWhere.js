import express from "express";
import db from "../../utils/connect-mysql.js";

const router = express.Router();
// const connection = db.createConnection();

// 取的commonType資料 縣市
router.get('/city', async (req, res) => {
    try {
        const [results] = await db.query('SELECT code_id, code_desc FROM CommonType WHERE code_type = 1');
        res.json(results);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).send('Server error');
    }
});
// 取的commonType資料 行政區
router.get('/district/:cityId', async (req, res) => {
    const cityId = req.params.cityId;
    try {
        const [results] = await db.query('SELECT code_id, code_desc FROM CommonType WHERE code_type = 2 AND code_remark = ?', [cityId]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching districts:', error);
        res.status(500).send('Server error');
    }
});


export default router;