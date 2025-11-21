// DOM 元素
const invoiceTypeRadios = document.querySelectorAll('input[name="invoiceType"]');
const personalInvoice = document.getElementById('personalInvoice');
const companyInvoice = document.getElementById('companyInvoice');
const carrierTypeSelect = document.getElementById('carrierType');
const carrierIdGroup = document.getElementById('carrierIdGroup');
const donationGroup = document.getElementById('donationGroup');
const confirmBtn = document.getElementById('confirmBtn');

// 驗證規則
const VALIDATION_RULES = {
    taxId: /^[0-9]{8}$/,
    mobileCarrier: /^\/[A-Z0-9]{7}$/,
    donationCode: /^[0-9]{3,7}$/
};

// 錯誤訊息
const ERROR_MESSAGES = {
    taxId: '統編格式錯誤，請輸入8碼數字',
    taxIdStartWithZero: '統編首碼不可為0',
    companyTitle: '請輸入公司抬頭',
    mobileCarrier: '手機條碼格式錯誤，範例: /ABC1234',
    donationCode: '捐贈碼為3-7碼數字'
};

// 初始化
function init() {
    // 發票類型切換
    invoiceTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleInvoiceTypeChange);
    });

    // 載具類型切換
    carrierTypeSelect.addEventListener('change', handleCarrierTypeChange);

    // 輸入驗證
    document.getElementById('taxId')?.addEventListener('input', validateTaxId);
    document.getElementById('carrierId')?.addEventListener('input', validateCarrierId);
    document.getElementById('donationCode')?.addEventListener('input', validateDonationCode);

    // 確認付款按鈕
    confirmBtn.addEventListener('click', handleConfirmPayment);
}

// 處理發票類型切換
function handleInvoiceTypeChange(e) {
    const isPersonal = e.target.value === 'personal';

    if (isPersonal) {
        personalInvoice.style.display = 'block';
        companyInvoice.style.display = 'none';
        clearCompanyInvoiceFields();
    } else {
        personalInvoice.style.display = 'none';
        companyInvoice.style.display = 'block';
        clearPersonalInvoiceFields();
    }
}

// 處理載具類型切換
function handleCarrierTypeChange(e) {
    const carrierType = e.target.value;
    const carrierId = document.getElementById('carrierId');
    const donationCode = document.getElementById('donationCode');

    if (carrierType === 'mobile' || carrierType === 'certificate') {
        // 顯示載具號碼，禁用捐贈碼
        carrierIdGroup.style.display = 'block';
        donationGroup.style.display = 'none';
        donationCode.disabled = true;
        donationCode.value = '';
    } else if (carrierType === 'none') {
        // 隱藏載具號碼，啟用捐贈碼
        carrierIdGroup.style.display = 'none';
        donationGroup.style.display = 'block';
        carrierId.disabled = false;
        carrierId.value = '';
        donationCode.disabled = false;
    } else {
        // 未選擇時隱藏所有
        carrierIdGroup.style.display = 'none';
        donationGroup.style.display = 'none';
        carrierId.value = '';
        donationCode.value = '';
    }

    clearError('carrierId');
    clearError('donationCode');
}

// 驗證統一編號
function validateTaxId() {
    const taxId = document.getElementById('taxId');
    const errorDiv = document.getElementById('taxIdError');
    const value = taxId.value.trim();

    if (!value) {
        return true; // 讓提交時檢查必填
    }

    // 檢查格式
    if (!VALIDATION_RULES.taxId.test(value)) {
        showError('taxId', ERROR_MESSAGES.taxId);
        return false;
    }

    // 檢查首碼不可為0
    if (value.startsWith('0')) {
        showError('taxId', ERROR_MESSAGES.taxIdStartWithZero);
        return false;
    }

    clearError('taxId');
    return true;
}

// 驗證載具號碼
function validateCarrierId() {
    const carrierId = document.getElementById('carrierId');
    const carrierType = document.getElementById('carrierType').value;
    const value = carrierId.value.trim();

    if (!value) {
        return true; // 非必填
    }

    // 手機條碼驗證
    if (carrierType === 'mobile') {
        if (!VALIDATION_RULES.mobileCarrier.test(value)) {
            showError('carrierId', ERROR_MESSAGES.mobileCarrier);
            return false;
        }
    }

    clearError('carrierId');
    return true;
}

