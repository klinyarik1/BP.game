let xp = 100;
let currentLevel = 1;

// Эффект печатающегося текста
function typeWriter(text, elementId, speed = 30) {
    let i = 0;
    let element = document.getElementById(elementId);
    element.innerHTML = "";
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function openApp(appName) {
    // Проверяем, соответствует ли приложение текущему уровню сюжета
    $.get(`/get_level/${currentLevel}`, function(data) {
        if (data.app.toLowerCase() === appName || (appName === 'bank' && data.app === 'Kufar')) {
            showLevel(data);
        } else {
            notify("Доступ закрыт. Проверьте другие уведомления.");
        }
    });
}

function showLevel(data) {
    const win = document.getElementById('window');
    win.classList.remove('hidden');
    typeWriter(data.text, 'level-text');
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = "";
    
    // Кнопка "Анализировать" — новое средство
    let analyzeBtn = document.createElement('button');
    analyzeBtn.className = "opt-btn analyze-special";
    analyzeBtn.innerText = "🔍 Анализировать угрозу";
    analyzeBtn.onclick = () => startAnalysis(data);
    optionsDiv.appendChild(analyzeBtn);

    data.options.forEach(opt => {
        let btn = document.createElement('button');
        btn.className = "opt-btn";
        btn.innerText = opt.text;
        btn.onclick = () => makeChoice(opt.xp, data.law);
        optionsDiv.appendChild(btn);
    });
}

function startAnalysis(data) {
    document.getElementById('analysis-tool').classList.remove('hidden');
    let codeContent = document.getElementById('code-content');
    
    // В зависимости от уровня показываем разные "улики"
    if (currentLevel === 1) { // Фишинг
        codeContent.innerHTML = `
            <p style="color: red;">Header: From: support@bel-post-fix.ru (Внимание: домен .ru вместо .by!)</p>
            <p>Link: http://bit.ly/track-your-money-secure</p>
        `;
    } else if (currentLevel === 4) { // Дропперы
        codeContent.innerHTML = `
            <p>Анализ переписки: Использование слов 'обнал', 'карта в аренду', 'быстрые деньги'.</p>
            <p style="color: orange;">Риск: Нарушение ст. 222 УК РБ.</p>
        `;
    }
}

function notify(msg) {
    // Простая всплывашка в углу
    const n = document.createElement('div');
    n.className = 'notification';
    n.innerText = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}
