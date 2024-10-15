async function fetchMembers() {
    const userId = localStorage.getItem('user_id');  // ID текущего пользователя
    const userRole = localStorage.getItem('user_role');  // Роль текущего пользователя (director, manager, employee)

    const { data: members, error } = await _supabase
        .from('users')
        .select('*');

    if (error) {
        console.error('Ошибка при получении участников:', error);
        return;
    }

    // Фильтруем текущего пользователя из списка
    const filteredMembers = members.filter(member => member.id != userId);

    const activeMembers = filteredMembers.filter(member => member.status === 'active');
    const blockedMembers = filteredMembers.filter(member => member.status === 'blocked');

    const activeList = document.getElementById('members__active-list');
    activeList.innerHTML = '';
    activeMembers.forEach(member => {
        activeList.appendChild(createMemberItem(member, 'active', userRole));
    });

    // Отображаем заблокированных участников
    const blockedList = document.getElementById('members__blocked-list');
    blockedList.innerHTML = '';
    blockedMembers.forEach(member => {
        blockedList.appendChild(createMemberItem(member, 'blocked', userRole));
    });
}

// Функция создания элемента участника с возможностью "отстранить/разблокировать"
function createMemberItem(member, status, currentUserRole) {
    const itemLink = document.createElement('a');
    itemLink.href = `https://falsea3.github.io/rep/delta/profile?id=${member.id}`;
    itemLink.classList.add(status === 'active' ? 'members__active-item' : 'members__blocked-item');
    itemLink.style.display = 'flex';  // Чтобы элемент выглядел как блок, если нужно

    const infoDiv = document.createElement('div');
    infoDiv.classList.add(status === 'active' ? 'members__active-info' : 'members__blocked-info');

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('img');
    imgDiv.textContent = member.username[0].toUpperCase();

    const memberInfo = document.createElement('div');
    memberInfo.classList.add('info');
    memberInfo.innerHTML = `<p>${member.username}</p><span>${member.position}</span>`;

    infoDiv.appendChild(imgDiv);
    infoDiv.appendChild(memberInfo);

    const actionButton = document.createElement('button');

    // Проверка на право отстранения или разблокировки
    let canPerformAction = false;
    if (status === 'active') {
        // Логика для отстранения
        if (member.role !== 'director') {  // Никто не может отстранить директора
            if (currentUserRole === 'director') {
                canPerformAction = true;  // Директор может отстранять любого, кроме директоров
            } else if (currentUserRole === 'manager' && member.role === 'employee') {
                canPerformAction = true;  // Менеджер может отстранять только сотрудников (employee)
            }
        }
    } else {
        // Логика для разблокировки
        if (currentUserRole === 'director') {
            canPerformAction = true;  // Директор может разблокировать любого
        }
    }

    infoDiv.appendChild(imgDiv);
    infoDiv.appendChild(memberInfo);

    itemLink.appendChild(infoDiv);

    if (canPerformAction) {
        actionButton.textContent = status === 'active' ? 'Отстранить' : 'Разблокировать';
        actionButton.onclick = async (event) => {
            event.preventDefault();  // Предотвращаем переход по ссылке при клике на кнопку
            const newStatus = status === 'active' ? 'blocked' : 'active';
            await _supabase
                .from('users')
                .update({ status: newStatus })
                .eq('id', member.id);
            fetchMembers();  // Перезагружаем список участников
        };

        // Вставляем кнопку после блока информации о пользователе
        itemLink.appendChild(actionButton);
    }

    return itemLink;
}

fetchMembers();

function checkLogin() {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
        window.location.href = 'https://falsea3.github.io/rep/delta/login.html';
    }
}

checkLogin();