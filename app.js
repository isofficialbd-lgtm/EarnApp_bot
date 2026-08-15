// =====================================================
// EARN MINI APP - SUPABASE VERSION
// Telegram User + Balance + Tasks + Referral + Withdraw
// =====================================================

const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const telegramUser = tg?.initDataUnsafe?.user || {};


// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
  "https://nfqvstrmpyqwiemctkna.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_FG3q1xCt_cpvcGoDav1vXQ_2wZLMtjC";

let db = null;
let currentUser = null;


// =====================================================
// SETTINGS
// =====================================================

const MIN_WITHDRAW = 100;
const REQUIRED_REFERRALS = 15;


// =====================================================
// TASKS
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
// SUPABASE LOAD
// =====================================================

async function initSupabase() {

  try {

    const module =
      await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
      );

    db =
      module.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

    await loadUser();

  } catch (error) {

    console.error(error);

    alert(
      "Supabase connection failed."
    );

  }

}


// =====================================================
// USER
// =====================================================

async function loadUser() {

  if (!telegramUser.id) {

    currentUser = {
      telegram_id: 0,
      first_name: "Demo",
      balance: 0,
      referral_count: 0
    };

    updateHeader();

    home();

    return;

  }


  try {

    const { data, error } =
      await db.rpc(
        "get_or_create_user",
        {
          p_telegram_id:
            telegramUser.id,
          p_first_name:
            telegramUser.first_name || "বন্ধু"
        }
      );


    if (error) {

      console.error(error);

      alert(
        "User database error: " +
        error.message
      );

      return;

    }


    currentUser =
      Array.isArray(data)
        ? data[0]
        : data;


    updateHeader();

    home();

  } catch (error) {

    console.error(error);

  }

}


// =====================================================
// HEADER
// =====================================================

function updateHeader() {

  if (!currentUser) return;


  if (nameEl) {

    nameEl.textContent =
      currentUser.first_name ||
      telegramUser.first_name ||
      "বন্ধু";

  }


  if (avatarEl) {

    avatarEl.textContent =
      (
        currentUser.first_name ||
        telegramUser.first_name ||
        "U"
      )
        .charAt(0)
        .toUpperCase();

  }


  refresh();

}


// =====================================================
// BALANCE
// =====================================================

function getBalance() {

  return Number(
    currentUser?.balance || 0
  );

}


function getReferralCount() {

  return Number(
    currentUser?.referral_count || 0
  );

}


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

  if (!contentEl) return;


  contentEl.innerHTML = `

    <h2>🏠 Home</h2>

    <p>
      স্বাগতম,
      <b>
        ${escapeHTML(
          currentUser?.first_name ||
          telegramUser.first_name ||
          "বন্ধু"
        )}
      </b>
      ❤️
    </p>


    <div class="task">

      <p>💰 আপনার Balance</p>

      <h2>
        ৳${getBalance().toFixed(2)}
      </h2>

    </div>


    <div class="task">

      <p>👥 Referral</p>

      <b>
        ${getReferralCount()}
        /
        ${REQUIRED_REFERRALS}
      </b>

      <p>
        Withdraw করতে
        ${REQUIRED_REFERRALS}
        টি valid referral প্রয়োজন।
      </p>

    </div>

  `;

  refresh();

}


// =====================================================
// TASK PAGE
// =====================================================

async function loadTasks() {

  if (!contentEl) return;


  let completed = [];


  try {

    const { data, error } =
      await db.rpc(
        "get_completed_tasks",
        {
          p_telegram_id:
            telegramUser.id
        }
      );


    if (!error && data) {

      completed =
        data.map(
          x =>
            x.task_id ||
            x
        );

    }

  } catch (error) {

    console.error(error);

  }


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
            <b>
              ৳${task.reward}
            </b>
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

  if (type === "ad")
    return "📢";

  if (type === "channel")
    return "📺";

  if (type === "video")
    return "🎬";

  return "📋";

}


// =====================================================
// START TASK
// =====================================================

async function startTask(id) {

  const task =
    TASKS.find(
      t => t.id === id
    );

  if (!task) return;


  // Open task
  if (tg) {

    tg.openLink(task.url);

  } else {

    window.open(
      task.url,
      "_blank"
    );

  }


  // Wait
  setTimeout(async () => {

    const confirmTask =
      confirm(
        `আপনি কি "${task.title}" সম্পন্ন করেছেন?\n\nOK চাপলে ৳${task.reward} Reward যোগ হবে।`
      );


    if (!confirmTask)
      return;


    try {

      const { data, error } =
        await db.rpc(
          "complete_task",
          {
            p_telegram_id:
              telegramUser.id,
            p_task_id:
              task.id,
            p_reward:
              task.reward
          }
        );


      if (error) {

        console.error(error);

        alert(
          "Task complete হয়নি:\n" +
          error.message
        );

        return;

      }


      if (data === false) {

        alert(
          "এই Task ইতিমধ্যে Complete করা হয়েছে।"
        );

        return;

      }


      await loadUser();

      alert(
        `🎉 Task Complete!\n\n৳${task.reward} Reward যোগ হয়েছে।`
      );

      loadTasks();

    } catch (error) {

      console.error(error);

      alert(
        "Server error হয়েছে।"
      );

    }

  }, 15000);

}


// =====================================================
// REFERRAL
// =====================================================

