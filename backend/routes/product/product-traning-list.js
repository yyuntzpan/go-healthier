import express from "express";
import db from "../../utils/connect-mysql.js";
import moment from "moment-timezone";

const router = express.Router();

const getListData = async (req) => {
  let success = false;
  let redirect = "";

  const perPage = 6; //每頁最多有幾筆

  let page = parseInt(req.query.page) || 1;
  if (page < 1) {
    redirect = "?page=1";
    return { success, redirect }; //res.redirect("?page=1"); //跳轉頁面。排除0以下的
  }
  let category = req.query.category || ""; //網頁的分類

  let subCategory = req.query.type || ""; //健身護具的分類

  let product_sql = " WHERE 1 ";
  if (category === "productTraningList") {
    product_sql += " AND CommonType.commontype_id = 50"; //居家訓練
  }
  if (category === "productFoodList") {
    product_sql += " AND CommonType.commontype_id = 53"; //健康食品
  }
  if (category === "productClothList") {
    product_sql += " AND CommonType.commontype_id = 51"; // 健身服飾
  }
  if (category === "productProtectList") {
    product_sql += " AND CommonType.commontype_id = 52"; //健身護具
  }
  if (subCategory === "") {
    //指的是radio button
  } else {
    // console.log(subCategory, "subcate");
    // console.log(req.query.type, "req.query.type");
    product_sql = " WHERE 1 ";
    if (subCategory === "knee") {
      product_sql += " AND CommonType.commontype_id = 54"; // 護膝
    }
    if (subCategory === "leg") {
      product_sql += " AND CommonType.commontype_id = 55"; // 護腿
    }
    if (subCategory === "ankle") {
      product_sql += " AND CommonType.commontype_id = 56"; // 護踝
    }
    if (subCategory === "waist") {
      product_sql += " AND CommonType.commontype_id = 57"; // 護腰
    }
  }

  let keyword = req.query.keyword || "";
  let where = " ";
  if (keyword) {
    // where = ` AND \`Product_name\` LIKE '%${keyword}%' `;
    where = ` AND \`Product_name\` LIKE ${db.escape(`%${keyword}%`)} `;
  }

  //健身護具分類
  // let type = req.query.type || "";

  // if (type === "knee") {
  //   where += "AND CommonType.commontype_id =54";
  // }
  // if (type === "leg") {
  //   where += "AND CommonType.commontype_id =55";
  // }
  // if (type === "ankle") {
  //   where += "AND CommonType.commontype_id =56";
  // }
  // if (type === "waist") {
  //   where += "AND CommonType.commontype_id =57";
  // }

  const t_sql = `SELECT COUNT(1) AS totalRows FROM products join CommonType on Products.Product_type_id_fk = CommonType.commontype_id ${product_sql}${where}`;
  const [[{ totalRows }]] = await db.query(t_sql);
  console.log(t_sql);

  let totalPages = 0; //總頁數，預設值
  let rows = []; //分頁資料
  if (totalRows) {
    success = true;
    totalPages = Math.ceil(totalRows / perPage);

    if (page > totalPages) {
      redirect = `?page=${totalPages}`;
      return { success, redirect };
    }
    //取得分頁資料;
    const sql = `select   
      Product_id,
      Product_name,
      Product_photo,
      Product_desc,
      Product_price,
       commontype.code_desc AS 'product_type'
		from Products 
      join CommonType
      on Products.Product_type_id_fk = commontype.commontype_id
       join CommonType as iCommonType 
      on Products.Suppliers_id_fk = iCommonType.commontype_id
        ${product_sql}${where} LIMIT 
       ${(page - 1) * perPage}, ${perPage}`;

    console.log(sql);

    [rows] = await db.query(sql, [(page - 1) * perPage, perPage]);
  }

  // res.json({ scccess, perPage, page, totalRows, rows });
  success = true;
  return {
    success,
    perPage, //每頁最多有幾筆
    page, //現在第幾頁
    totalRows, //總筆數
    totalPages, //總頁數
    rows, //分頁資料
    error: "finish query",
  };
};

router.get("/", async (req, res) => {
  const data = await getListData(req);
  if (data.redirect) {
    return res.redirect(data.redirect);
  }
  if (data.success) {
    // 這裡應該使用模板渲染，否則使用 JSON 渲染
    try {
      res.render("product/list", data); // 確保你已經配置了模板引擎，並有相應的模板
    } catch (error) {
      console.error("模板渲染錯誤:", error);
      res.json(data); // 在未配置模板引擎的情況下，先使用 JSON 返回數據
    }
  }
});

