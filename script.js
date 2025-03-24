// 添加全局常量
const READING_SPEED = {
    HANZI_PER_MINUTE: 1350, // 每分钟阅读的汉字数(之前为675)
    MIN_READING_TIME: 1    // 最小阅读时间（分钟）
};

const DATE_CONSTANTS = {
    MAX_DAYS_AGO: 90,      // 最近日期范围（天）
    DATE_FORMAT: {
        YEAR_SUFFIX: '年',
        MONTH_SUFFIX: '月',
        DAY_SUFFIX: '日'
    }
};

const SLIDER_CONSTANTS = {
    MIN_X: 50,             // 滑块最小X坐标
    MAX_X: 450,            // 滑块最大X坐标
    DEFAULT_CIRCLE_RADIUS: 40, // 默认圆圈半径
    ACTIVE_CIRCLE_RADIUS: 45   // 选中圆圈半径
};

document.addEventListener('DOMContentLoaded', function() {
    // 当页面加载完成后执行以下代码
    
    // 1. 初始化时间戳 - 随机生成最近3个月内的日期
    updateArticleDate();
    
    // 2. 计算并更新阅读时间
    updateReadingTime();
    
    // 3. 初始化交互元素
    initializeInteractiveElements();
    
    // 4. 设置分享和点赞按钮的交互
    setupActionButtons();
    
    // 5. 初始化图片轮播组件
    initializeImageCarousels();
});

/**
 * 随机更新文章日期为最近3个月内的某天
 */
function updateArticleDate() {
    const dateElement = document.querySelector('.article-meta .date');
    if (dateElement) {
        const today = new Date();
        // 生成最近3个月内的随机日期
        const randomDaysAgo = Math.floor(Math.random() * DATE_CONSTANTS.MAX_DAYS_AGO);
        const randomDate = new Date(today);
        randomDate.setDate(today.getDate() - randomDaysAgo);
        
        // 格式化日期为中文格式
        const year = randomDate.getFullYear();
        const month = randomDate.getMonth() + 1;
        const day = randomDate.getDate();
        
        const formatWithLeadingZero = (num) => num < 10 ? '0' + num : num;
        
        dateElement.textContent = `${year}${DATE_CONSTANTS.DATE_FORMAT.YEAR_SUFFIX}${formatWithLeadingZero(month)}${DATE_CONSTANTS.DATE_FORMAT.MONTH_SUFFIX}${formatWithLeadingZero(day)}${DATE_CONSTANTS.DATE_FORMAT.DAY_SUFFIX}`;
    }
}

/**
 * 计算并更新文章阅读时间
 */
function updateReadingTime() {
    const articleContent = document.querySelector('.article-content');
    const readingEstimate = document.querySelector('.reading-estimate');
    
    if (articleContent && readingEstimate) {
        // 获取文章内容的文本长度
        const textLength = articleContent.textContent.replace(/\s+/g, '').length;
        
        // 计算预计阅读时间（分钟）
        let readingTimeMinutes = Math.ceil(textLength / READING_SPEED.HANZI_PER_MINUTE);
        
        // 确保最小阅读时间为1分钟
        readingTimeMinutes = Math.max(READING_SPEED.MIN_READING_TIME, readingTimeMinutes);
        
        // 更新阅读时间文本
        readingEstimate.textContent = `阅读时间约${readingTimeMinutes}分钟`;
    }
}

/**
 * 初始化页面中的SVG交互元素
 */
function initializeInteractiveElements() {
    // 初始化第一个交互图 - 绿色消费方式圆圈
    setupConsumptionVisInteraction();
    
    // 初始化第二个交互图 - 时间滑块
    setupTimeSliderInteraction();
}

/**
 * 设置绿色消费方式交互图
 */
