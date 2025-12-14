

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
