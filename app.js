let db, stage = 0;

const stages = [
  {
    mission: "مرحله 1: تعداد کل سفارش‌ها را از جدول orders پیدا کن.",
    answerCheck: (rows) => rows[0].values[0] == 6
  },
  {
    mission: "مرحله 2: مشتریانی که بیش از ۳ سفارش داشته‌اند را نمایش بده.",
    answerCheck: (rows) => rows.length === 1 && rows[0].values[0] == 1
  },
  {
    mission: "مرحله 3: محصولی را بیاب که بیشترین فروش را داشته است.",
    answerCheck: (rows) => rows.length === 1 && rows[0].values[0] == 2
  }
];

const dbInitSql = `
CREATE TABLE orders (id INTEGER, customer_id INTEGER);
INSERT INTO orders VALUES (1, 1), (2, 2), (3, 1), (4, 3), (5, 1), (6, 1);

CREATE TABLE order_items (id INTEGER, order_id INTEGER, product_id INTEGER);
INSERT INTO order_items VALUES
(1,1,1), (2,2,2), (3,3,2), (4,4,3), (5,5,2), (6,6,2);
`;

function showStage() {
  document.getElementById("stage-number").textContent = stage + 1;
  document.getElementById("mission-text").textContent = stages[stage].mission;
  document.getElementById("feedback").textContent = "";
  document.getElementById("sql-input").value = "";
}

initSqlJs({ locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}` }).then(SQL => {
  db = new SQL.Database();
  db.run(dbInitSql);
  showStage();
});

document.getElementById("run-btn").addEventListener("click", () => {
  const code = document.getElementById("sql-input").value;
  try {
    const res = db.exec(code);
    document.getElementById("result").textContent = JSON.stringify(res[0], null, 2);
    if (stages[stage].answerCheck(res)) {
      document.getElementById("feedback").textContent = "✅ درست بود! می‌ری به مرحله بعدی...";
      stage++;
      if (stage < stages.length) setTimeout(showStage, 1500);
      else document.getElementById("feedback").textContent += " 🎉 تبریک! بازی تموم شد.";
    } else {
      document.getElementById("feedback").textContent = "❌ خروجی اشتباهه. دوباره امتحان کن.";
    }
  } catch (e) {
    document.getElementById("result").textContent = e.message;
    document.getElementById("feedback").textContent = "⛔ خطا در اجرای کوئری.";
  }
});
