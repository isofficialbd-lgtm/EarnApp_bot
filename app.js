const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const user = tg?.initDataUnsafe?.user || {};

const MIN_WITHDRAW = 100;
const REQUIRED_REFERRALS = 15;

const TASKS = [
  {
    id: "ad_1",
    type: "ad",
    title: "Ad Task 1",
    description: "Ad খুলে দেখুন।",
    reward: 20,
    url: "https://disturbknockedcaterpillar.com/s9usjceyn9?key=2db1a989202572aeb944d7cf996d94a3"
  },
  {
    id: "ad_2",
    type: "ad",
    title: "Ad Task 2",
    description: "Ad খুলে দেখুন।",
    reward: 20,
    url: "https://disturbknockedcaterpillar.com/qfme9v7p?key=edfb6770abc53de1b56dca94b91dddc2"
  },
  {
    id: "ad_3",
    type: "ad",
    title: "Ad Task 3",
    description: "Ad খুলে দেখুন।",
    reward: 20,
    url: "https://disturbknockedcaterpillar.com/sp0ec1ycks?key=4d089fbae56772209635d0cd7f534658"
  },
  {
    id: "youtube_channel",
    type: "channel",
    title: "YouTube Channel Subscribe",
    description: "YouTube Channel Subscribe করুন।",
    reward: 50,
    url: "https://youtube.com/@isofficialbd?si=HLIH5G2k5Xudcx5n"
  },
  {
    id: "youtube_video_1",
    type: "video",
    title: "YouTube Video Task 1",
    description: "ভিডিও দেখুন, Like ও Comment করুন।",
    reward: 20,
    url: "https://youtu.be/BtQTtf4fmz8?si=sgjeD8a6jg2CadVn"
  },
  {
    id: "youtube_video_2",
    type: "video",
    title: "YouTube Video Task 2",
    description: "ভিডিও দেখুন, Like ও Comment করুন।",
    reward: 20,
    url: "https://youtu.be/fdDt7Vp_nZ0?si=2ehsIn-KrZNXRY23"
  }
];

const nameEl = document.getElementById("name");
const avatarEl = document.getElementById("avatar");
const balanceEl = document.getElementById("balance");
const contentEl = document.getElementById("content");

if (nameEl) {
  nameEl.textContent = user.first_name || "বন্ধু";
}

if (avatarEl) {
  avatarEl.textContent =
    (user.first_name || "U").charAt(0).toUpperCase();
}

function getBalance() {
  return Number(localStorage.getItem("earn_balance") || "0");
}

function setBalance(value) {
  localStorage.setItem(
    "earn_balance",
    Number(value).toFixed(2)
  );
}

function getCompletedTasks() {
  try {
    return JSON.parse(
      localStorage.getItem("completed_tasks") || "[]"
    );
  } catch {
    return [];
  }
}

function saveCompletedTasks(tasks) {
  localStorage.setItem(
    "completed_tasks",
    JSON.stringify(tasks)
  );
}

function getReferralCount() {
  return Number(
    localStorage.getItem("referral_count") || "0"
  );
}

function refresh() {
  if (balanceEl) {
    balanceEl.textContent =
      getBalance().toFixed(2);
  }
}

function home() {
  contentEl.innerHTML = `
    <h2>🏠 Home</h2>
    <p>স্বাগতম, <b>${user.first_name || "বন্ধু"}</b> ❤️</p>

    <div class="info">
      💰 Balance:
      <b>৳${getBalance().toFixed(2)}</b>
    </div>

    <div class="info">
      👥 Referral:
      <b>${getReferralCount()} / ${REQUIRED_REFERRALS}</b>
    </div>
  `;

  refresh();
}

function loadTasks() {

  const completed = getCompletedTasks();

  contentEl.innerHTML = `
    <h2>📋 Tasks</h2>
    <p>Task সম্পূর্ণ করে Reward নিন 💰</p>

    ${TASKS.map(task => {

      const done = completed.includes(task.id);

      return `
        <div class="task">

          <h3>
            ${task.type === "ad" ? "📢" :
              task.type === "channel" ? "📺" : "🎬"}
            ${task.title}
          </h3>

          <p>${task.description}</p>

          <p>
            💰 Reward:
            <b>৳${task.reward}</b>
          </p>

          ${
            done
            ? `
              <button class="primary" disabled>
                ✅ Completed
              </button>
            `
            : `
              <button
                class="primary"
                type="button"
                onclick="startTask('${task.id}')">
                🔗 Start Task
              </button>
            `
          }

        </div>
      `;
    }).join("")}
  `;
}

