let currentMonth, currentYear;
let departureDate = '';
let returnDate = '';

// Datepicker functions
function initDatePicker(dateStr = null) {
  const now = new Date();
  currentMonth = now.getMonth();
  currentYear = now.getFullYear();
  if (dateStr) {
    parseDate(dateStr);
  }
  renderCalendar();
}

function parseDate(dateStr) {
  const [d, m, y] = dateStr.split('/').map(Number);
  currentMonth = m - 1;
  currentYear = y;
}

function renderCalendar() {
  const monthYear = document.getElementById('monthYear');
  const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  monthYear.textContent = months[currentMonth] + ' ' + currentYear;

  const body = document.getElementById('calendarBody');
  body.innerHTML = '';

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();
  today.setHours(0,0,0,0); // reset giờ về 0h

  let row = document.createElement('tr');
  for (let i = 0; i < firstDay; i++) {
    let cell = document.createElement('td');
    cell.classList.add('p-1');
    row.appendChild(cell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
      body.appendChild(row);
      row = document.createElement('tr');
    }

    let cell = document.createElement('td');
    cell.classList.add('p-1', 'cursor-pointer', 'hover:bg-gray-100', 'rounded');
    const dayDateObj = new Date(currentYear, currentMonth, day);
    dayDateObj.setHours(0,0,0,0);
    const selectedDateStr = `${day.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;
    if (selectedDateStr === departureDate || selectedDateStr === returnDate) {
      cell.classList.add('bg-brand-500', 'text-white');
    }
    if (dayDateObj < today) {
      cell.classList.add('text-neutral-400', 'cursor-not-allowed');
    } else {
      cell.onclick = () => selectDate(day);
    }
    cell.textContent = day;
    row.appendChild(cell);
  }

  // Fill the last row with empty cells if necessary
  while (row.children.length < 7) {
    const cell = document.createElement('td');
    cell.classList.add('p-1');
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
  renderCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}

function selectDate(day) {
  const month = currentMonth + 1;
  const dateStr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${currentYear}`;
  const checkedRadio = document.querySelector('input[name="trip"]:checked');
  if (!checkedRadio) return;
  const tripType = checkedRadio.value;

  if (tripType === 'Một chiều') {
    departureDate = dateStr;
    returnDate = '';
  } else if (tripType === 'Khứ hồi' || tripType === 'Nhiều chặng') {
    if (!departureDate) {
      departureDate = dateStr;
    } else if (!returnDate) {
      const depDateObj = new Date(departureDate.split('/').reverse().join('-'));
      const retDateObj = new Date(dateStr.split('/').reverse().join('-'));
      if (retDateObj > depDateObj) {
        returnDate = dateStr;
      } else {
        alert('Ngày về phải sau ngày đi');
        return;
      }
    } else {
      // Both set, replace appropriately without confirm
      const depDateObj = new Date(departureDate.split('/').reverse().join('-'));
      const newDateObj = new Date(dateStr.split('/').reverse().join('-'));
      if (newDateObj > depDateObj) {
        returnDate = dateStr;
      } else {
        departureDate = dateStr;
        returnDate = '';
      }
    }
  }
  updateDateInput();
  renderCalendar(); // Re-render to update highlights
  const tripTypeNonOneWay = tripType !== 'Một chiều';
  if (tripType === 'Một chiều' || (tripTypeNonOneWay && returnDate !== '')) {
    hideDatePicker();
  }
  // For round trip, stay open after selecting departure, hide after return
}

function updateDateInput() {
  const modalDate = document.getElementById('modalDate');
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

  // Update color
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
  picker.classList.remove('hidden');
  if (!currentMonth) initDatePicker();
  renderCalendar(); // Ensure up-to-date render
}

function hideDatePicker() {
  document.getElementById('datepicker').classList.add('hidden');
}

// Close datepicker on outside click
document.addEventListener('click', function(event) {
  const modalDate = document.getElementById('modalDate');
  const picker = document.getElementById('datepicker');
  if (!modalDate.contains(event.target) && !picker.contains(event.target)) {
    hideDatePicker();
  }
});

// Swap airports function
function swapAirports() {
  const modalFromCode = document.getElementById('modalFromCode');
  const modalFromCity = document.getElementById('modalFromCity');
  const modalToCode = document.getElementById('modalToCode');
  const modalToCity = document.getElementById('modalToCity');
  const modalTitle = document.getElementById('modalTitle');

  if (!modalFromCode || !modalFromCity || !modalToCode || !modalToCity || !modalTitle) return;

  const fromCode = modalFromCode.textContent.trim();
  const fromCity = modalFromCity.textContent.trim();
  const toCode = modalToCode.textContent.trim();
  const toCity = modalToCity.textContent.trim();

  // Swap
  modalFromCode.textContent = toCode;
  modalFromCity.textContent = toCity;
  modalToCode.textContent = fromCode;
  modalToCity.textContent = fromCity;

  // Update title
  modalTitle.textContent = `${toCity} (${toCode}) → ${fromCity} (${fromCode})`;

  // Update colors for both
  [modalFromCode, modalFromCity, modalToCode, modalToCity].forEach(el => {
    el.classList.remove('text-neutral-400');
    el.classList.add('text-gray-900');
  });
}

// Dropdown management
function toggleDropdown(prefix) {
  // Close all dropdowns first
  ['from', 'to', 'budget'].forEach(p => {
    const dropdown = document.getElementById(p + 'Dropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  });

  // Toggle the specific one
  const dropdown = document.getElementById(prefix + 'Dropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

function selectOption(prefix, city, code = '') {
  if (prefix === 'budget') {
    const valueEl = document.getElementById('budgetValue');
    if (valueEl) valueEl.textContent = city;
  } else {
    const cityEl = document.getElementById(prefix + 'City');
    const codeEl = document.getElementById(prefix + 'Code');
    if (cityEl) cityEl.textContent = city;
    if (codeEl && code) codeEl.textContent = code;
  }

  toggleDropdown(prefix);
}

// Close dropdowns on outside click
document.addEventListener('click', function(event) {
  const displays = document.querySelectorAll('#fromDisplay, #toDisplay, #budgetDisplay');
  let clickedInside = false;
  displays.forEach(display => {
    if (display.contains(event.target)) {
      clickedInside = true;
    }
  });

  if (!clickedInside) {
    ['from', 'to', 'budget'].forEach(p => {
      const dropdown = document.getElementById(p + 'Dropdown');
      if (dropdown) {
        dropdown.classList.add('hidden');
      }
    });
  }
});

// Modal handling with data passing
const modal = document.getElementById('bookingModal');
document.querySelectorAll('.open-modal').forEach(row => {
  row.addEventListener('click', () => {
    const cells = row.children;
    const fromCell = cells[0].textContent.trim();
    const toCell = cells[1].textContent.trim();
    const dateCell = cells[2].textContent.trim();
    const typeCell = cells[3].textContent.trim();
    
    // Extract price from the price cell (5th child)
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
    
    // Update title with route
    const title = row.getAttribute('data-title');
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
      modalTitle.textContent = title;
    }
    
    // Update price in header
    const modalPrice = document.getElementById('modalPrice');
    if (modalPrice && price) {
      modalPrice.textContent = `từ ${price}`;
    }
    
    // Update from airport block
    const fromCodeEl = document.getElementById('modalFromCode');
    const fromCityEl = document.getElementById('modalFromCity');
    if (fromCodeEl && fromCityEl) {
      const fromMatch = fromCell.match(/([A-Z]{3})$/);
      const fromCode = fromMatch ? fromMatch[1] : 'HAN';
      const fromCity = fromCell.replace(/\s*\([A-Z]{3}\)/, '');
      fromCodeEl.textContent = fromCode;
      fromCityEl.textContent = fromCity;
    }
    
    // Update to airport block
    const toCodeEl = document.getElementById('modalToCode');
    const toCityEl = document.getElementById('modalToCity');
    const toCountryEl = document.querySelector('div.flex-1.flex.flex-col.justify-center.items-center:last-child div:last-child');
    if (toCodeEl && toCityEl) {
      const toMatch = toCell.match(/([A-Z]{3})$/);
      const toCode = toMatch ? toMatch[1] : 'DAD';
      const toCity = toCell.replace(/\s*\([A-Z]{3}\)/, '');
      toCodeEl.textContent = toCode;
      toCityEl.textContent = toCity;
      // Change colors to black when value is set
      [toCodeEl, toCityEl, toCountryEl].forEach(el => {
        if (el) {
          el.classList.remove('text-neutral-400');
          el.classList.add('text-gray-900');
        }
      });
    }
    
    // Update date input
    const modalDate = document.getElementById('modalDate');
    if (modalDate) {
      updateDateInput();
      initDatePicker(dateCell);
    }
    
    // Select radio based on type
    const radios = document.querySelectorAll('input[name="trip"]');
    radios.forEach(radio => {
      radio.checked = false;
    });
    const matchingRadio = Array.from(radios).find(radio => radio.value === typeCell);
    if (matchingRadio) {
      matchingRadio.checked = true;
      matchingRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  });
});

// Radio change handling
document.querySelectorAll('input[name="trip"]').forEach(radio => {
  radio.addEventListener('change', function() {
    if (this.value === 'Một chiều') {
      returnDate = '';
    }
    updateDateInput();
    renderCalendar(); 
  });
});

// Close modal on backdrop click
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    hideDatePicker();
    departureDate = '';
    returnDate = '';
  }
});

document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function() {
  });
});