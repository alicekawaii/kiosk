// 自訂彈窗組件
const Modal = {
    // 顯示 Alert 彈窗
    alert: function(message, callback) {
        this.show({
            title: '提示',
            message: message,
            buttons: [
                {
                    text: '確定',
                    primary: true,
                    onClick: () => {
                        this.close();
                        if (callback) callback();
                    }
                }
            ]
        });
    },

    // 顯示 Confirm 彈窗
    confirm: function(message, onConfirm, onCancel) {
        this.show({
            title: '確認',
            message: message,
            buttons: [
                {
                    text: '取消',
                    primary: false,
                    onClick: () => {
                        this.close();
                        if (onCancel) onCancel();
                    }
                },
                {
                    text: '確定',
                    primary: true,
                    onClick: () => {
                        this.close();
                        if (onConfirm) onConfirm();
                    }
                }
            ]
        });
    },

    // 顯示彈窗
    show: function(options) {
        // 移除現有彈窗（如果有）
        this.close();

        // 建立遮罩
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'customModalOverlay';

        // 建立彈窗容器
        const modal = document.createElement('div');
        modal.className = 'modal-container';

        // 建立標題
        const title = document.createElement('div');
        title.className = 'modal-title';
        title.textContent = options.title || '提示';

        // 建立內容
        const content = document.createElement('div');
        content.className = 'modal-content';
        content.textContent = options.message || '';

        // 建立按鈕區域
        const buttonArea = document.createElement('div');
        buttonArea.className = 'modal-buttons';

        // 建立按鈕
        options.buttons.forEach(btnConfig => {
            const btn = document.createElement('button');
            btn.className = btnConfig.primary ? 'modal-btn modal-btn-primary' : 'modal-btn modal-btn-secondary';
            btn.textContent = btnConfig.text;
            btn.onclick = btnConfig.onClick;
            buttonArea.appendChild(btn);
        });

        // 組裝彈窗
        modal.appendChild(title);
        modal.appendChild(content);
        modal.appendChild(buttonArea);
        overlay.appendChild(modal);

        // 添加到頁面
        document.body.appendChild(overlay);

        // 淡入動畫
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);

        // 點擊遮罩不關閉（需點按鈕）
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                // 不做任何事，必須點擊按鈕
            }
        };
    },

    // 關閉彈窗
    close: function() {
        const overlay = document.getElementById('customModalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }
};

// 覆蓋全域的 alert 和 confirm（可選）
// window.alert = (msg) => Modal.alert(msg);
// window.confirm = (msg) => new Promise(resolve => Modal.confirm(msg, () => resolve(true), () => resolve(false)));