function startTask(id) {

  const task = TASKS.find(
    item => item.id === id
  );

  if (!task) return;

  const completed = getCompletedTasks();

  if (completed.includes(id)) {
    alert("এই Task ইতিমধ্যে Complete করা হয়েছে।");
    return;
  }

  if (tg && tg.openLink) {
    tg.openLink(task.url);
  } else {
    window.open(task.url, "_blank");
  }

  setTimeout(() => {

    const ok = confirm(
      `"${task.title}" সম্পূর্ণ করেছেন?\n\nOK চাপলে ৳${task.reward} Reward যোগ হবে।`
    );

    if (!ok) return;

    const latest = getCompletedTasks();

    if (latest.includes(id)) return;

    latest.push(id);

    saveCompletedTasks(latest);

    setBalance(
      getBalance() + Number(task.reward)
    );

    refresh();

    alert(
      `🎉 Task Complete!\n৳${task.reward} Reward যোগ হয়েছে।`
    );

    loadTasks();

  }, 15000);
}

function showReferral() {

  const code = user.id || "demo";

  const link =
    location.origin + "/?ref=" + code;

  contentEl.innerHTML = `
    <h2>🎁 Referral</h2>

    <div class="task">

      <p>
        বন্ধু Invite করুন এবং প্রতি valid referral-এ
        <b>৳20</b> পান।
      </p>

      <p>
        👥 Referral:
        <b>${getReferralCount()} / ${REQUIRED_REFERRALS}</b>
      </p>

      <input
        id="refLink"
        class="input"
        readonly
        value="${link}"
      >

      <button
        class="primary"
        type="button"
        onclick="copyReferral()">
        📋 Copy Referral Link
      </button>

    </div>
  `;
}

function copyReferral() {

  const input =
    document.getElementById("refLink");

  if (!input) return;

  input.select();

  navigator.clipboard?.writeText(input.value)
    .then(() => alert("✅ Referral link copied!"))
    .catch(() => {
      document.execCommand("copy");
      alert("✅ Referral link copied!");
    });
}

function showProfile() {

  contentEl.innerHTML = `
    <h2>👤 Profile</h2>

    <div class="task">

      <p>
        Name:
        <b>${user.first_name || "বন্ধু"}</b>
      </p>

      <p>
        Telegram ID:
        <b>${user.id || "Demo"}</b>
      </p>

      <p>
        💰 Balance:
        <b>৳${getBalance().toFixed(2)}</b>
      </p>

      <p>
        👥 Referral:
        <b>${getReferralCount()}</b>
      </p>

    </div>
  `;
}

function showWithdraw() {

  const balance = getBalance();
  const referrals = getReferralCount();

  if (referrals < REQUIRED_REFERRALS) {

    contentEl.innerHTML = `
      <h2>💸 Withdraw</h2>

      <div class="task">

        <h3>🔒 Withdraw Locked</h3>

        <p>
          টাকা তুলতে আগে
          <b>১৫টি Referral</b>
          সম্পূর্ণ করতে হবে।
        </p>

        <p>
          Referral:
          <b>${referrals} / ${REQUIRED_REFERRALS}</b>
        </p>

        <p>
          আরও
          <b>${REQUIRED_REFERRALS - referrals}</b>
          টি Referral প্রয়োজন।
        </p>

        <button
          class="primary"
          type="button"
          onclick="showReferral()">
          🎁 Referral করুন
        </button>

      </div>
    `;

    return;
  }

  if (balance < MIN_WITHDRAW) {

    contentEl.innerHTML = `
      <h2>💸 Withdraw</h2>

      <div class="task">

        <h3>🔒 Minimum Balance প্রয়োজন</h3>

        <p>
          Minimum Withdraw:
          <b>৳100</b>
        </p>

        <p>
          আপনার Balance:
          <b>৳${balance.toFixed(2)}</b>
        </p>

      </div>
    `;

    return;
  }

  contentEl.innerHTML = `
    <h2>💸 Withdraw</h2>

    <div class="task">

      <p>
        Available Balance:
        <b>৳${balance.toFixed(2)}</b>
      </p>

      <input
        id="amount"
        class="input"
        type="number"
        min="100"
        max="${balance}"
        placeholder="Withdraw Amount">

      <input
        id="phone"
        class="input"
        type="tel"
        placeholder="bKash / Nagad Number">

      <button
        class="primary"
        type="button"
        onclick="submitWithdraw()">
        💸 Withdraw Request
      </button>

    </div>
  `;
}

function submitWithdraw() {

  const amount =
    Number(
      document.getElementById("amount")?.value || 0
    );

  const phone =
    document.getElementById("phone")?.value.trim() || "";

  if (amount < MIN_WITHDRAW) {
    alert("Minimum Withdraw ৳100");
    return;
  }

  if (amount > getBalance()) {
    alert("Balance-এর চেয়ে বেশি টাকা তুলতে পারবেন না।");
    return;
  }

  if (!phone) {
    alert("bKash / Nagad নম্বর দিন।");
    return;
  }

  alert(
    "Withdraw request নেওয়া হয়েছে।\n\n" +
    "⚠️ এটি এখনো Demo request; real payment server যুক্ত হয়নি।"
  );
}

refresh();
