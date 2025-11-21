// 獲取 URL 參數
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 獲取付款資料
function getPaymentData() {
    const dataStr = sessionStorage.getItem('paymentData');
    if (dataStr) {
        return JSON.parse(dataStr);
    }
    return null;
}

// 付款方式轉換
function getPaymentMethodText(method) {
    const methods = {
        'credit': '信用卡',
        'linepay': 'LINE Pay'
    };
    return methods[method] || method;
}

// 顯示成功結果
function showSuccessResult(data) {
    const successDiv = document.getElementById('successResult');
    const failureDiv = document.getElementById('failureResult');

    successDiv.style.display = 'block';
    failureDiv.style.display = 'none';

    // 填充資料
    if (data) {
        document.getElementById('paymentAmount').textContent = `NT$ ${data.totalAmount}`;
        document.getElementById('paymentMethod').textContent = getPaymentMethodText(data.paymentMethod);
    }

    // 模擬發票號碼（實際應從後端回傳）
    const invoiceNumber = generateInvoiceNumber();
    document.getElementById('invoiceNumber').textContent = invoiceNumber;

    // 清除付款資料
    sessionStorage.removeItem('paymentData');
}

// 顯示失敗結果
function showFailureResult(reason) {
    const successDiv = document.getElementById('successResult');
    const failureDiv = document.getElementById('failureResult');

    successDiv.style.display = 'none';
    failureDiv.style.display = 'block';

    // 設定失敗原因
    if (reason) {
        document.getElementById('errorReason').textContent = reason;
    }
}

// 生成模擬發票號碼
function generateInvoiceNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix = letters.charAt(Math.floor(Math.random() * letters.length)) +
                   letters.charAt(Math.floor(Math.random() * letters.length));
    const numbers = String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
    return prefix + numbers;
}

// 重新付款
function retryPayment() {
    window.location.href = 'index.html';
}

// 取消訂單
function cancelOrder() {
    Modal.confirm(
        '確定要取消訂單嗎？',
        () => {
            // 確定取消
            sessionStorage.removeItem('paymentData');
            // 返回訂單頁面重新開始
            window.location.href = 'index.html';
        }
    );
}

// 初始化頁面
function init() {
    const status = getUrlParameter('status');
    const paymentData = getPaymentData();

    if (status === 'success') {
        showSuccessResult(paymentData);
    } else if (status === 'failure') {
        const reason = getUrlParameter('reason') || '付款授權失敗，請確認卡片資訊';
        showFailureResult(reason);
    } else {
        // 沒有狀態參數，返回首頁
        window.location.href = 'index.html';
    }
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', init);