// 驗證捐贈碼
function validateDonationCode() {
    const donationCode = document.getElementById('donationCode');
    const value = donationCode.value.trim();

    if (!value) {
        clearError('donationCode');
        return true; // 選填
    }

    if (!VALIDATION_RULES.donationCode.test(value)) {
        showError('donationCode', ERROR_MESSAGES.donationCode);
        return false;
    }

    clearError('donationCode');
    return true;
}

// 顯示錯誤訊息
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

// 清除錯誤訊息
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

// 清空個人發票欄位
function clearPersonalInvoiceFields() {
    document.getElementById('carrierType').value = '';
    document.getElementById('carrierId').value = '';
    document.getElementById('donationCode').value = '';
    carrierIdGroup.style.display = 'none';
    donationGroup.style.display = 'none';
}

// 清空公司發票欄位
function clearCompanyInvoiceFields() {
    document.getElementById('taxId').value = '';
    document.getElementById('companyTitle').value = '';
    clearError('taxId');
    clearError('companyTitle');
}

// 處理確認付款
function handleConfirmPayment() {
    const invoiceType = document.querySelector('input[name="invoiceType"]:checked').value;
    let isValid = true;

    // 驗證發票資訊
    if (invoiceType === 'company') {
        // 公司發票驗證
        const taxId = document.getElementById('taxId').value.trim();
        const companyTitle = document.getElementById('companyTitle').value.trim();

        if (!taxId) {
            showError('taxId', '請輸入統一編號');
            isValid = false;
        } else if (!validateTaxId()) {
            isValid = false;
        }

        if (!companyTitle) {
            showError('companyTitle', ERROR_MESSAGES.companyTitle);
            isValid = false;
        } else {
            clearError('companyTitle');
        }
    } else {
        // 個人發票驗證
        const carrierType = document.getElementById('carrierType').value;

        if (carrierType === 'mobile' || carrierType === 'certificate') {
            if (!validateCarrierId()) {
                isValid = false;
            }
        }

        if (!validateDonationCode()) {
            isValid = false;
        }
    }

    if (!isValid) {
        // 滾動到第一個錯誤欄位
        const firstError = document.querySelector('.form-input.error, .form-select.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // 驗證通過，準備付款
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // 收集表單資料
    const formData = collectFormData();

    // 模擬付款流程
    processPayment(paymentMethod, formData);
}

// 收集表單資料
function collectFormData() {
    const invoiceType = document.querySelector('input[name="invoiceType"]:checked').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    const data = {
        invoiceType,
        paymentMethod,
        totalAmount: 60,
        machineId: 'VM-TPE-001'
    };

    if (invoiceType === 'company') {
        data.taxId = document.getElementById('taxId').value.trim();
        data.companyTitle = document.getElementById('companyTitle').value.trim();
    } else {
        const carrierType = document.getElementById('carrierType').value;
        data.carrierType = carrierType;

        if (carrierType === 'mobile' || carrierType === 'certificate') {
            data.carrierId = document.getElementById('carrierId').value.trim();
        } else if (carrierType === 'none') {
            const donationCode = document.getElementById('donationCode').value.trim();
            if (donationCode) {
                data.donationCode = donationCode;
            }
        }
    }

    return data;
}

// 處理付款流程
function processPayment(method, data) {
    // 禁用按鈕
    confirmBtn.disabled = true;
    confirmBtn.textContent = '處理中...';

    // 將資料存到 sessionStorage
    sessionStorage.setItem('paymentData', JSON.stringify(data));

    // 根據付款方式導向不同頁面
    setTimeout(() => {
        if (method === 'credit') {
            // 導向信用卡付款頁
            window.location.href = 'credit-card.html';
        } else if (method === 'linepay') {
            // 導向 LINE Pay 頁面
            window.location.href = 'linepay.html';
        }
    }, 500);
}

// 初始化應用
document.addEventListener('DOMContentLoaded', init);
