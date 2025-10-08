// app.js
//////////////
// ================== GLOBAL STATE ==================
let currentMonth, currentYear;
let currentMonth2, currentYear2;
let departureDate = '';
let returnDate = '';
let currentFromCode = 'HAN';
let currentToCode = 'DAD';
let modalFromCode = 'HAN';
let modalToCode = 'DAD';
let showLunar = true; // luôn true khi mở ban đầu

// Passenger counts
let adultCount = 1;
let childCount = 0;
let infantCount = 0;


// ================== DATEPICKER ==================
function initDatePicker(dateStr = null) {
  const now = new Date();
  currentMonth = now.getMonth();
  currentYear = now.getFullYear();
  currentMonth2 = currentMonth + 1;
  currentYear2 = currentYear;
  if (currentMonth2 > 11) {
    currentMonth2 = 0;
    currentYear2++;
  }
  if (dateStr) {
    parseDate(dateStr);
  }
  renderBothCalendars();
}

function parseDate(dateStr) {
  const [d, m, y] = dateStr.split('/').map(Number);
  currentMonth = m - 1;
  currentYear = y;
  currentMonth2 = currentMonth + 1;
  currentYear2 = currentYear;
  if (currentMonth2 > 11) {
    currentMonth2 = 0;
    currentYear2++;
  }
}

function renderBothCalendars() {
  renderCalendar(1, currentMonth, currentYear);
  renderCalendar(2, currentMonth2, currentYear2);
}

