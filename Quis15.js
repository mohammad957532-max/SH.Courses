// ✅ تسجيل / دخول موحّد
function handleAuth(mode) {
  const username = document.getElementById(mode === 'login' ? "loginUsername" : "registerUsername").value.trim().toLowerCase();
  const password = document.getElementById(mode === 'login' ? "loginPassword" : "registerPassword").value;

  if (!username || !password) {
    alert("يرجى إدخال اسم المستخدم وكلمة المرور.");
    return;
  }

  if (mode === 'register') {
    if (!isValidPassword(password)) {
      alert("كلمة المرور ضعيفة...");
      return;
    }
    localStorage.setItem(`user_${username}`, btoa(password));
    alert(`مرحباً ${username}، تم إنشاء الحساب بنجاح!`);
  } else {
    const savedPass = localStorage.getItem(`user_${username}`);
    if (savedPass && savedPass === btoa(password)) {
      localStorage.setItem("loggedInUser", username);
      alert("تم تسجيل الدخول بنجاح!");
      showProtectedContent();
    } else {
      alert("اسم المستخدم أو كلمة المرور غير صحيحة.");
    }
  }
}

// ✅ فحص قوة كلمة المرور
function isValidPassword(password) {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password) &&
         /[^A-Za-z0-9]/.test(password);
}
 function showLogin() {
      document.getElementById("welcomeSection").style.display = "none";
      document.getElementById("authSection").style.display = "block";
    }

    function verifyLogin() {
      const username = document.getElementById("usernameInput").value.trim().toLowerCase();
      const password = document.getElementById("passwordInput").value;
      const message = document.getElementById("loginMessage");

      const users = {
        "ahmad": "pass123",
        "mohammad": "secure456",
        "sara": "quiz789"
      };

      if (users[username] && users[username] === password) {
        localStorage.setItem("loggedInUser", username);
        message.style.color = "green";
        message.textContent = "تم تسجيل الدخول بنجاح!";
        setTimeout(() => {
          document.getElementById("authSection").style.display = "none";
          document.getElementById("courseSelection").style.display = "block";
        }, 1000);
      } else {
        message.style.color = "red";
        message.textContent = "اسم المستخدم أو كلمة المرور غير صحيحة.";
      }
    }

    function startCourse() {
      document.getElementById("courseSelection").style.display = "none";
      document.getElementById("courseContent").style.display = "block";
    }

    function videoFinished() {
      document.getElementById("quizSection").style.display = "block";
    }

    function checkQ1() {
      const answer = document.querySelector('input[name="q1"]:checked');
      const result = document.getElementById("resultQ1");
      if (!answer) {
        result.textContent = "يرجى اختيار إجابة.";
        return;
      }
      result.textContent = answer.value === "int" ? "إجابة صحيحة!" : "إجابة خاطئة، حاول مرة أخرى.";
    }

    function checkQ2() {
      const answer = document.querySelector('input[name="q2"]:checked');
      const result = document.getElementById("resultQ2");
      if (!answer) {
        result.textContent = "يرجى اختيار إجابة.";
        return;
      }
      result.textContent = answer.value === "23" ? "إجابة صحيحة!" : "إجابة خاطئة، حاول مرة أخرى.";
    }

    function checkQ3() {
      const answer = document.querySelector('input[name="q3"]:checked');
      const result = document.getElementById("resultQ3");
      if (!answer) {
        result.textContent = "يرجى اختيار إجابة.";
        return;
      }
      result.textContent = answer.value === "function" ? "إجابة صحيحة!" : "إجابة خاطئة، حاول مرة أخرى.";
    }
// ✅ حفظ التقدم
function saveProgress(lessonId, passed) {
  let progress = JSON.parse(localStorage.getItem("userProgress")) || {};
  progress[lessonId] = passed;
  localStorage.setItem("userProgress", JSON.stringify(progress));
}

// ✅ التحقق من الإجابات
function checkQuestion(questionName, correctValue, resultId, note) {
  const answer = document.querySelector(`input[name="${questionName}"]:checked`);
  const result = document.getElementById(resultId);

  if (!answer) {
    result.className = "resultBox incorrect";
    result.innerHTML = `<span class="icon">⚠️</span> يرجى اختيار إجابة.`;
    return;
  }

  if (parseInt(answer.value) === parseInt(correctValue)) {
    result.className = "resultBox correct";
    result.innerHTML = `<span class="icon">✅</span> إجابة صحيحة!<br>${note || ""}`;
    saveProgress(questionName, true);
  } else {
    result.className = "resultBox incorrect";
    result.innerHTML = `<span class="icon">❌</span> إجابة خاطئة، حاول مرة أخرى.`;
    saveProgress(questionName, false);
  }
}

// ✅ عرض المحتوى بعد تسجيل الدخول
function showProtectedContent() {
  const username = localStorage.getItem("loggedInUser") || "طالب";
  const container = document.getElementById("lessonContainer");

  container.innerHTML = `<p>مرحباً ${username} 👋، جاري تحميل الدرس والأسئلة...</p>`;

  loadQuestionsAndRender(container);
}

// ✅ تحميل الأسئلة من JSON وعرضها
async function loadQuestionsAndRender(container) {
  try {
    const res = await fetch("Quis.json");
    if (!res.ok) throw new Error("فشل التحميل");
    const data = await res.json();

    const lesson = data.courses[0].lessons[0];
    const quizData = lesson.quiz;

    let html = `
      <div class="lesson">
        <h2>${lesson.title}</h2>
        <p>📘 هذا الدرس يحتوي على فيديو وملف PDF:</p>
        <video src="${lesson.video}" controls width="100%"></video>
        <p><a href="${lesson.pdf}" target="_blank">📄 تحميل ملف PDF</a></p>
    `;

    quizData.forEach((qItem, index) => {
      html += `
        <div class="quiz">
          <h3>سؤال ${index + 1}:</h3>
          <p>${qItem.q}</p>
          ${qItem.options.map((opt, i) => `
            <label><input type="radio" name="${qItem.id}" value="${i}"> ${opt}</label><br>
          `).join("")}
          <div id="result${qItem.id}"></div>
          <button onclick="checkQuestion('${qItem.id}', '${qItem.answer}', 'result${qItem.id}', '${qItem.note}')">إرسال</button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

  } catch (e) {
    container.innerHTML = `<p>❌ حدث خطأ أثناء تحميل الدرس: ${e.message}</p>`;
    console.error("خطأ في تحميل الأسئلة:", e);
  }
}