router.get("/api/:pid", async (req, res) => {
  let success = false;
  const product_id = +req.params.pid || 0;

  if (!product_id) {
    //這裡指的是db的product_id
    return res.redirect("/product");
  }
  // const data = await getListData(req);
  // if (data.redirect) {
  //   return res.redirect(data.redirect);
  // }

  const sql = `select   
      Product_id,
      Product_name,
      Product_photo,
      Product_desc,
      Product_price,
       commontype.code_desc AS 'product_type'
		from Products 
      join CommonType
      on Products.Product_type_id_fk = commontype.commontype_id
       join CommonType as iCommonType 
      on Products.Suppliers_id_fk = iCommonType.commontype_id
      WHERE Product_id = ${product_id}`;
  const [data] = await db.query(sql); //從db來的資料是個陣列(本來要從db來的資料是個陣列)陣列裡面有包陣列再包物件，故要拿到裡面的資料，要解構兩次，現在是第一次
  // console.log(data);
  let photodata = data[0]; //用這個方法怕data是很多物件陣列，故要指定第一個物件
  // let [photodata] = data; //多張照片處理，解構第二次，現在就是物件
  // 現在photodata是個物件
  photodata = photodata.Product_photo.split(",");
  success = true;
  if (data) {
    // 這裡應該使用模板渲染，否則使用 JSON 渲染
    return res.json({
      success,
      data,
      photodata, //傳回前端
    });

    // try {
    //   res.json(data); // 確保你已經配置了模板引擎，並有相應的模板
    // } catch (error) {
    //   console.error("模板渲染錯誤:", error);
    //   res.json(data); // 在未配置模板引擎的情況下，先使用 JSON 返回數據
    // }
  }
}); //商品細節

router.get("/api", async (req, res) => {
  try {
    const data = await getListData(req);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

//order訂單的api
router.post("/addorder", async (req, res) => {
  let { orderDetail, ...body } = req.body; //req.body 包含從客戶端發送過來的數據。這行代碼將 orderDetail 提取出來，並將剩餘的數據存入 body。orderDetail 是一個包含訂單詳細信息的 JSON 字符串，body 包含訂單的其他信息。
  console.log(JSON.parse(req.body.orderDetail));
  //插入 ProductOrders 表
  const sql = "INSERT INTO ProductOrders SET ?";
  //使用 INSERT INTO ProductOrders SET ? 語法插入 body 這個對象中的數據到 ProductOrders 表中。db.query 方法用於執行 SQL 查詢，並返回結果。result.insertId 是剛插入的訂單的 ID，後續將用於插入訂單詳情。
  const [result] = await db.query(sql, [body]);
  console.log(result);
  //獲取剛插入的訂單 ID
  const order_id = result.insertId;

  //sql2 是用於插入訂單詳情的 SQL 語句，? 佔位符將會被實際的數據取代。insersql 是將 orderDetail JSON 字符串解析為對象的結果，這樣可以逐條處理訂單詳情
  const sql2 =
    "INSERT INTO OrdersDetail SET OrdersDetail_product_id_fk = ?,OrdersDetail_product_quantity=?,OrdersDetail_order_id_fk=? ,OrdersDetail_unit_price_at_time=?";
  const insersql = JSON.parse(orderDetail);
  for (let i of insersql) {
    const [result2] = await db.query(sql2, [
      i.Product_id,
      i.qty,
      order_id,
      i.Product_price,
      i.orderDetail_number,
    ]);
  }
  console.log(result);
  console.log(orderDetail);
  res.json(order_id);
});

//orderDetail的api
router.get("/orderdetail", async (req, res) => {
  const sql = `SELECT 
    po.Productorders_orders_id,
    po.ProductOrders_m_id_fk,
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
    Products p ON od.OrdersDetail_product_id_fk = p.Product_id WHERE po.Productorders_orders_id = ${req.query.order_id};`;

  try {
    const [rows] = await db.query(sql);
    console.log(rows);
    rows.forEach((row) => {
      row.orderDetail_time = moment(row.orderDetail_time)
        .tz("Asia/Taipei")
        .format("YYYY-MM-DD");
    });

    res.json({
      orderDetail: rows, // 傳回前端
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
