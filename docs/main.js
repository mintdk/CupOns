const firebaseConfig = {
  apiKey: "AIzaSyAU9zcn7DkI2dDuqkmBgUM_zFpY5xcbAiw",
  authDomain: "cupons-3daf2.firebaseapp.com",
  projectId: "cupons-3daf2",
  storageBucket: "cupons-3daf2.firebasestorage.app",
  messagingSenderId: "850464640588",
  appId: "1:850464640588:web:2057540fdbdf966da1eee9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function getCoupons() {
    return JSON.parse(localStorage.getItem("coupons")) || {};
}

function saveCoupons(data) {
    localStorage.setItem("coupons", JSON.stringify(data));
}

function generateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

const generateBtn = document.getElementById("generateBtn");

if (generateBtn) {
    generateBtn.addEventListener("click", () => {

        const name = document.getElementById("couponName").value.trim();
        const desc = document.getElementById("couponDesc").value.trim();
        const amount = parseInt(document.getElementById("couponAmount").value);

        if (!name || !desc || !amount || amount <= 0) {
            alert("Please fill in all fields.");
            return;
        }

        const code = generateCode();

        const coupons = getCoupons();

        coupons[code] = {
            name: name,
            desc: desc,
            remaining: amount
        };

        saveCoupons(coupons);

        document.getElementById("generated").innerHTML =
            `Your coupon code:<br><strong>${code}</strong>`;
    });
}


const redeemBtn = document.getElementById("redeemBtn");

if (redeemBtn) {
    redeemBtn.addEventListener("click", () => {

        const codeInput = document.getElementById("redeemCode");
        const code = codeInput.value.trim();
        const result = document.getElementById("result");

        result.className = "result"; // reset clases

        if (!code) {
            result.textContent = "Please enter a code.";
            result.classList.add("error");
            return;
        }

        const coupons = getCoupons();

        if (!coupons[code]) {
            result.textContent = "Invalid coupon code.";
            result.classList.add("error");
            return;
        }

        const coupon = coupons[code];

        if (coupon.remaining <= 0) {
            result.innerHTML = `No coupons left for <strong>${coupon.name}</strong>.`;
            result.classList.add("error");
            return;
        }

        coupon.remaining -= 1;
        saveCoupons(coupons);

        result.innerHTML = `
            ✅ <strong>${coupon.name}</strong> redeemed!<br>
            ${coupon.desc}<br>
            Coupons left: <strong>${coupon.remaining}</strong>
        `;
        result.classList.add("success");

        codeInput.value = "";
    });
}