function setupConsumptionVisInteraction() {
    const circles = document.querySelectorAll('#data-vis-types .vis-type');
    const infoText = document.querySelector('#vis-info');
    const descriptionBox = document.querySelector('#vis-description p');
    
    // 消费方式数据
    const consumptionData = {
        '二手购物': '选择二手物品不仅能节省开支，还能减少新产品生产对环境的影响。每购买一件二手衣物可以节省约2.5kg的碳排放。',
        '减少包装': '选择简约包装或散装产品，自带容器购物，可显著减少塑料垃圾。全球每年产生约3亿吨塑料垃圾，其中约40%来自包装。',
        '本地购买': '支持本地生产商可减少产品运输距离，降低碳足迹。研究表明，本地食品的碳足迹可比进口食品低17倍。',
        '耐用产品': '投资高质量、可维修的产品，虽然初期成本较高，但长期看可减少更换频率和资源消耗，节省总体成本。'
    };
    
    // 为每个圆圈添加点击事件
    circles.forEach(circle => {
        circle.addEventListener('click', function() {
            // 获取当前圆圈代表的消费方式
            const type = this.getAttribute('data-type');
            
            // 突出显示当前选中的圆圈
            circles.forEach(c => c.setAttribute('r', SLIDER_CONSTANTS.DEFAULT_CIRCLE_RADIUS)); // 重置所有圆圈大小
            this.setAttribute('r', SLIDER_CONSTANTS.ACTIVE_CIRCLE_RADIUS); // 放大当前圆圈
            
            // 更新信息文本
            infoText.textContent = type;
            
            // 更新描述文本
            if (consumptionData[type]) {
                descriptionBox.textContent = consumptionData[type];
            }
        });
        
        // 添加悬停效果
        circle.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
        });
        
        circle.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
    });
}

/**
 * 设置时间滑块交互
 */
function setupTimeSliderInteraction() {
    const slider = document.getElementById('slider-handle');
    const timeSlider = document.getElementById('time-slider');
    const dataPoint = document.getElementById('data-point');
    const dataValue = document.getElementById('data-value');
    
    // 初始化拖动状态
    let isDragging = false;
    
    // 数据点位置和数值
    const dataPoints = [
        { x: SLIDER_CONSTANTS.MIN_X, y: 200, value: '5%' },
        { x: 150, y: 180, value: '10%' },
        { x: 250, y: 120, value: '25%' },
        { x: 350, y: 150, value: '15%' },
        { x: SLIDER_CONSTANTS.MAX_X, y: 80, value: '40%' }
    ];
    
    if (slider && timeSlider) {
        // 鼠标按下事件
        slider.addEventListener('mousedown', function(e) {
            isDragging = true;
            e.preventDefault(); // 防止选中文本
        });
        
        // 鼠标移动事件
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const sliderRect = timeSlider.getBoundingClientRect();
                let newX = e.clientX - sliderRect.left;
                
                // 限制拖动范围
                if (newX < SLIDER_CONSTANTS.MIN_X) newX = SLIDER_CONSTANTS.MIN_X;
                if (newX > SLIDER_CONSTANTS.MAX_X) newX = SLIDER_CONSTANTS.MAX_X;
                
                // 更新滑块位置
                slider.setAttribute('cx', newX);
                
                // 更新数据点
                updateDataPointForX(newX);
            }
        });
        
        // 鼠标释放事件
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        // 触摸事件支持（移动设备）
        slider.addEventListener('touchstart', function(e) {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', function(e) {
            if (isDragging && e.touches.length > 0) {
                const sliderRect = timeSlider.getBoundingClientRect();
                let newX = e.touches[0].clientX - sliderRect.left;
                
                if (newX < SLIDER_CONSTANTS.MIN_X) newX = SLIDER_CONSTANTS.MIN_X;
                if (newX > SLIDER_CONSTANTS.MAX_X) newX = SLIDER_CONSTANTS.MAX_X;
                
                slider.setAttribute('cx', newX);
                updateDataPointForX(newX);
            }
        });
        
        document.addEventListener('touchend', function() {
            isDragging = false;
        });
    }
    
    /**
     * 根据滑块位置更新数据点
     */
    function updateDataPointForX(x) {
        // 找到最接近的数据点
        let closestPoint = dataPoints[0];
        let minDistance = Math.abs(x - closestPoint.x);
        
        for (let i = 1; i < dataPoints.length; i++) {
            const distance = Math.abs(x - dataPoints[i].x);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = dataPoints[i];
            }
        }
        
        // 更新数据点位置和值
        if (dataPoint && dataValue) {
            dataPoint.setAttribute('cx', closestPoint.x);
            dataPoint.setAttribute('cy', closestPoint.y);
            dataValue.setAttribute('x', closestPoint.x);
            dataValue.setAttribute('y', closestPoint.y - 20);
            dataValue.textContent = closestPoint.value;
        }
    }
}

