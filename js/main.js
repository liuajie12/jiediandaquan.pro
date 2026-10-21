/**
 * 节点大全 (JiedianDaquan.pro) - 全局交互脚本
 * 功能：一键复制订阅/节点、卡片实时筛选、移动端抽屉菜单、全局Toast通知
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initCopyButtons();
  initSearchFilter();
  initFilterTabs();
  initBookmark();
});

// 1. 移动端抽屉菜单管理
function initMobileDrawer() {
  const toggleBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
}

// 2. 全局一键复制功能 (支持复制节点、订阅链接、优惠码)
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = button.getAttribute('data-copy');
      const tipText = button.getAttribute('data-tip') || '复制成功！';

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`✅ ${tipText}`);
        
        // 按钮临时变换文字或样式反馈
        const originalText = button.innerHTML;
        button.innerHTML = '已复制!';
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 1800);
      } catch (err) {
        // 降级方案
        fallbackCopy(textToCopy);
        showToast(`✅ ${tipText}`);
      }
    });
  });
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

// 3. 全局 Toast 提示组件
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

// 4. 实时搜索与卡片过滤功能
function initSearchFilter() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.card-grid .material-card, .table-card tbody tr');

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// 5. 快速筛选分类切换
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');
      const items = document.querySelectorAll('[data-category]');

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filterVal === 'all' || cat.includes(filterVal)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// 6. 收藏本站交互
function initBookmark() {
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  if (!bookmarkBtn) return;

  bookmarkBtn.addEventListener('click', () => {
    showToast('按 Ctrl + D (Mac下使用 Cmd + D) 即可快速收藏本站！');
  });
}
