// 獲取付款資料
function getPaymentData() {
    const dataStr = sessionStorage.getItem('paymentData');
    if (!dataStr) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(dataStr);
}

// 格式化時間 (MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// 倒數計時器
let countdown = 20 * 60; // 20分鐘
let countdownInterval = null;

function startCountdown() {
    const timerElement = document.getElementById('timer');

    countdownInterval = setInterval(() => {
        countdown--;
        timerElement.textContent = formatTime(countdown);

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            // 付款超時
            window.location.href = 'complete.html?status=failure&reason=付款時間已超過，請重新操作';
        }

        // 最後一分鐘變紅色警示
        if (countdown <= 60) {
            timerElement.style.color = '#f44336';
            timerElement.style.fontWeight = '700';
        }
    }, 1000);
}

// 模擬 LINE Pay Request API
function requestLinePayPayment() {
    const loadingState = document.getElementById('loadingState');
    const confirmState = document.getElementById('confirmState');

    // 模擬 API 呼叫延遲 1-2 秒
    setTimeout(() => {
        // 隱藏載入中
        loadingState.style.display = 'none';

        // 顯示確認頁面
        confirmState.style.display = 'block';

        // 開始倒數計時
        startCountdown();
    }, 1500);
}

// 確認付款
function confirmPayment() {
    const confirmState = document.getElementById('confirmState');
    const processingState = document.getElementById('processingState');
    const confirmBtn = document.getElementById('confirmPayBtn');

    // 停止倒數
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    // 禁用按鈕
    confirmBtn.disabled = true;

    // 顯示處理中狀態
    confirmState.style.display = 'none';
    processingState.style.display = 'block';

    // 模擬 LINE Pay Confirm API
    setTimeout(() => {
        // 模擬成功率 95%
        const isSuccess = Math.random() > 0.05;

        if (isSuccess) {
            // 付款成功
            window.location.href = 'complete.html?status=success';
        } else {
            // 付款失敗
            window.location.href = 'complete.html?status=failure&reason=LINE Pay 付款失敗，請稍後再試';
        }
    }, 2000);
}

// 取消付款
function cancelPayment() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    Modal.confirm(
        '確定要取消付款嗎？',
        () => {
            // 確定取消
            window.location.href = 'complete.html?status=failure&reason=使用者取消付款';
        },
        () => {
            // 不取消，繼續倒數
            startCountdown();
        }
    );
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

    // 確認付款按鈕
    const confirmBtn = document.getElementById('confirmPayBtn');
    confirmBtn.addEventListener('click', confirmPayment);

    // 模擬 Request API 呼叫
    requestLinePayPayment();

    // 防止使用者離開頁面
    window.addEventListener('beforeunload', (e) => {
        if (document.getElementById('confirmState').style.display !== 'none') {
            e.preventDefault();
            e.returnValue = '付款尚未完成，確定要離開嗎？';
            return e.returnValue;
        }
    });
}

// 頁面載入
document.addEventListener('DOMContentLoaded', init);