function renderCalendar(calendarNum, month, year) {
  const monthYear = document.getElementById('monthYear' + calendarNum);
  const months = ['Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'];
  if (!monthYear) return;
  monthYear.textContent = months[month] + ' ' + year;

  const body = document.getElementById('calendarBody' + calendarNum);
  if (!body) return;
  body.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let row = document.createElement('tr');

  // Empty cells before first day
  for (let i = 0; i < adjustedFirstDay; i++) {
    let cell = document.createElement('td');
    cell.classList.add('h-12', 'py-1');
    row.appendChild(cell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    if ((adjustedFirstDay + day - 1) % 7 === 0 && day !== 1) {
      body.appendChild(row);
      row = document.createElement('tr');
    }

    let cell = document.createElement('td');
    cell.classList.add('h-12', 'py-1', 'relative', 'text-center');

    const dayDateObj = new Date(year, month, day);
    dayDateObj.setHours(0, 0, 0, 0);
    const selectedDateStr = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;

    const dayDiv = document.createElement('div');
    dayDiv.classList.add('relative', 'flex', 'items-center', 'justify-center', 'cursor-pointer', 'transition-colors', 'h-10', 'w-10', 'mx-auto', 'rounded-lg');

    // Range background
    let isInRange = false;
    if (departureDate && returnDate) {
      const depDateObj = new Date(departureDate.split('/').reverse().join('-'));
      const retDateObj = new Date(returnDate.split('/').reverse().join('-'));
      if (dayDateObj > depDateObj && dayDateObj < retDateObj) {
        isInRange = true;
      }
    }

    const isDeparture = selectedDateStr === departureDate;
    const isReturn = selectedDateStr === returnDate;
    const isSelected = isDeparture || isReturn;

    if (dayDateObj < today) {
      dayDiv.classList.add('text-gray-400', 'cursor-not-allowed');
      dayDiv.onclick = null;
    } else {
      if (isSelected) {
        dayDiv.classList.remove('hover:bg-gray-100');
        dayDiv.classList.add('bg-[#9C0512]', 'text-white', 'font-semibold', 'shadow-sm');
      } else if (isInRange) {
        dayDiv.classList.add('bg-gray-100', 'hover:bg-gray-200', 'text-gray-900');
      } else {
        dayDiv.classList.add('hover:bg-gray-50', 'text-gray-900');
      }
      dayDiv.onclick = () => selectDate(day, month, year);
    }

    // Solar date (center)
    const dayText = document.createElement('div');
    dayText.classList.add('text-base', 'leading-none', 'font-normal');
    dayText.textContent = day;
    dayDiv.appendChild(dayText);

    // Lunar date (top-right)
    if (showLunar) {
      const lunarDay = ((day + 10) % 30) + 1; // Approximation placeholder
      const lunarText = document.createElement('div');
      lunarText.classList.add('absolute', 'top-0.5', 'right-0.5', 'text-[10px]', 'leading-none', 'font-normal');

      if (lunarDay === 1) {
        lunarText.classList.add('text-red-500', 'font-semibold');
        const lunarMonth = ((month + 2) % 12) + 1; // Approximation placeholder
        lunarText.textContent = `1/${lunarMonth}`;
      } else {
        lunarText.classList.add('text-gray-400');
        lunarText.textContent = lunarDay;
      }

      dayDiv.appendChild(lunarText);
    }

    cell.appendChild(dayDiv);
    row.appendChild(cell);
  }

  // Fill remaining cells
  while (row.children.length < 7) {
    const cell = document.createElement('td');
    cell.classList.add('h-12', 'py-1');
    row.appendChild(cell);
  }
  body.appendChild(row);
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  currentMonth2 = currentMonth + 1;
  currentYear2 = currentYear;
  if (currentMonth2 > 11) {
    currentMonth2 = 0;
    currentYear2++;
  }
  renderBothCalendars();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  currentMonth2 = currentMonth + 1;
  currentYear2 = currentYear;
  if (currentMonth2 > 11) {
    currentMonth2 = 0;
    currentYear2++;
  }
  renderBothCalendars();
}

function selectDate(day, month, year) {
  const dateStr = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
  const checkedRadio = document.querySelector('input[name="trip"]:checked');
  if (!checkedRadio) return;
  const tripType = checkedRadio.value;

  if (tripType === 'Một chiều') {
    departureDate = dateStr;
    returnDate = '';
  } else if (tripType === 'Khứ hồi' || tripType === 'Nhiều chặng') {
    if (!departureDate && !returnDate) {
      departureDate = dateStr;
    } else if (departureDate && !returnDate) {
      const depDateObj = new Date(departureDate.split('/').reverse().join('-'));
      const newDateObj = new Date(dateStr.split('/').reverse().join('-'));
      if (newDateObj > depDateObj) {
        returnDate = dateStr;
      } else if (newDateObj < depDateObj) {
        returnDate = departureDate;
        departureDate = dateStr;
      } else {
        departureDate = dateStr;
        returnDate = '';
      }
    } else if (departureDate && returnDate) {
      const depDateObj = new Date(departureDate.split('/').reverse().join('-'));
      const retDateObj = new Date(returnDate.split('/').reverse().join('-'));
      const newDateObj = new Date(dateStr.split('/').reverse().join('-'));
      if (dateStr === departureDate) {
        departureDate = returnDate;
        returnDate = '';
      } else if (dateStr === returnDate) {
        returnDate = '';
      } else {
        if (newDateObj < depDateObj) {
          departureDate = dateStr;
        } else if (newDateObj > retDateObj) {
          returnDate = dateStr;
        } else {
          departureDate = dateStr;
          returnDate = '';
        }
      }
    }
  }
  updateDateInput();
  renderBothCalendars();
}

function updateDateInput() {
  const modalDate = document.getElementById('modalDate');
  if (!modalDate) return;

  const checkedRadio = document.querySelector('input[name="trip"]:checked');
  if (!checkedRadio) return;
  const tripType = checkedRadio.value;

  if (tripType === 'Một chiều') {
    modalDate.value = departureDate || '';
  } else if (tripType === 'Khứ hồi' || tripType === 'Nhiều chặng') {
    if (returnDate) {
      modalDate.value = `${departureDate} - ${returnDate}`;
    } else {
      modalDate.value = departureDate || '';
    }
  }

  if (modalDate.value) {
    modalDate.classList.remove('text-neutral-400');
    modalDate.classList.add('text-gray-900');
  } else {
    modalDate.classList.add('text-neutral-400');
    modalDate.classList.remove('text-gray-900');
  }
}

function showDatePicker() {
  const picker = document.getElementById('datepicker');
  if (!picker) return;
  picker.classList.remove('hidden');
  showLunar = true;
  const amLichCheckbox = document.getElementById('amLich');
  if (amLichCheckbox) amLichCheckbox.checked = true;
  if (!currentMonth && currentMonth !== 0) initDatePicker();
  renderBothCalendars();
}

function hideDatePicker() {
  const picker = document.getElementById('datepicker');
  if (picker) picker.classList.add('hidden');
}

function closeDatePicker() {
  hideDatePicker();
}

function resetDatePicker() {
  departureDate = '';
  returnDate = '';
  updateDateInput();
  renderBothCalendars();
}

function toggleLunarCalendar() {
  showLunar = document.getElementById('amLich').checked;
  renderBothCalendars();
}


// ================== PASSENGERS ==================
const MIN_ADULTS = 1;
const MAX_TOTAL = 9;
const MAX_PASSENGER_MSG = 'Xin lưu ý: Bạn có thể đặt chỗ cho tối đa chín hành khách.';

function totalPassengers() {
  return adultCount + childCount + infantCount;
}

// Tạo/đặt thông báo trong dropdown hành khách
function ensurePassengerNoteEl() {
  let el = document.getElementById('passengerMaxNote');
  if (!el) {
    const host = document.getElementById('passengerInfoCol') 
              || document.getElementById('passengerDropdown'); 
    if (!host) return null;
    el = document.createElement('div');
    el.id = 'passengerMaxNote';
    el.className = 'mt-3 text-xs text-red-600';
    host.appendChild(el);
  }
  return el;
}

function setPassengerNotice(visible) {
  const el = ensurePassengerNoteEl();
  if (!el) return;

  el.textContent = `${MAX_PASSENGER_MSG}`;

  if (visible) {
    // Hiển thị: bỏ class hidden và đảm bảo display block
    el.classList.remove('hidden');
    el.style.display = 'block';
    el.removeAttribute('aria-hidden');
  } else {
    // Ẩn: thêm class hidden
    el.classList.add('hidden');
    el.style.display = '';
    el.setAttribute('aria-hidden', 'true');
  }
}

function togglePassengerDropdown() {
  const dropdown = document.getElementById('passengerDropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('hidden');
  if (!dropdown.classList.contains('hidden')) {
    updatePassengerButtons();
    // Hiện/ẩn thông báo theo trạng thái khi mở dropdown
    setPassengerNotice(totalPassengers() >= MAX_TOTAL);
  }
}

function closePassengerDropdown() {
  const dropdown = document.getElementById('passengerDropdown');
  if (dropdown) dropdown.classList.add('hidden');
  updatePassengerDisplay();
}

function resetPassengers() {
  adultCount = 1;
  childCount = 0;
  infantCount = 0;
  updatePassengerCounts();
  updatePassengerButtons();
  updatePassengerDisplay();
  setPassengerNotice(false);
}

function updatePassengerCount(type, delta) {
  if (delta === 0) return;

  // Dự tính trước
  let nextAdult = adultCount;
  let nextChild = childCount;
  let nextInfant = infantCount;

  if (type === 'adult') {
    nextAdult = Math.max(MIN_ADULTS, adultCount + delta);
  } else if (type === 'child') {
    nextChild = Math.max(0, childCount + delta);
  } else if (type === 'infant') {
    nextInfant = Math.max(0, infantCount + delta);
  }

  // Chặn tăng làm vượt tổng
  const projectedTotal = nextAdult + nextChild + nextInfant;
  if (delta > 0 && projectedTotal > MAX_TOTAL) {
    // Hiện log khi chạm trần
    setPassengerNotice(true);
    updatePassengerButtons();
    return;
  }

  // Áp dụng
  adultCount = nextAdult;
  childCount = nextChild;
  infantCount = nextInfant;

  // Em bé ≤ người lớn
  if (infantCount > adultCount) {
    infantCount = adultCount;
  }

  // Bảo toàn tổng ≤ 9 (phòng trường hợp spam nút)
  while (totalPassengers() > MAX_TOTAL) {
    if (infantCount > 0) infantCount--;
    else if (childCount > 0) childCount--;
    else if (adultCount > MIN_ADULTS) adultCount--;
    else break;
  }

  updatePassengerCounts();
  updatePassengerButtons();
  updatePassengerDisplay();

  // Cập nhật thông báo theo trạng thái mới
  setPassengerNotice(totalPassengers() >= MAX_TOTAL);
}

function updatePassengerCounts() {
  const adultEl = document.getElementById('adultCount');
  const childEl = document.getElementById('childCount');
  const infantEl = document.getElementById('infantCount');
  if (adultEl) adultEl.textContent = adultCount;
  if (childEl) childEl.textContent = childCount;
  if (infantEl) infantEl.textContent = infantCount;
}

function updatePassengerButtons() {
  const total = totalPassengers();

  const adultMinus = document.getElementById('adultMinus');
  const adultPlus  = document.getElementById('adultPlus');
  const childMinus = document.getElementById('childMinus');
  const childPlus  = document.getElementById('childPlus');
  const infantMinus = document.getElementById('infantMinus');
  const infantPlus  = document.getElementById('infantPlus');

  if (adultMinus) adultMinus.disabled = adultCount <= MIN_ADULTS;
  if (adultPlus)  adultPlus.disabled  = total >= MAX_TOTAL;

  if (childMinus) childMinus.disabled = childCount <= 0;
  if (childPlus)  childPlus.disabled  = total >= MAX_TOTAL;

  if (infantMinus) infantMinus.disabled = infantCount <= 0;
  if (infantPlus)  infantPlus.disabled  = (infantCount >= adultCount) || (total >= MAX_TOTAL);
}

function updatePassengerDisplay() {
  const total = totalPassengers();
  const display = document.getElementById('passengerDisplay');
  if (!display) return;

  const parts = [];
  if (adultCount) parts.push(`${adultCount} NL`);
  if (childCount) parts.push(`${childCount} TE`);
  if (infantCount) parts.push(`${infantCount} EB`);

  const label = total === 1 ? '1 Hành khách' : `${total} Hành khách`;
  display.textContent = parts.length ? `${label} (${parts.join(', ')})` : label;
}

// Nếu bạn có nút +/– gọi trực tiếp, có thể chặn tăng khi vượt giới hạn:
window.incAdult = () => canIncrement('adult') && updatePassengerCount('adult', +1);
window.decAdult = () => updatePassengerCount('adult', -1);
window.incChild = () => canIncrement('child') && updatePassengerCount('child', +1);
window.decChild = () => updatePassengerCount('child', -1);
window.incInfant = () => canIncrement('infant') && updatePassengerCount('infant', +1);
window.decInfant = () => updatePassengerCount('infant', -1);

// ================== SWAP AIRPORTS (MODAL) ==================
function swapAirports() {
  const modalFromCode = document.getElementById('modalFromCode');
  const modalFromCity = document.getElementById('modalFromCity');
  const modalToCode = document.getElementById('modalToCode');
  const modalToCity = document.getElementById('modalToCity');

  if (!modalFromCode || !modalFromCity || !modalToCode || !modalToCity) return;

  const fromCode = modalFromCode.textContent.trim();
  const fromCity = modalFromCity.textContent.trim();
  const toCode = modalToCode.textContent.trim();
  const toCity = modalToCity.textContent.trim();

  modalFromCode.textContent = toCode;
  modalFromCity.textContent = toCity;
  modalToCode.textContent = fromCode;
  modalToCity.textContent = fromCity;

  [modalFromCode, modalFromCity, modalToCode, modalToCity].forEach(el => {
    el.classList.remove('text-neutral-400');
    el.classList.add('text-gray-900');
  });

  // Sync global
  modalFromCode = toCode;
  modalToCode = fromCode;
}


// ================== DROPDOWNS (OUTER FILTERS) ==================
function selectAirport(prefix, fullCity, airportName, code) {
  const cityEl = document.getElementById(prefix + 'City');
  const codeEl = document.getElementById(prefix + 'Code');
  if (cityEl) cityEl.textContent = fullCity.split(',')[0];
  if (codeEl) codeEl.textContent = code;

  highlightSelectedItem(prefix, code);

  if (prefix === 'from') {
    currentFromCode = code;
  } else if (prefix === 'to') {
    currentToCode = code;
  }

  filterTable();
  toggleDropdown(prefix);
}

function filterTable() {
  const fromCode = currentFromCode;
  const toCode = currentToCode;
  const budgetValueEl = document.getElementById('budgetValue');
  let minBudget = 0;
  let maxBudget = Infinity;
  if (budgetValueEl) {
    const val = budgetValueEl.textContent.trim();
    if (val === 'Tất cả giá') {
      minBudget = 0;
      maxBudget = Infinity;
    } else if (val === 'Trên 10 triệu VND') {
      minBudget = 10000000;
      maxBudget = Infinity;
    } else if (val.match(/(\d+)-(\d+) triệu VND/)) {
      const [, minTr, maxTr] = val.match(/(\d+)-(\d+) triệu VND/);
      minBudget = parseInt(minTr) * 1000000;
      maxBudget = parseInt(maxTr) * 1000000;
    } else {
      maxBudget = Infinity; // Fallback
    }
  }
  const rows = document.querySelectorAll('#tbody > div');

  rows.forEach(row => {
    const rowFrom = row.getAttribute('data-from');
    const rowTo = row.getAttribute('data-to');
    const rowPrice = parseInt(row.getAttribute('data-price') || 0);
    if (rowFrom === fromCode && rowTo === toCode && rowPrice >= minBudget && rowPrice <= maxBudget) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}

function highlightSelectedItem(prefix, code) {
  const listItems = document.querySelectorAll(`#${prefix}List > div[data-code]`);
  listItems.forEach(item => {
    item.classList.remove('bg-gray-100');
    if (item.getAttribute('data-code') === code) {
      item.classList.add('bg-gray-100');
    }
  });
}

function toggleDropdown(prefix) {
  ['from', 'to', 'budget'].forEach(p => {
    const dropdown = document.getElementById(p + 'Dropdown');
    if (dropdown && p !== prefix) {
      dropdown.classList.add('hidden');
    }
  });

  const dropdown = document.getElementById(prefix + 'Dropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
    if (!dropdown.classList.contains('hidden')) {
      const searchInput = document.getElementById(prefix + 'Search');
      if (searchInput) {
        searchInput.value = '';
      }
      const listItems = document.querySelectorAll(`#${prefix}List > div[data-city]`);
      listItems.forEach(item => item.classList.remove('hidden'));

      const currentCodeEl = document.getElementById(prefix + 'Code');
      if (currentCodeEl) {
        highlightSelectedItem(prefix, currentCodeEl.textContent.trim());
      }
      setupSearchFilter();
    }
  }
}

function selectOption(prefix, value) {
  if (prefix === 'budget') {
    const valueEl = document.getElementById('budgetValue');
    if (valueEl) valueEl.textContent = value;
    highlightSelectedBudgetOption(value);
    filterTable();
  }
  const dropdown = document.getElementById(prefix + 'Dropdown');
  if (dropdown) dropdown.classList.add('hidden');
}

// Thêm hàm highlight cho budget option
function highlightSelectedBudgetOption(selectedValue) {
  const options = document.querySelectorAll('.budget-option');
  options.forEach(option => {
    const value = option.getAttribute('data-value');
    const radioSpan = option.querySelector('.radio-span');
    const label = option;

    if (value === selectedValue) {
      // Selected: bg-blue-50, border-blue-500, dot bg-blue-500
      label.classList.add('bg-blue-50');
      if (radioSpan) {
        radioSpan.classList.add('border-blue-500', 'bg-blue-50');
        const dot = radioSpan.querySelector('span');
        if (!dot) {
          const newDot = document.createElement('span');
          newDot.classList.add('w-2', 'h-2', 'rounded-full', 'bg-blue-500');
          radioSpan.appendChild(newDot);
        }
      }
    } else {
      // Unselected: remove highlight
      label.classList.remove('bg-blue-50');
      if (radioSpan) {
        radioSpan.classList.remove('border-blue-500', 'bg-blue-50');
        const dot = radioSpan.querySelector('span');
        if (dot) dot.remove();
        radioSpan.classList.add('border-gray-300');
      }
    }
  });
}

// Search filtering for outer dropdowns
function setupSearchFilter() {
  const fromSearch = document.getElementById('fromSearch');
  const fromListItems = document.querySelectorAll('#fromList > div[data-city]');
  if (fromSearch) {
    fromSearch.oninput = null;
    fromSearch.oninput = handleFromSearch;
    fromSearch.onmousedown = fromSearch.onclick = fromSearch.onfocus = (e) => e.stopPropagation();
  }

  const toSearch = document.getElementById('toSearch');
  const toListItems = document.querySelectorAll('#toList > div[data-city]');
  if (toSearch) {
    toSearch.oninput = null;
    toSearch.oninput = handleToSearch;
    toSearch.onmousedown = toSearch.onclick = toSearch.onfocus = (e) => e.stopPropagation();
  }

  function handleFromSearch(e) {
    const query = e.target.value.toLowerCase();
    const currentCode = document.getElementById('fromCode') ? document.getElementById('fromCode').textContent.trim() : '';
    fromListItems.forEach(item => {
      const city = item.getAttribute('data-city').toLowerCase();
      const fullText = item.textContent.toLowerCase();
      const isSelected = item.getAttribute('data-code') === currentCode;
      if (!query || city.includes(query) || fullText.includes(query) || isSelected) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
    if (currentCode) {
      highlightSelectedItem('from', currentCode);
    }
  }

  function handleToSearch(e) {
    const query = e.target.value.toLowerCase();
    const currentCode = document.getElementById('toCode') ? document.getElementById('toCode').textContent.trim() : '';
    toListItems.forEach(item => {
      const city = item.getAttribute('data-city').toLowerCase();
      const fullText = item.textContent.toLowerCase();
      const isSelected = item.getAttribute('data-code') === currentCode;
      if (!query || city.includes(query) || fullText.includes(query) || isSelected) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
    if (currentCode) {
      highlightSelectedItem('to', currentCode);
    }
  }
}


// ================== MODAL FROM-TO DROPDOWNS ==================
function toggleModalDropdown(side) {
  const ddFrom = document.getElementById('modalFromDropdown');
  const ddTo = document.getElementById('modalToDropdown');
  const btnFrom = document.getElementById('modalFromBtn');
  const btnTo = document.getElementById('modalToBtn');
  if (ddFrom) ddFrom.classList.add('hidden');
  if (ddTo) ddTo.classList.add('hidden');
  if (btnFrom) btnFrom.classList.remove('bg-neutral-100');
  if (btnTo) btnTo.classList.remove('bg-neutral-100');
  const dd = side === 'from' ? ddFrom : ddTo;
  const btn = side === 'from' ? btnFrom : btnTo;
  if (dd) {
    dd.classList.toggle('hidden');
    if (!dd.classList.contains('hidden') && btn) {
      btn.classList.add('bg-neutral-100');
    }
  }
}

function selectModalAirport(side, fullCity, airportName, code) {
  const city = fullCity.split(',')[0];
  if (side === 'from') {
    const elCode = document.getElementById('modalFromCode');
    const elCity = document.getElementById('modalFromCity');
    if (elCode) elCode.textContent = code;
    if (elCity) elCity.textContent = city;
    highlightSelectedModalItem('from', code);
    modalFromCode = code;
    const dd = document.getElementById('modalFromDropdown');
    if (dd) dd.classList.add('hidden');
  } else {
    const elCode = document.getElementById('modalToCode');
    const elCity = document.getElementById('modalToCity');
    if (elCode) elCode.textContent = code;
    if (elCity) elCity.textContent = city;
    [elCode, elCity].forEach(el => {
      if (!el) return;
      el.classList.remove('text-neutral-400');
      el.classList.add('text-gray-900');
    });
    highlightSelectedModalItem('to', code);
    modalToCode = code;
    const dd = document.getElementById('modalToDropdown');
    if (dd) dd.classList.add('hidden');
  }
}

function highlightSelectedModalItem(side, code) {
  const list = document.querySelectorAll(`#modal${side.charAt(0).toUpperCase() + side.slice(1)}List > div[data-code]`);
  list.forEach(item => {
    item.classList.remove('bg-gray-100');
    if ((item.getAttribute('data-code') || '').trim() === code) {
      item.classList.add('bg-gray-100');
    }
  });
}

// search trong dropdown modal
function attachModalSearchModal() {
  attachOne('modalFromSearch', 'modalFromList');
  attachOne('modalToSearch', 'modalToList');

  function attachOne(inputId, listId) {
    const input = document.getElementById(inputId);
    const listItems = () => document.querySelectorAll(`#${listId} > div[data-city]`);
    if (!input) return;
    input.oninput = null;
    input.oninput = (e) => {
      const q = (e.target.value || '').toLowerCase();
      listItems().forEach(item => {
        const city = (item.getAttribute('data-city') || '').toLowerCase();
        const code = (item.getAttribute('data-code') || '').toLowerCase();
        const full = (item.textContent || '').toLowerCase();
        const match = !q || city.includes(q) || code.includes(q) || full.includes(q);
        item.classList.toggle('hidden', !match);
      });
      const codeNow =
        listId === 'modalFromList'
          ? (document.getElementById('modalFromCode')?.textContent || '').trim()
          : (document.getElementById('modalToCode')?.textContent || '').trim();
      if (codeNow) {
        if (listId === 'modalFromList') highlightSelectedModalItem('from', codeNow);
        else highlightSelectedModalItem('to', codeNow);
      }
    };
  }
}

// Close modal dropdowns on outside click
document.addEventListener('mousedown', function (e) {
  const ddFrom = document.getElementById('modalFromDropdown');
  const ddTo = document.getElementById('modalToDropdown');
  const insideFromBtn = e.target.closest('#modalFromCode, #modalFromCity');
  const insideToBtn = e.target.closest('#modalToCode, #modalToCity');
  const insideDropdown = e.target.closest('#modalFromDropdown, #modalToDropdown');
  if (!insideFromBtn && !insideToBtn && !insideDropdown) {
    if (ddFrom) ddFrom.classList.add('hidden');
    if (ddTo) ddTo.classList.add('hidden');
  }
});


// ================== OUTSIDE CLICK (outer dropdowns & passenger) ==================
document.addEventListener('click', function(event) {
  const displays = document.querySelectorAll('#fromDisplay, #toDisplay, #budgetDisplay');
  let clickedInside = false;
  displays.forEach(display => {
    if (display && display.contains(event.target)) {
      clickedInside = true;
    }
  });
  const dropdownContainers = document.querySelectorAll('#fromDropdown, #toDropdown, #budgetDropdown');
  const clickedDropdown = Array.from(dropdownContainers).some(dropdown => dropdown && dropdown.contains(event.target));
  if (!clickedInside && !clickedDropdown) {
    ['from', 'to', 'budget'].forEach(p => {
      const dropdown = document.getElementById(p + 'Dropdown');
      if (dropdown) {
        dropdown.classList.add('hidden');
      }
    });
  }

  const passengerDisplay = document.getElementById('passengerDisplay');
  const passengerDropdown = document.getElementById('passengerDropdown');
  const passengerIcon = event.target.closest('img[src*="Vector.png"]');

  if (passengerDisplay && passengerDropdown && !passengerDisplay.contains(event.target) && !passengerDropdown.contains(event.target) && !passengerIcon) {
    passengerDropdown.classList.add('hidden');
  }
});


// ================== MODAL HANDLING ==================
function openModal(row) {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const cells = row.children;
  const fromCell = cells[0].textContent.trim();
  const toCell = cells[1].textContent.trim();
  const dateCell = cells[2].textContent.trim();
  const typeCell = cells[3].textContent.trim();

  const priceCell = cells[4].querySelector('.font-bold:last-of-type');
  const price = priceCell ? priceCell.textContent.trim() : '';

  // Reset dates
  departureDate = dateCell;
  if (typeCell === 'Khứ hồi') {
    const [d, m, y] = dateCell.split('/').map(Number);
    const depDate = new Date(y, m-1, d);
    const retDate = new Date(depDate);
    retDate.setDate(depDate.getDate() + 7);
    const retD = retDate.getDate().toString().padStart(2, '0');
    const retM = (retDate.getMonth() + 1).toString().padStart(2, '0');
    const retY = retDate.getFullYear();
    returnDate = `${retD}/${retM}/${retY}`;
  } else {
    returnDate = '';
  }

  resetPassengers();

  const title = row.getAttribute('data-title');
  const modalTitle = document.getElementById('modalTitle');
  if (modalTitle && title) {
    modalTitle.textContent = title;
  }

  const modalPrice = document.getElementById('modalPrice');
  if (modalPrice && price) {
    modalPrice.textContent = `từ ${price}`;
  }

  const fromCodeEl = document.getElementById('modalFromCode');
  const fromCityEl = document.getElementById('modalFromCity');
  if (fromCodeEl && fromCityEl) {
    const fromMatch = fromCell.match(/([A-Z]{3})\)$/);
    const fromCode = fromMatch ? fromMatch[1] : 'HAN';
    const fromCity = fromCell.replace(/\s*\([A-Z]{3}\)/, '');
    fromCodeEl.textContent = fromCode;
    fromCityEl.textContent = fromCity;
    modalFromCode = fromCode;
  }

  const toCodeEl = document.getElementById('modalToCode');
  const toCityEl = document.getElementById('modalToCity');
  if (toCodeEl && toCityEl) {
    const toMatch = toCell.match(/([A-Z]{3})\)$/);
    const toCode = toMatch ? toMatch[1] : 'DAD';
    const toCity = toCell.replace(/\s*\([A-Z]{3}\)/, '');
    toCodeEl.textContent = toCode;
    toCityEl.textContent = toCity;
    [toCodeEl, toCityEl].forEach(el => {
      el.classList.remove('text-neutral-400');
      el.classList.add('text-gray-900');
    });
    modalToCode = toCode;
  }

  const modalDate = document.getElementById('modalDate');
  if (modalDate) {
    updateDateInput();
    initDatePicker(dateCell);
  }

  const radios = document.querySelectorAll('input[name="trip"]');
  radios.forEach(radio => {
    radio.checked = radio.value === typeCell;
  });

  // Gắn search & highlight dropdown modal mỗi lần mở
  attachModalSearchModal();
  const curFromCode = document.getElementById('modalFromCode')?.textContent?.trim();
  const curToCode = document.getElementById('modalToCode')?.textContent?.trim();
  if (curFromCode) highlightSelectedModalItem('from', curFromCode);
  if (curToCode) highlightSelectedModalItem('to', curToCode);

  // Đảm bảo dropdown modal đóng lúc mở
  const ddFrom = document.getElementById('modalFromDropdown');
  const ddTo = document.getElementById('modalToDropdown');
  if (ddFrom) ddFrom.classList.add('hidden');
  if (ddTo) ddTo.classList.add('hidden');

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Radio change handling
document.addEventListener('change', function(e) {
  if (e.target.name === 'trip') {
    if (e.target.value === 'Một chiều') {
      returnDate = '';
    }
    updateDateInput();
    renderBothCalendars();
  }
});

// Close modal on overlay click
document.addEventListener('click', function(e) {
  const modal = document.getElementById('bookingModal');
  if (modal && e.target === modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    hideDatePicker();
    closePassengerDropdown();
    departureDate = '';
    returnDate = '';
  }
});


// ================== INIT ==================
document.addEventListener('DOMContentLoaded', function() {
  setupSearchFilter();
  highlightSelectedItem('from', 'HAN');
  highlightSelectedItem('to', 'DAD');

  // Set budget default THỦ CÔNG (không toggle)
  const budgetValue = document.getElementById('budgetValue');
  if (budgetValue) budgetValue.textContent = 'Tất cả giá';
  highlightSelectedBudgetOption('Tất cả giá');

  updatePassengerCounts();
  updatePassengerButtons();
  updatePassengerDisplay();

  // Modals: open by row click (event delegation)
  document.addEventListener('click', function(e) {
    const row = e.target.closest('.open-modal');
    if (row) {
      openModal(row);
    }
  });
});