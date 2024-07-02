
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function pluralize(number, one, few, many) {
    let mod10 = number % 10;
    let mod100 = number % 100;

    if (mod10 === 1 && mod100 !== 11) {
        return one;
    } else if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) {
        return few;
    } else {
        return many;
    }
}

const firebaseConfig = { apiKey: "AIzaSyD4Yb0NMJCEDeB4OWDEJjAZinW4qmHsb-c", authDomain: "project-1838357061875087994.firebaseapp.com", projectId: "project-1838357061875087994", storageBucket: "project-1838357061875087994.appspot.com", messagingSenderId: "950064646313", appId: "1:950064646313:web:0562f45e4e2f0c493281b8", measurementId: "G-DDRH0L5FFE" };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const validPasswords = {
  evgeniy: "363757",
  lyudmila: "12345"
};

document.addEventListener('DOMContentLoaded', async () => {
    const loginSection = document.getElementById('login-section');
    const appSection = document.getElementById('app-section');
    const loginUserSelect = document.getElementById('login-user-select');
    const loginPassword = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    const countdownElement = document.getElementById('countdown');
    const addDayBtn = document.getElementById('add-day-btn');
    const subtractDayBtn = document.getElementById('subtract-day-btn');
    const daysInput = document.getElementById('days-input');
    const commentInput = document.getElementById('comment-input');
    const historyList = document.getElementById('history-list');

    const weddingDateRef = doc(db, 'countdown', 'weddingDate');

    loginBtn.addEventListener('click', () => {
        const selectedUser = loginUserSelect.value;
        const password = loginPassword.value;

        if (validPasswords[selectedUser] === password) {
            localStorage.setItem('currentUser', selectedUser);
            loginSection.style.display = 'none';
            appSection.style.display = 'block';
        } else {
            loginError.textContent = 'Неправильный пароль. Попробуйте снова.';
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        loginSection.style.display = 'block';
        appSection.style.display = 'none';
    });

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        loginSection.style.display = 'none';
        appSection.style.display = 'block';
    }

    onSnapshot(weddingDateRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const weddingDate = new Date(data.date);
            updateCountdown(weddingDate);
            updateHistory(data.history || []);
        } else {
            console.log("No such document! Initializing with default value.");
            const defaultDate = new Date(); // Set your default wedding date here
            setDoc(weddingDateRef, { date: defaultDate.toISOString(), history: [] });
            updateCountdown(defaultDate);
        }
    });

    addDayBtn.addEventListener('click', async () => {
        const daysToAdd = parseInt(daysInput.value, 10);
        const comment = commentInput.value.trim();
        if (!isNaN(daysToAdd)) {
            await updateWeddingDate(daysToAdd, currentUser, comment);
        }
    });

    subtractDayBtn.addEventListener('click', async () => {
        const daysToSubtract = parseInt(daysInput.value, 10);
        const comment = commentInput.value.trim();
        if (!isNaN(daysToSubtract)) {
            await updateWeddingDate(-daysToSubtract, currentUser, comment);
        }
    });

    async function updateWeddingDate(daysToAdd, user, comment) {
        try {
            const docSnap = await getDoc(weddingDateRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const weddingDate = new Date(data.date);
                weddingDate.setDate(weddingDate.getDate() + daysToAdd);
                
                const historyEntry = {
                    user,
                    days: daysToAdd,
                    comment,
                    timestamp: new Date().toISOString()
                };

                await updateDoc(weddingDateRef, {
                    date: weddingDate.toISOString(),
                    history: arrayUnion(historyEntry)
                });
            }
        } catch (error) {
            console.error("Error updating document:", error);
        }
    }

    function updateCountdown(targetDate) {
        const currentDate = new Date();
        const timeDiff = targetDate - currentDate;

        if (timeDiff <= 0) {
            countdownElement.textContent = "Свадьба уже началась!";
            return;
        }

        const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
        const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        const formattedDays = String(days).padStart(2, '0');
        const formattedHours = String(hours).padStart(2, '0');

        const yearsString = pluralize(years, 'год', 'года', 'лет');
        const daysString = pluralize(days, 'день', 'дня', 'дней');
        const hoursString = pluralize(hours, 'час', 'часа', 'часов');

        countdownElement.textContent = `${years} ${yearsString} ${formattedDays} ${daysString} ${formattedHours} ${hoursString}`;
    }

    function updateHistory(history) {
        historyList.innerHTML = '';
        history.forEach(entry => {
            const listItem = document.createElement('li');
            const date = new Date(entry.timestamp);
            const formattedDate = date.toLocaleString();
            const userName = entry.user === 'evgeniy' ? 'Евгений' : 'Людмила';
            listItem.textContent = `${formattedDate} - ${userName} ${entry.days > 0 ? 'добавил' : 'убавил'} ${Math.abs(entry.days)} ${pluralize(Math.abs(entry.days), 'день', 'дня', 'дней')}. Причина: ${entry.comment}`;
            historyList.appendChild(listItem);
        });
    }
});