/**
 * 设置分享和点赞按钮
 */
function setupActionButtons() {
    const shareBtn = document.querySelector('.share-btn');
    const likeBtn = document.querySelector('.like-btn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            // 显示分享选项菜单
            showShareMenu(this);
        });
    }
    
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            // 点赞计数和反馈
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                this.style.backgroundColor = '#e8f5e9';
                this.style.color = '#4CAF50';
                showActionFeedback(this, '感谢点赞！');
            } else {
                this.style.backgroundColor = '';
                this.style.color = '';
                showActionFeedback(this, '取消点赞');
            }
        });
    }
}

/**
 * 显示分享菜单
 */
function showShareMenu(element) {
    // 检查是否已经存在分享菜单
    let shareMenu = document.getElementById('shareMenu');
    
    if (shareMenu) {
        shareMenu.remove();
        return;
    }
    
    // 创建分享菜单
    shareMenu = document.createElement('div');
    shareMenu.id = 'shareMenu';
    shareMenu.className = 'share-menu';
    shareMenu.style.position = 'absolute';
    shareMenu.style.backgroundColor = 'white';
    shareMenu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    shareMenu.style.borderRadius = '8px';
    shareMenu.style.padding = '10px';
    shareMenu.style.zIndex = '1000';
    
    // 添加分享选项
    const shareOptions = [
        { name: '复制链接', icon: '🔗', action: copyPageLink },
        { name: '分享到微信', icon: '💬', action: shareToWechat },
        { name: '分享到朋友圈', icon: '👥', action: shareToTimeline },
        { name: '分享到微博', icon: '🔄', action: shareToWeibo }
    ];
    
    shareOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'share-option';
        optionElement.innerHTML = `<span class="share-icon">${option.icon}</span> ${option.name}`;
        optionElement.style.padding = '8px 12px';
        optionElement.style.cursor = 'pointer';
        optionElement.style.display = 'flex';
        optionElement.style.alignItems = 'center';
        optionElement.style.gap = '8px';
        
        optionElement.addEventListener('mouseover', () => {
            optionElement.style.backgroundColor = '#f5f5f5';
        });
        
        optionElement.addEventListener('mouseout', () => {
            optionElement.style.backgroundColor = 'transparent';
        });
        
        optionElement.addEventListener('click', () => {
            option.action();
            shareMenu.remove();
        });
        
        shareMenu.appendChild(optionElement);
    });
    
    // 添加到文档
    document.body.appendChild(shareMenu);
    
    // 计算位置
    const rect = element.getBoundingClientRect();
    shareMenu.style.top = (rect.bottom + 10) + 'px';
    shareMenu.style.left = (rect.left) + 'px';
    
    // 点击其他地方关闭菜单
    document.addEventListener('click', function closeMenu(e) {
        if (!shareMenu.contains(e.target) && e.target !== element) {
            shareMenu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
}

/**
 * 复制页面链接
 */
function copyPageLink() {
    const url = window.location.href;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => showActionFeedback(document.querySelector('.share-btn'), '链接已复制！'))
            .catch(err => showActionFeedback(document.querySelector('.share-btn'), '复制失败，请手动复制'));
    } else {
        // 对于不支持Clipboard API的浏览器
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showActionFeedback(document.querySelector('.share-btn'), '链接已复制！');
        } catch (err) {
            showActionFeedback(document.querySelector('.share-btn'), '复制失败，请手动复制');
        }
        
        document.body.removeChild(textArea);
    }
}

/**
 * 分享到微信
 */
