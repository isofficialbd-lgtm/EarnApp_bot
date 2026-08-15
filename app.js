// =====================================================
// TELEGRAM MINI APP
// COMPLETE TASK + REWARD + REFERRAL + WITHDRAW SYSTEM
// =====================================================

const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const user = tg?.initDataUnsafe?.user || {};


// =====================================================
// SETTINGS
// =====================================================

const MIN_WITHDRAW = 100;
const REQUIRED_REFERRALS = 15;


// =====================================================
// TASK LIST
// =====================================================

const TASKS = [

  {
    id: "ad_1",
    type: "ad",
    title: "Ad Task 1",
    description: "Ad খুলে কিছুক্ষণ দেখুন।",
    reward: 20,
    url: "https://disturbknockedcaterpillar.com/s9usjceyn9?key=2db1a989202572aeb944d7cf996d94a3"
  },

  {
    id: "ad_2",
    type: "ad",
    title: "Ad Task 2",
    description: "Ad খুলে কিছুক্ষণ দেখুন।",
    reward: 20,
    url: "https://disturbknockedcaterpillar.com/qfme9v7p?key=edfb6770abc53de1b56dca94b91dddc2"
  },

  {
    id: "ad_3",
    type: "ad",
    title: "Ad Task 3",
    description: "Ad খুলে কিছুক্ষণ দেখুন।",
    reward: 20,
    url: "https://disturbknockedcaterpillar.com/sp0ec1ycks?key=4d089fbae56772209635d0cd7f534658"
  },

  {
    id: "youtube_channel",
    type: "channel",
    title: "YouTube Channel Subscribe",
    description: "আমাদের YouTube Channel Subscribe করুন।",
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


// =====================================================
// ELEMENTS
// =====================================================

const nameEl = document.getElementById("name");
const avatarEl = document.getElementById("avatar");
const balanceEl = document.getElementById("balance");
const contentEl = document.getElementById("content");


// =====================================================
// USER
// =====================================================

if (nameEl) {
  nameEl.textContent = user.first_name || "বন্ধু";
}

if (avatarEl) {
  avatarEl.textContent =
    (user.first_name || "U").charAt(0).toUpperCase();
}


// =====================================================
// LOCAL DATA
// =====================================================

function getBalance() {

  return Number(
    localStorage.getItem("earn_balance") || "0"
  );

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


// =====================================================
// BALANCE DISPLAY
// =====================================================

function refresh() {

  if (balanceEl) {

    balanceEl.textContent =
      getBalance().toFixed(2);

  }

}


// =====================================================
// HOME
// =====================================================

function home() {

  contentEl.innerHTML = `

    <h2>🏠 Home</h2>

    <p>
      স্বাগতম,
      <b>${escapeHTML(user.first_name || "বন্ধু")}</b> ❤️
    </p>

    <div class="task">

      <p>💰 আপনার Balance</p>

      <h2>৳${getBalance().toFixed(2)}</h2>

    </div>

    <div class="task">

      <p>👥 Referral</p>

      <b>
        ${getReferralCount()} / ${REQUIRED_REFERRALS}
      </b>

      <p>
        Withdraw করতে ১৫টি valid referral প্রয়োজন।
      </p>

    </div>

  `;

  refresh();

}


// =====================================================
// TASK PAGE
// =====================================================

function loadTasks() {

  const completed =
    getCompletedTasks();

  contentEl.innerHTML = `

    <h2>📋 Tasks</h2>

    <p>
      Task সম্পন্ন করে Reward নিন 💰
    </p>

    ${TASKS.map(task => {

      const done =
        completed.includes(task.id);

      return `

        <div class="task">

          <h3>
            ${getTaskIcon(task.type)}
            ${escapeHTML(task.title)}
          </h3>

          <p>
            ${escapeHTML(task.description)}
          </p>

          <p>
            💰 Reward:
            <b>৳${task.reward}</b>
          </p>

          ${
            done

            ?

            `
              <button
                class="primary"
                disabled
                style="opacity:.55"
              >
                ✅ Completed
              </button>
            `

            :

            `
              <button
                class="primary"
                onclick="startTask('${task.id}')"
              >
                🔗 Start Task
              </button>
            `
          }

        </div>

      `;

    }).join("")}

  `;

}


// =====================================================
// TASK ICON
// =====================================================

function getTaskIcon(type) {

  if (type === "ad") return "📢";

  if (type === "channel") return "📺";

  if (type === "video") return "🎬";

  return "📋";

}


// =====================================================
// START TASK
// =====================================================

function startTask(id) {

  const task =
    TASKS.find(t => t.id === id);

  if (!task) return;

  const completed =
    getCompletedTasks();

  if (completed.includes(id)) {

    alert("এই Task ইতিমধ্যে Complete করা হয়েছে।");

    return;

  }


  // Open task
  window.open(
    task.url,
    "_blank",
    "noopener,noreferrer"
  );


  // Give user time to complete task
  setTimeout(() => {

    const confirmTask =
      confirm(
        `আপনি কি "${task.title}" সম্পন্ন করেছেন?\n\nOK চাপলে ৳${task.reward} Reward যোগ হবে।`
      );

    if (!confirmTask) return;


    completed.push(task.id);

    saveCompletedTasks(completed);


    const newBalance =
      getBalance() + Number(task.reward);

    setBalance(newBalance);

    refresh();

    alert(
      `🎉 Task Complete!\n\n৳${task.reward} Reward যোগ হয়েছে।`
    );

    loadTasks();

  }, 15000);

}


// =====================================================
// REFERRAL
// =====================================================

function showReferral() {

  const referralCode =
    user.id || "demo";

  const link =
    location.origin +
    "/?ref=" +
    referralCode;

  contentEl.innerHTML = `

    <h2>🎁 Referral</h2>

    <div class="task">

      <p>
        বন্ধু Invite করুন এবং প্রতি valid referral-এ
        <b>৳20</b> পান।
      </p>

      <p>
        👥 আপনার Referral:
        <b>
          ${getReferralCount()} / ${REQUIRED_REFERRALS}
        </b>
      </p>

      <input
        id="refLink"
        class="input"
        readonly
        value="${escapeAttribute(link)}"
      >

      <button
        class="primary"
        onclick="copyReferral()"
      >
        📋 Copy Referral Link
      </button>

    </div>

  `;

}


// =====================================================
// COPY REFERRAL
// =====================================================

function copyReferral() {

  const input =
    document.getElementById("refLink");

  if (!input) return;

  navigator.clipboard
    .writeText(input.value)
    .then(() => {

      alert(
        "✅ Referral link copied!"
      );

    })
    .catch(() => {

      input.select();

      document.execCommand("copy");

      alert(
        "✅ Referral link copied!"
      );

    });

}


// =====================================================
// PROFILE
// =====================================================

function showProfile() {

  contentEl.innerHTML = `

    <h2>👤 Profile</h2>

    <div class="task">

      <p>
        Name:
        <b>
          ${escapeHTML(
            user.first_name || "Demo"
          )}
        </b>
      </p>

      <p>
        Telegram ID:
        <b>
          ${user.id || "Demo"}
        </b>
      </p>

      <p>
        💰 Balance:
        <b>
          ৳${getBalance().toFixed(2)}
        </b>
      </p>

      <p>
        👥 Referral:
        <b>
          ${getReferralCount()}
        </b>
      </p>

    </div>

  `;

}


// =====================================================
// WITHDRAW
// =====================================================

function showWithdraw() {

  const balance =
    getBalance();

  const referrals =
    getReferralCount();


  // Referral gate
  if (referrals < REQUIRED_REFERRALS) {

    contentEl.innerHTML = `

      <h2>💸 Withdraw</h2>

      <div class="task">

        <h3>🔒 Withdraw Locked</h3>

        <p>
          টাকা তুলতে হলে আগে
          <b>${REQUIRED_REFERRALS}টি Referral</b>
          সম্পূর্ণ করতে হবে।
        </p>

        <p>
          আপনার Referral:
          <b>
            ${referrals} / ${REQUIRED_REFERRALS}
          </b>
        </p>

        <p>
          আরও
          <b>
            ${REQUIRED_REFERRALS - referrals}
          </b>
         টি Referral প্রয়োজন।
        </p>

        <button
          class="primary"
          onclick="showReferral()"
        >
          🎁 Referral করুন
        </button>

      </div>

    `;

    return;

  }


  // Minimum balance gate
  if (balance < MIN_WITHDRAW) {

    contentEl.innerHTML = `

      <h2>💸 Withdraw</h2>

      <div class="task">

        <h3>🔒 Minimum Balance প্রয়োজন</h3>

        <p>
          Minimum Withdraw:
          <b>৳${MIN_WITHDRAW}</b>
        </p>

        <p>
          আপনার Balance:
          <b>৳${balance.toFixed(2)}</b>
        </p>

        <p>
          আরও
          <b>
            ৳${(MIN_WITHDRAW - balance).toFixed(2)}
          </b>
          প্রয়োজন।
        </p>

      </div>

    `;

    return;

  }


  // Withdraw form
  contentEl.innerHTML = `

    <h2>💸 Withdraw</h2>

    <div class="task">

      <p>
        Available Balance:
        <b>
          ৳${balance.toFixed(2)}
        </b>
      </p>

      <input
        id="amount"
        class="input"
        type="number"
        min="${MIN_WITHDRAW}"
        max="${balance}"
        placeholder="Withdraw Amount"
      >

      <input
        id="phone"
        class="input"
        type="tel"
        placeholder="bKash / Nagad Number"
      >

      <button
        class="primary"
        onclick="submitWithdraw()"
      >
        💸 Withdraw Request
      </button>

    </div>

  `;

}


// =====================================================
// SUBMIT WITHDRAW
// =====================================================

function submitWithdraw() {

  const amount =
    Number(
      document.getElementById("amount")?.value || 0
    );

  const phone =
    document.getElementById("phone")?.value.trim() || "";

  const balance =
    getBalance();


  if (amount < MIN_WITHDRAW) {

    alert(
      `Minimum Withdraw ৳${MIN_WITHDRAW}`
    );

    return;

  }


  if (amount > balance) {

    alert(
      "আপনার Balance-এর চেয়ে বেশি টাকা তুলতে পারবেন না।"
    );

    return;

  }


  if (!phone) {

    alert(
      "bKash / Nagad নম্বর দিন।"
    );

    return;

  }


  alert(
    "✅ Withdraw Request নেওয়া হয়েছে।\n\n" +
    "নোট: এখনো কোনো server/admin system-এ request পাঠানো হচ্ছে না।"
  );

}


// =====================================================
// ESCAPE
// =====================================================

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}

function escapeAttribute(value) {

  return escapeHTML(value);

}


// =====================================================
// START
// =====================================================

refresh();
