const tg=window.Telegram?.WebApp;if(tg){tg.ready();tg.expand()}
const initData=tg?.initData||""; const user=tg?.initDataUnsafe?.user||{};
document.getElementById("name").textContent=user.first_name||"বন্ধু";
document.getElementById("avatar").textContent=(user.first_name||"U")[0];
const API="/api";
async function api(path,options={}){options.headers={"Content-Type":"application/json",...(options.headers||{})};if(initData)options.headers["X-Telegram-Init-Data"]=initData;const r=await fetch(API+path,options);return r.json()}
async function refresh(){const x=await api("/me");if(x.ok)document.getElementById("balance").textContent=Number(x.user.balance).toFixed(2)}
function home(){document.getElementById("content").innerHTML="<h2>🏠 Home</h2><p>Task complete করে balance বাড়বে।</p>";refresh()}
async function loadTasks(){const x=await api("/tasks");document.getElementById("content").innerHTML="<h2>📋 Tasks</h2>"+(x.tasks||[]).map(t=>`<div class="task"><b>${t.title}</b><p>Reward: ৳${t.reward}</p><button class="primary" onclick="completeTask('${t.id}')">Complete</button></div>`).join("")}
async function completeTask(id){const x=await api("/tasks/"+id+"/complete",{method:"POST"});alert(x.message||"Done");refresh();loadTasks()}
function showReferral(){const link=location.origin+"/?ref="+(user.id||"demo");document.getElementById("content").innerHTML=`<h2>🎁 Referral</h2><p>আপনার referral link:</p><input class="input" readonly value="${link}"><button class="primary" onclick="navigator.clipboard.writeText('${link}')">Copy</button>`}
function showProfile(){document.getElementById("content").innerHTML=`<h2>👤 Profile</h2><p>Name: ${user.first_name||"Demo"}</p><p>Telegram ID: ${user.id||"Demo"}</p>`}
function showWithdraw(){document.getElementById("content").innerHTML='<h2>💸 Withdraw</h2><input id="amount" class="input" type="number" placeholder="Amount"><input id="phone" class="input" placeholder="bKash/Nagad number"><button class="primary" onclick="withdraw()">Submit request</button>'}
async function withdraw(){const x=await api("/withdraw",{method:"POST",body:JSON.stringify({amount:Number(document.getElementById("amount").value),phone:document.getElementById("phone").value})});alert(x.message||"Request sent");refresh()}
refresh();