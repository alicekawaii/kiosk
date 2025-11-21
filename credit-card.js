// 獲取付款資料
function getPaymentData() {
    const dataStr = sessionStorage.getItem('paymentData');
    if (!dataStr) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(dataStr);
}

// 卡號格式化（每4位加空格）
function formatCardNumber(value) {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
}

// 有效期限格式化
function formatExpiryDate(value) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
        return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
}

// 偵測卡片類型
function detectCardType(number) {
    const cleaned = number.replace(/\s/g, '');

    if (/^4/.test(cleaned)) {
        return { type: 'Visa', icon: '💳' };
    } else if (/^5[1-5]/.test(cleaned)) {
        return { type: 'MasterCard', icon: '💳' };
    } else if (/^3[47]/.test(cleaned)) {
        return { type: 'American Express', icon: '💳' };
    } else if (/^6(?:011|5)/.test(cleaned)) {
        return { type: 'Discover', icon: '💳' };
    } else if (/^35/.test(cleaned)) {
        return { type: 'JCB', icon: '💳' };
    }
    return { type: '', icon: '' };
}

// Luhn 演算法驗證卡號
function validateCardNumberLuhn(number) {
    const cleaned = number.replace(/\s/g, '');

    if (!/^\d{13,19}$/.test(cleaned)) {
        return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

// 驗證卡號
function validateCardNumber() {
    const input = document.getElementById('cardNumber');
    const errorDiv = document.getElementById('cardNumberError');
    const value = input.value.trim();

    if (!value) {
        showError('cardNumber', '請輸入卡號');
        return false;
    }

    if (!validateCardNumberLuhn(value)) {
        showError('cardNumber', '卡號格式錯誤，請重新確認');
        return false;
    }

    clearError('cardNumber');
    return true;
}

// 驗證持卡人姓名
function validateCardHolder() {
    const input = document.getElementById('cardHolder');
    const value = input.value.trim();

    if (!value) {
        showError('cardHolder', '請輸入持卡人姓名');
        return false;
    }

    if (value.length < 2) {
        showError('cardHolder', '持卡人姓名至少需要2個字元');
        return false;
    }

    clearError('cardHolder');
    return true;
}

// 驗證有效期限
function validateExpiryDate() {
    const input = document.getElementById('expiryDate');
    const value = input.value.trim();

    if (!value) {
        showError('expiryDate', '請輸入有效期限');
        return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(value)) {
        showError('expiryDate', '格式錯誤，請輸入 MM/YY');
        return false;
    }

    const [month, year] = value.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) {
        showError('expiryDate', '月份必須在 01-12 之間');
        return false;
    }

    // 檢查是否過期
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        showError('expiryDate', '卡片已過期');
        return false;
    }

    clearError('expiryDate');
    return true;
}

// 驗證 CVV
function validateCVV() {
    const input = document.getElementById('cvv');
    const value = input.value.trim();

    if (!value) {
        showError('cvv', '請輸入安全碼');
        return false;
    }

    if (!/^\d{3,4}$/.test(value)) {
        showError('cvv', '安全碼為 3-4 碼數字');
        return false;
    }

    clearError('cvv');
    return true;
}

// 顯示錯誤
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');

    if (field) {
        field.classList.add('error');
    }

    if (errorDiv) {
        errorDiv.textContent = message;
    }
}

// 清除錯誤
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');

    if (field) {
        field.classList.remove('error');
    }

    if (errorDiv) {
        errorDiv.textContent = '';
    }
}

// 處理付款
function handlePayment() {
    // 驗證所有欄位
    const isCardNumberValid = validateCardNumber();
    const isCardHolderValid = validateCardHolder();
    const isExpiryDateValid = validateExpiryDate();
    const isCVVValid = validateCVV();

    if (!isCardNumberValid || !isCardHolderValid || !isExpiryDateValid || !isCVVValid) {
        // 滾動到第一個錯誤
        const firstError = document.querySelector('.form-input.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // 禁用按鈕
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> 處理中...';

    // 模擬與金流商溝通
    setTimeout(() => {
        // 取得卡號
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');

        // 測試卡號：
        // 4111 1111 1111 1111 → 成功
        // 4000 0000 0000 0002 → 失敗（卡片被拒）
        if (cardNumber === '4000000000000002') {
            // 付款失敗
            window.location.href = 'complete.html?status=failure&reason=信用卡授權失敗，請確認卡片資訊或聯繫發卡銀行';
        } else {
            // 付款成功，導向完成頁
            window.location.href = 'complete.html?status=success';
        }
    }, 2000);
}

// 返回上一頁
function goBack() {
    window.location.href = 'index.html';
}

// 初始化頁面
function init() {
    const paymentData = getPaymentData();

    if (!paymentData) {
        return;
    }

    // 顯示訂單資訊
    if (paymentData.totalAmount) {
        document.getElementById('totalAmount').textContent = `NT$ ${paymentData.totalAmount}`;
        document.getElementById('btnAmount').textContent = paymentData.totalAmount;
    }

    if (paymentData.machineId) {
        document.getElementById('machineId').textContent = paymentData.machineId;
    }

    // 生成訂單號碼
    const orderId = 'TXN' + Date.now();
    document.getElementById('orderId').textContent = orderId;

    // 卡號輸入格式化
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', (e) => {
        const cursorPosition = e.target.selectionStart;
        const oldValue = e.target.value;
        const newValue = formatCardNumber(oldValue.replace(/\D/g, ''));
        e.target.value = newValue;

        // 更新卡片類型
        const cardInfo = detectCardType(newValue);
        const cardTypeDiv = document.getElementById('cardType');
        if (cardInfo.type) {
            cardTypeDiv.textContent = cardInfo.icon + ' ' + cardInfo.type;
            cardTypeDiv.style.display = 'block';
        } else {
            cardTypeDiv.style.display = 'none';
        }

        // 調整游標位置
        if (newValue.length < oldValue.length) {
            e.target.setSelectionRange(cursorPosition, cursorPosition);
        }
    });

    cardNumberInput.addEventListener('blur', validateCardNumber);

    // 持卡人姓名自動大寫
    const cardHolderInput = document.getElementById('cardHolder');
    cardHolderInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });
    cardHolderInput.addEventListener('blur', validateCardHolder);

    // 有效期限格式化
    const expiryDateInput = document.getElementById('expiryDate');
    expiryDateInput.addEventListener('input', (e) => {
        e.target.value = formatExpiryDate(e.target.value);
    });
    expiryDateInput.addEventListener('blur', validateExpiryDate);

    // CVV 只能輸入數字
    const cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
    cvvInput.addEventListener('blur', validateCVV);

    // 提交按鈕
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', handlePayment);

    // Enter 鍵提交
    document.getElementById('creditCardForm').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handlePayment();
        }
    });
}

// 頁面載入
document.addEventListener('DOMContentLoaded', init);