function shareToWechat() {
    if (isWechatBrowser()) {
        // 在微信内置浏览器中，用户可以点击右上角进行分享
        showActionFeedback(document.querySelector('.share-btn'), '请点击右上角"..."按钮分享');
    } else {
        // 在其他浏览器中，显示微信分享指引
        showQRCodeGuide('微信');
    }
}

/**
 * 分享到朋友圈
 */
function shareToTimeline() {
    if (isWechatBrowser()) {
        showActionFeedback(document.querySelector('.share-btn'), '请点击右上角"..."按钮，选择"分享到朋友圈"');
    } else {
        showQRCodeGuide('朋友圈');
    }
}

/**
 * 分享到微博
 */
function shareToWeibo() {
    const text = document.title;
    const url = encodeURIComponent(window.location.href);
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${url}&title=${encodeURIComponent(text)}`;
    window.open(weiboUrl, '_blank');
}

/**
 * 显示二维码引导
 */
function showQRCodeGuide(platform) {
    // 创建弹窗
    const overlay = document.createElement('div');
    overlay.className = 'qr-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.zIndex = '2000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    
    const content = document.createElement('div');
    content.className = 'qr-content';
    content.style.backgroundColor = 'white';
    content.style.borderRadius = '12px';
    content.style.padding = '20px';
    content.style.maxWidth = '80%';
    content.style.textAlign = 'center';
    
    // 这里应该添加实际的二维码，此处为简化处理
    content.innerHTML = `
        <h3>分享到${platform}</h3>
        <p>请扫描下方二维码，在${platform}中打开</p>
        <div class="qr-placeholder" style="width: 200px; height: 200px; margin: 20px auto; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
            <span>页面二维码</span>
        </div>
        <p>或复制链接分享: ${window.location.href}</p>
        <button id="closeQrGuide" style="padding: 8px 16px; margin-top: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    // 关闭按钮事件
    document.getElementById('closeQrGuide').addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

/**
 * 检测是否在微信浏览器中
 */
function isWechatBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') !== -1;
}

/**
 * 显示操作反馈
 */
function showActionFeedback(element, message) {
    // 创建反馈提示元素
    const feedback = document.createElement('div');
    feedback.className = 'action-feedback';
    feedback.textContent = message;
    feedback.style.position = 'absolute';
    feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    feedback.style.color = 'white';
    feedback.style.padding = '6px 12px';
    feedback.style.borderRadius = '4px';
    feedback.style.fontSize = '14px';
    feedback.style.zIndex = '1000';
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.3s';
    
    // 添加到文档
    document.body.appendChild(feedback);
    
    // 计算位置
    const rect = element.getBoundingClientRect();
    feedback.style.top = (rect.top - 40) + 'px';
    feedback.style.left = (rect.left + rect.width / 2 - feedback.offsetWidth / 2) + 'px';
    
    // 显示反馈
    setTimeout(() => {
        feedback.style.opacity = '1';
    }, 10);
    
    // 3秒后淡出并移除
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 2000);
}

// 添加页面滚动效果，使阅读体验更流畅
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    for (const link of links) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// 检测设备类型并优化交互
function detectDeviceAndOptimize() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 为移动设备优化交互体验
        document.body.classList.add('mobile-device');
        
        // 优化触摸目标大小
        const interactiveElements = document.querySelectorAll('.vis-type, .share-btn, .like-btn, .tag');
        interactiveElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
        });
    }
}

// 添加漂浮元素动画效果
function setupFloatingElements() {
    // 为标题添加轻微动画
    const title = document.querySelector('.article-title');
    if(title) {
        title.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        title.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
        });
    }

    // 为标签添加波动效果
    const tags = document.querySelectorAll('.tag');
    tags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                tag.style.transform = 'translateY(0)';
            }, 300);
        }, index * 150);
    });
}

