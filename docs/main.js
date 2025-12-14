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
  generateBtn.addEventListener("click", async () => {
    const name = document.getElementById("couponName").value.trim();
    const desc = document.getElementById("couponDesc").value.trim();
    const amount = parseInt(document.getElementById("couponAmount").value);

    if (!name || !desc || !amount || amount <= 0) {
      alert("Please fill in all fields.");
      return;
    }

    const code = generateCode();

    try {
      await db.collection("coupons").doc(code).set({
        name: name,
        desc: desc,
        remaining: amount,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      document.getElementById("generated").innerHTML =
        `Your coupon code:<br><strong>${code}</strong>`;
    } catch (error) {
      console.error("Error creating coupon:", error);
      alert("Failed to create coupon. Check console for details.");
    }
  });
}
const redeemBtn = document.getElementById("redeemBtn");
if (redeemBtn) {
  redeemBtn.addEventListener("click", async () => {
    const codeInput = document.getElementById("redeemCode");
    const code = codeInput.value.trim();
    const result = document.getElementById("result");

    result.className = "result"; 

    if (!code) {
      result.textContent = "Please enter a code.";
      result.classList.add("error");
      return;
    }

    try {
      const docRef = db.collection("coupons").doc(code);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        result.textContent = "Invalid coupon code.";
        result.classList.add("error");
        return;
      }

      const coupon = docSnap.data();

      if (coupon.remaining <= 0) {
        result.innerHTML = `No coupons left for <strong>${coupon.name}</strong>.`;
        result.classList.add("error");
        return;
      }
      await docRef.update({ remaining: coupon.remaining - 1 });

      result.innerHTML = `
        ✅ <strong>${coupon.name}</strong> redeemed!<br>
        ${coupon.desc}<br>
        Coupons left: <strong>${coupon.remaining - 1}</strong>
      `;
      result.classList.add("success");

      codeInput.value = "";
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      alert("Failed to redeem coupon. Check console for details.");
    }
  });
}
function adjustLayout() {
  const container = document.querySelector("main.container");
  const inputs = document.querySelectorAll("input");
  const buttons = document.querySelectorAll("button");

  if (!container) return;

  const screenWidth = window.innerWidth;

  let widthPercent = 90;
  if (screenWidth <= 400) widthPercent = 98;
  else if (screenWidth <= 600) widthPercent = 95;

  container.style.width = widthPercent + "%";

  let inputPadding = 12;
  let buttonPadding = 12;
  let fontSize = 16;

  if (screenWidth <= 400) {
    inputPadding = 10;
    buttonPadding = 10;
    fontSize = 14;
  } else if (screenWidth <= 600) {
    inputPadding = 11;
    buttonPadding = 11;
    fontSize = 15;
  }

  inputs.forEach(input => {
    input.style.padding = inputPadding + "px";
    input.style.fontSize = fontSize + "px";
  });

  buttons.forEach(button => {
    button.style.padding = buttonPadding + "px";
    button.style.fontSize = fontSize + "px";
  });
}

window.addEventListener("load", adjustLayout);
window.addEventListener("resize", adjustLayout);
