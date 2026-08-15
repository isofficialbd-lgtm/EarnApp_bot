const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const user = tg?.initDataUnsafe?.user || {};

// ===============================
// SUPABASE CONFIG
// ===============================
const SUPABASE_URL = "তোমার_SUPABASE_URL";
const SUPABASE_ANON_KEY = "তোমার_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===============================
// USER INFO
// ===============================
document.getElementById("name").textContent =
  user.first_name || "বন্ধু";

document.getElementById("avatar").textContent =
  (user.first_name || "U")[0];

// ===============================
// BALANCE
// ===============================
async function refresh() {
  if (!user.id) return;

  const { data, error } = await supabase
    .from("users")
    .select("balance")
    .eq("telegram_id", user.id)
    .single();

  if (!error && data) {
    document.getElementById("balance").textContent =
      Number(data.balance || 0).toFixed(2);
  }
}

// ===============================
// HOME
// ===============================
function home() {
  document.getElementById("content").innerHTML = `
    <h2>🏠 Home</h2>
    <p>Task complete করে balance বাড়বে।</p>
  `;

  refresh();
}

// ===============================
// LOAD TASKS FROM SUPABASE
// ===============================
async function loadTasks() {

  document.getElementById("content").innerHTML = `
    <h2>📋 Tasks</h2>
    <p>Task লোড হচ্ছে...</p>
  `;

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("active", true)
    .order("id", { ascending: false });

  if (error) {
    document.getElementById("content").innerHTML = `
      <h2>📋 Tasks</h2>
      <p>❌ Task লোড হয়নি</p>
      <small>${error.message}</small>
    `;
    return;
  }

  if (!tasks || tasks.length === 0) {
    document.getElementById("content").innerHTML = `
      <h2>📋 Tasks</h2>
      <p>এখন কোনো Task নেই।</p>
    `;
    return;
  }

  document.getElementById("content").innerHTML = `
    <h2>📋 Tasks</h2>

    ${tasks.map(t => `
      <div class="task">
        <b>${t.title || "Daily Task"}</b>

        <p>${t.description || t.text || ""}</p>

        <p>
          💰 Reward: ৳${Number(t.reward || 0).toFixed(2)}
        </p>

        ${
          t.url
            ? `<a href="${t.url}" target="_blank">
                 <button class="primary">🔗 Open Task</button>
               </a>`
            : ""
        }
      </div>
    `).join("")}
  `;
}

// ===============================
// REFERRAL
// ===============================
function showReferral() {

  const link =
    location.origin + "/?ref=" + (user.id || "demo");

  document.getElementById("content").innerHTML = `
    <h2>🎁 Referral</h2>
    <p>আপনার referral link:</p>

    <input
      class="input"
      readonly
      value="${link}"
    >

    <button
      class="primary"
      onclick="navigator.clipboard.writeText('${link}')"
    >
      Copy
    </button>
  `;
}

// ===============================
// PROFILE
// ===============================
function showProfile() {

  document.getElementById("content").innerHTML = `
    <h2>👤 Profile</h2>
    <p>Name: ${user.first_name || "Demo"}</p>
    <p>Telegram ID: ${user.id || "Demo"}</p>
  `;
}

// ===============================
// WITHDRAW
// ===============================
function showWithdraw() {

  document.getElementById("content").innerHTML = `
    <h2>💸 Withdraw</h2>

    <input
      id="amount"
      class="input"
      type="number"
      placeholder="Amount"
    >

    <input
      id="phone"
      class="input"
      placeholder="bKash/Nagad number"
    >

    <button
      class="primary"
      onclick="withdraw()"
    >
      Submit request
    </button>
  `;
}

// ===============================
// WITHDRAW REQUEST
// ===============================
async function withdraw() {

  alert("Withdraw system পরে connect করতে হবে।");
}

// ===============================
// START
// ===============================
refresh();