// 绿色消费方式交互
function setupVisTypeInteraction() {
    // 获取所有图表类型圆圈
    const visTypeCircles = document.querySelectorAll('.vis-type');
    const visInfo = document.getElementById('vis-info');
    const visDescription = document.getElementById('vis-description').querySelector('p');
    
    // 绿色消费方式描述
    const typeDescriptions = {
        '二手购物': '选择二手商品不仅能减少资源消耗，还能发现独特的商品。年轻人正在重新定义"旧物"的价值，让二手购物成为一种时尚。',
        '减少包装': '优先选择简约包装或可重复使用包装的产品，减少一次性塑料使用。简单的消费习惯改变可以大幅减少你的塑料足迹。',
        '本地购买': '购买本地生产的食品和商品，不仅能减少运输过程中的碳排放，还能支持本地经济发展，体验更新鲜的产品。',
        '耐用产品': '投资优质耐用的产品，虽然初期成本可能较高，但长期来看更经济环保。舍弃快时尚，追求经典持久的消费理念。'
    };
    
    // 为每个圆圈添加点击事件
    visTypeCircles.forEach(circle => {
        circle.addEventListener('click', function() {
            // 高亮选中的圆圈，重置其他圆圈
            visTypeCircles.forEach(c => {
                c.setAttribute('stroke-width', '0');
                c.setAttribute('r', '40');
            });
            
            this.setAttribute('stroke', '#2E7D32');
            this.setAttribute('stroke-width', '3');
            this.setAttribute('r', '45');
            
            // 获取消费方式类型
            const type = this.getAttribute('data-type');
            
            // 更新信息显示
            visInfo.textContent = `${type} - 环保消费新方式`;
            visDescription.textContent = typeDescriptions[type];
            
            // 添加动画效果
            visInfo.setAttribute('font-weight', 'bold');
            setTimeout(() => {
                visInfo.setAttribute('font-weight', 'normal');
            }, 300);
            
            // 添加自然元素动画
            addNatureElement(type);
        });
        
        // 添加悬停效果
        circle.addEventListener('mouseover', function() {
            if (this.getAttribute('stroke-width') !== '3') {
                this.setAttribute('r', '43');
                // 添加弹跳效果
                this.style.transform = 'translateY(-5px)';
            }
        });
        
        circle.addEventListener('mouseout', function() {
            if (this.getAttribute('stroke-width') !== '3') {
                this.setAttribute('r', '40');
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // 添加自然元素动画
    function addNatureElement(type) {
        const svg = document.getElementById('data-vis-types');
        
        // 创建自然元素
        const natureElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        // 根据类型选择不同的自然元素图标
        let natureEmoji;
        switch(type) {
            case '二手购物':
                natureEmoji = '♻️';
                break;
            case '减少包装':
                natureEmoji = '🌿';
                break;
            case '本地购买':
                natureEmoji = '🏡';
                break;
            case '耐用产品':
                natureEmoji = '✨';
                break;
            default:
                natureEmoji = '🌱';
        }
        
        // 设置元素属性
        natureElement.textContent = natureEmoji;
        natureElement.setAttribute('x', Math.random() * 400 + 50);
        natureElement.setAttribute('y', Math.random() * 100 + 50);
        natureElement.setAttribute('font-size', '20');
        natureElement.style.opacity = '0';
        
        // 添加到SVG
        svg.appendChild(natureElement);
        
        // 动画效果
        setTimeout(() => {
            natureElement.style.transition = 'all 1.5s ease';
            natureElement.style.opacity = '1';
            natureElement.style.transform = 'translateY(-30px)';
            
            setTimeout(() => {
                natureElement.style.opacity = '0';
                setTimeout(() => {
                    svg.removeChild(natureElement);
                }, 500);
            }, 1000);
        }, 100);
    }
}

// 滑块交互
function setupSliderInteraction() {
    const slider = document.getElementById('slider-handle');
    const dataPoint = document.getElementById('data-point');
    const dataValue = document.getElementById('data-value');
    const trendPath = document.getElementById('trend-path');
    
    let isDragging = false;
    let sliderMinX = 50;  // 滑块最小x坐标
    let sliderMaxX = 450; // 滑块最大x坐标
    
    // 获取路径上的点（植物改善空气质量的数据）
    const pathPoints = [
        { x: 50, y: 200, value: '5%', plantCount: 1 },
        { x: 150, y: 180, value: '15%', plantCount: 3 },
        { x: 250, y: 120, value: '25%', plantCount: 5 },
        { x: 350, y: 150, value: '20%', plantCount: 7 },
        { x: 450, y: 80, value: '35%', plantCount: 10 }
    ];
    
    // 滑块鼠标按下事件
    slider.addEventListener('mousedown', function(e) {
        isDragging = true;
        e.preventDefault(); // 防止拖动时选择文本
    });
    
    // 鼠标移动事件
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const svgContainer = document.getElementById('trend-chart').getBoundingClientRect();
        let newX = e.clientX - svgContainer.left;
        
        // 限制滑块在有效范围内
        newX = Math.max(sliderMinX, Math.min(sliderMaxX, newX));
        
        // 更新滑块位置
        slider.setAttribute('cx', newX);
        
        // 根据滑块位置找到最近的数据点
        updateDataPointBySlider(newX);
    });
    
    // 鼠标释放事件
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // 触摸事件支持
    slider.addEventListener('touchstart', function(e) {
        isDragging = true;
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const svgContainer = document.getElementById('trend-chart').getBoundingClientRect();
        let newX = touch.clientX - svgContainer.left;
        
        newX = Math.max(sliderMinX, Math.min(sliderMaxX, newX));
        slider.setAttribute('cx', newX);
        
        updateDataPointBySlider(newX);
    });
    
    document.addEventListener('touchend', function() {
        isDragging = false;
    });
    
    // 添加植物图标
    function addPlantIcons(count) {
        const svg = document.getElementById('trend-chart');
        
        // 先移除所有已有的植物图标
        const existingPlants = svg.querySelectorAll('.plant-icon');
        existingPlants.forEach(plant => {
            svg.removeChild(plant);
        });
        
        // 添加新的植物图标
        for(let i = 0; i < count; i++) {
            const plant = document.createElementNS("http://www.w3.org/2000/svg", "text");
            plant.textContent = '🌱';
            plant.setAttribute('x', 50 + Math.random() * 400);
            plant.setAttribute('y', 200 + Math.random() * 30);
            plant.setAttribute('font-size', '16');
            plant.setAttribute('class', 'plant-icon');
            plant.style.opacity = '0';
            
            svg.appendChild(plant);
            
            setTimeout(() => {
                plant.style.transition = 'all 0.5s ease';
                plant.style.opacity = '1';
                plant.style.transform = 'translateY(-10px)';
            }, i * 100);
        }
    }
    
    // 根据滑块位置更新数据点
    function updateDataPointBySlider(sliderX) {
        // 找到最接近的点
        let closestPoint = pathPoints[0];
        let minDistance = Math.abs(sliderX - closestPoint.x);
        
        for (let i = 1; i < pathPoints.length; i++) {
            const distance = Math.abs(sliderX - pathPoints[i].x);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = pathPoints[i];
            }
        }
        
        // 如果不是精确匹配，则进行插值
        if (minDistance > 0 && sliderX !== closestPoint.x) {
            // 找到左右两个点进行线性插值
            let leftPoint, rightPoint;
            
            for (let i = 0; i < pathPoints.length - 1; i++) {
                if (pathPoints[i].x <= sliderX && pathPoints[i + 1].x >= sliderX) {
                    leftPoint = pathPoints[i];
                    rightPoint = pathPoints[i + 1];
                    break;
                }
            }
            
            if (leftPoint && rightPoint) {
                // 线性插值计算y坐标和值
                const ratio = (sliderX - leftPoint.x) / (rightPoint.x - leftPoint.x);
                const y = leftPoint.y + ratio * (rightPoint.y - leftPoint.y);
                
                // 计算插值的植物数量
                const plantCount = Math.round(leftPoint.plantCount + ratio * (rightPoint.plantCount - leftPoint.plantCount));
                
                // 更新数据点位置和值
                dataPoint.setAttribute('cx', sliderX);
                dataPoint.setAttribute('cy', y);
                dataValue.setAttribute('x', sliderX);
                dataValue.setAttribute('y', y - 20);
                
                // 计算插值的百分比值
                const leftValue = parseInt(leftPoint.value);
                const rightValue = parseInt(rightPoint.value);
                const interpolatedValue = Math.round(leftValue + ratio * (rightValue - leftValue));
                dataValue.textContent = interpolatedValue + '%';
                
                // 添加植物图标
                addPlantIcons(plantCount);
                
                // 添加动画效果
                dataPoint.setAttribute('r', '10');
                setTimeout(() => {
                    dataPoint.setAttribute('r', '8');
                }, 200);
            }
        } else {
            // 精确匹配到一个点
            dataPoint.setAttribute('cx', closestPoint.x);
            dataPoint.setAttribute('cy', closestPoint.y);
            dataValue.setAttribute('x', closestPoint.x);
            dataValue.setAttribute('y', closestPoint.y - 20);
            dataValue.textContent = closestPoint.value;
            
            // 添加植物图标
            addPlantIcons(closestPoint.plantCount);
            
            // 添加动画效果
            dataPoint.setAttribute('r', '10');
            setTimeout(() => {
                dataPoint.setAttribute('r', '8');
            }, 200);
        }
    }
}

// 添加动画效果
function animateSVG() {
    // 为图表添加加载动画
    const visTypeCircles = document.querySelectorAll('.vis-type');
    
    visTypeCircles.forEach((circle, index) => {
        setTimeout(() => {
            circle.style.opacity = '0';
            circle.style.transform = 'scale(0.5)';
            
            setTimeout(() => {
                circle.style.transition = 'all 0.5s ease';
                circle.style.opacity = '1';
                circle.style.transform = 'scale(1)';
            }, 100);
        }, index * 200);
    });
    
    // 为趋势图添加路径动画
    const trendPath = document.getElementById('trend-path');
    const pathLength = trendPath.getTotalLength();
    
    trendPath.style.strokeDasharray = pathLength;
    trendPath.style.strokeDashoffset = pathLength;
    trendPath.style.transition = 'none';
    
    setTimeout(() => {
        trendPath.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
        trendPath.style.strokeDashoffset = '0';
    }, 500);
    
    // 添加自然元素背景动画
    animateNatureBackground();
}

// 添加自然元素背景动画
function animateNatureBackground() {
    const articleContainer = document.querySelector('.article-container');
    
    // 创建漂浮的自然元素
    const natureEmojis = ['🌱', '🍃', '🌿', '🌲', '🌳', '🍀'];
    const backgroundElements = document.createElement('div');
    backgroundElements.className = 'nature-background';
    backgroundElements.style.position = 'absolute';
    backgroundElements.style.top = '0';
    backgroundElements.style.left = '0';
    backgroundElements.style.width = '100%';
    backgroundElements.style.height = '100%';
    backgroundElements.style.pointerEvents = 'none';
    backgroundElements.style.zIndex = '-1';
    backgroundElements.style.overflow = 'hidden';
    
    articleContainer.style.position = 'relative';
    articleContainer.appendChild(backgroundElements);
    
    // 创建5个随机漂浮元素
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        const emoji = natureEmojis[Math.floor(Math.random() * natureEmojis.length)];
        
        element.textContent = emoji;
        element.style.position = 'absolute';
        element.style.fontSize = (Math.random() * 20 + 10) + 'px';
        element.style.opacity = '0.1';
        element.style.left = (Math.random() * 100) + '%';
        element.style.top = (Math.random() * 100) + '%';
        element.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        element.style.transition = 'all ' + (Math.random() * 10 + 10) + 's ease-in-out';
        
        backgroundElements.appendChild(element);
        
        // 随机移动动画
        setInterval(() => {
            element.style.left = (Math.random() * 100) + '%';
            element.style.top = (Math.random() * 100) + '%';
            element.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        }, Math.random() * 10000 + 5000);
    }
}

// 页面加载完成后执行动画
window.addEventListener('load', animateSVG);

/**
 * 初始化所有图片轮播组件
 */
function initializeImageCarousels() {
    const carousels = document.querySelectorAll('.image-carousel');
    
    carousels.forEach(carousel => {
        const wrapper = carousel.querySelector('.carousel-wrapper');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.closest('.image-carousel-container').querySelectorAll('.dot');
        let startX, moveX, currentIndex = 0;
        let isDown = false;
        
        if (!wrapper || slides.length === 0) return;
        
        // 触摸事件监听
        wrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
        wrapper.addEventListener('touchmove', handleTouchMove, { passive: true });
        wrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // 鼠标事件监听（桌面设备）
        wrapper.addEventListener('mousedown', handleDragStart);
        wrapper.addEventListener('mousemove', handleDragMove);
        wrapper.addEventListener('mouseup', handleDragEnd);
        wrapper.addEventListener('mouseleave', handleDragEnd);
        
        // 监听滚动事件来更新指示点
        wrapper.addEventListener('scroll', updateActiveDot);
        
        // 设置初始状态
        updateDots(0);
        
        // 触摸开始事件处理
        function handleTouchStart(e) {
            isDown = true;
            startX = e.touches[0].clientX;
            wrapper.style.transition = 'none';
        }
        
        // 触摸移动事件处理
        function handleTouchMove(e) {
            if (!isDown) return;
            moveX = e.touches[0].clientX;
        }
        
        // 触摸结束事件处理
        function handleTouchEnd() {
            isDown = false;
            wrapper.style.transition = 'transform 0.4s ease';
            
            // 检测滑动方向和距离以决定是否切换幻灯片
            if (startX && moveX) {
                const threshold = 50; // 滑动阈值
                const diff = startX - moveX;
                
                if (Math.abs(diff) > threshold) {
                    if (diff > 0 && currentIndex < slides.length - 1) {
                        // 向左滑动
                        currentIndex++;
                    } else if (diff < 0 && currentIndex > 0) {
                        // 向右滑动
                        currentIndex--;
                    }
                }
                
                // 重置
                startX = null;
                moveX = null;
            }
        }
        
        // 鼠标拖拽事件
        function handleDragStart(e) {
            isDown = true;
            startX = e.clientX;
            wrapper.style.transition = 'none';
            e.preventDefault();
        }
        
        function handleDragMove(e) {
            if (!isDown) return;
            e.preventDefault();
            moveX = e.clientX;
        }
        
        function handleDragEnd(e) {
            if (!isDown) return;
            
            handleTouchEnd(); // 复用触摸结束逻辑
            isDown = false;
        }
        
        // 更新当前活动的指示点
        function updateActiveDot() {
            if (!dots || dots.length === 0) return;
            
            const scrollPosition = wrapper.scrollLeft;
            const slideWidth = slides[0].offsetWidth;
            const newIndex = Math.round(scrollPosition / slideWidth);
            
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateDots(currentIndex);
            }
        }
        
        // 更新指示点状态
        function updateDots(index) {
            if (!dots || dots.length === 0) return;
            
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    });
    
    // 为指示点添加点击事件
    setupIndicatorDots();
}

/**
 * 设置指示点的点击事件
 */
function setupIndicatorDots() {
    const carouselContainers = document.querySelectorAll('.image-carousel-container');
    
    carouselContainers.forEach(container => {
        const dots = container.querySelectorAll('.dot');
        const wrapper = container.querySelector('.carousel-wrapper');
        const slides = container.querySelectorAll('.carousel-slide');
        
        if (!dots.length || !wrapper || !slides.length) return;
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // 计算滚动位置
                const slideWidth = slides[0].offsetWidth;
                const scrollPosition = index * slideWidth;
                
                // 平滑滚动到对应位置
                wrapper.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
                
                // 更新指示点状态
                dots.forEach((d, i) => {
                    if (i === index) {
                        d.classList.add('active');
                    } else {
                        d.classList.remove('active');
                    }
                });
            });
        });
    });
}

/**
 * 创建图片预加载函数
 */
function preloadCarouselImages() {
    const images = document.querySelectorAll('.carousel-slide img');
    
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preloadImage = new Image();
            preloadImage.src = src;
        }
    });
}

// 页面加载完成后预加载图片
window.addEventListener('load', preloadCarouselImages); 