function showReferral() {

  const telegramId =
    telegramUser.id || "demo";


  // Telegram Mini App referral format
  const botUsername =
    "isofficialbd_bot";


  const link =
    `https://t.me/${botUsername}?startapp=ref_${telegramId}`;


  contentEl.innerHTML = `

    <h2>🎁 Referral</h2>

    <div class="task">

      <p>
        বন্ধু Invite করুন।
      </p>

      <p>
        প্রতি valid referral-এ
        <b>৳20</b>
      </p>

      <p>
        👥 আপনার Referral:
        <b>
          ${getReferralCount()}
          /
          ${REQUIRED_REFERRALS}
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


      <button
        class="primary"
        onclick="shareReferral()"
      >
        📤 Share Referral
      </button>

    </div>

  `;

}


// =====================================================
// COPY REFERRAL
// =====================================================

async function copyReferral() {

  const input =
    document.getElementById(
      "refLink"
    );

  if (!input) return;


  try {

    await navigator.clipboard.writeText(
      input.value
    );

    alert(
      "✅ Referral link copied!"
    );

  } catch {

    input.select();

    document.execCommand(
      "copy"
    );

    alert(
      "✅ Referral link copied!"
    );

  }

}


// =====================================================
// SHARE REFERRAL
// =====================================================

function shareReferral() {

  const input =
    document.getElementById(
      "refLink"
    );

  if (!input) return;


  const text =
    "আমার Referral দিয়ে Earn App-এ Join করুন 👇";


  const url =
    input.value;


  if (tg) {

    tg.openTelegramLink(
      "https://t.me/share/url?url=" +
      encodeURIComponent(url) +
      "&text=" +
      encodeURIComponent(text)
    );

  } else {

    window.open(
      "https://t.me/share/url?url=" +
      encodeURIComponent(url) +
      "&text=" +
      encodeURIComponent(text),
      "_blank"
    );

  }

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
            currentUser?.first_name ||
            telegramUser.first_name ||
            "Demo"
          )}
        </b>
      </p>


      <p>
        Telegram ID:
        <b>
          ${telegramUser.id || "Demo"}
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


  if (referrals < REQUIRED_REFERRALS) {

    contentEl.innerHTML = `

      <h2>💸 Withdraw</h2>

      <div class="task">

        <h3>
          🔒 Withdraw Locked
        </h3>

        <p>
          টাকা তুলতে হলে আগে
          <b>
            ${REQUIRED_REFERRALS}টি Referral
          </b>
          সম্পূর্ণ করতে হবে।
        </p>

        <p>
          আপনার Referral:
          <b>
            ${referrals}
            /
            ${REQUIRED_REFERRALS}
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


  if (balance < MIN_WITHDRAW) {

    contentEl.innerHTML = `

      <h2>💸 Withdraw</h2>

      <div class="task">

        <h3>
          🔒 Minimum Balance প্রয়োজন
        </h3>

        <p>
          Minimum Withdraw:
          <b>
            ৳${MIN_WITHDRAW}
          </b>
        </p>

        <p>
          আপনার Balance:
          <b>
            ৳${balance.toFixed(2)}
          </b>
        </p>

        <p>
          আরও
          <b>
            ৳${(
              MIN_WITHDRAW -
              balance
            ).toFixed(2)}
          </b>
          প্রয়োজন।
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


      <select
        id="method"
        class="input"
      >
        <option value="bkash">
          bKash
        </option>

        <option value="nagad">
          Nagad
        </option>
      </select>


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

async function submitWithdraw() {

  const amount =
    Number(
      document.getElementById(
        "amount"
      )?.value || 0
    );


  const phone =
    document.getElementById(
      "phone"
    )?.value.trim() || "";


  const method =
    document.getElementById(
      "method"
    )?.value || "bkash";


  if (amount < MIN_WITHDRAW) {

    alert(
      `Minimum Withdraw ৳${MIN_WITHDRAW}`
    );

    return;

  }


  if (amount > getBalance()) {

    alert(
      "Balance-এর চেয়ে বেশি টাকা তুলতে পারবেন না।"
    );

    return;

  }


  if (!phone) {

    alert(
      "bKash / Nagad নম্বর দিন।"
    );

    return;

  }


  try {

    const { data, error } =
      await db.rpc(
        "submit_withdraw",
        {
          p_telegram_id:
            telegramUser.id,
          p_amount:
            amount,
          p_payment_number:
            phone,
          p_method:
            method
        }
      );


    if (error) {

      console.error(error);

      alert(
        "Withdraw request হয়নি:\n" +
        error.message
      );

      return;

    }


    if (data === false) {

      alert(
        "Withdraw request গ্রহণ করা যায়নি।"
      );

      return;

    }


    await loadUser();

    alert(
      "✅ Withdraw Request সফলভাবে পাঠানো হয়েছে!"
    );


    showWithdraw();

  } catch (error) {

    console.error(error);

    alert(
      "Server error হয়েছে।"
    );

  }

}


// =====================================================
// ESCAPE
// =====================================================

function escapeHTML(value) {

  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


function escapeAttribute(value) {

  return escapeHTML(value);

}


// =====================================================
// GLOBAL FUNCTIONS
// =====================================================

window.home =
  home;

window.loadTasks =
  loadTasks;

window.showReferral =
  showReferral;

window.copyReferral =
  copyReferral;

window.shareReferral =
  shareReferral;

window.showProfile =
  showProfile;

window.showWithdraw =
  showWithdraw;

window.startTask =
  startTask;

window.submitWithdraw =
  submitWithdraw;


// =====================================================
// START
// =====================================================

initSupabase();
