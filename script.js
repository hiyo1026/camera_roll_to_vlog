/**
 * script.js
 * Camera Roll to Vlog — 動画編集学習サイト
 *
 * 実装機能：
 * 1. ハンバーガーメニュー 開閉
 * 2. ショートカット一覧モーダル 開閉（ESCキー対応）
 * 3. スクロール進捗バー 更新
 * 4. 現在セクションの 自動ハイライト（目次）
 * 5. アコーディオン UI（FAQ / レスキュー）
 * 6. フェードイン アニメーション（Intersection Observer）
 * 7. スムーススクロール（CSS scroll-behavior のフォールバック）
 */

/* =============================================
   DOMContentLoaded — ページ読み込み完了後に実行
   ============================================= */
document.addEventListener("DOMContentLoaded", () => {
  initHamburger();
  initModal();
  initScrollProgress();
  initTocHighlight();
  initAccordions();
  initFadeIn();
  initMobileMenuClose();
});

/* =============================================
   1. ハンバーガーメニュー
   ============================================= */
function initHamburger() {
  const btn  = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("mobileMenu");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    // 開いているかどうかを判定
    const isOpen = btn.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  function openMenu() {
    btn.classList.add("is-open");
    menu.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    btn.classList.remove("is-open");
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
  }

  // グローバルに公開（他の関数から呼べるように）
  window.__closeHamburger = closeMenu;
}

/* =============================================
   2. モバイルメニュー内リンクをクリック時に自動で閉じる
   ============================================= */
function initMobileMenuClose() {
  const menu = document.getElementById("mobileMenu");
  if (!menu) return;

  // メニュー内のリンク・ボタンをすべて取得
  const links = menu.querySelectorAll("a, button");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      // ハンバーガーを閉じる
      if (window.__closeHamburger) window.__closeHamburger();
    });
  });
}

/* =============================================
   3. ショートカット一覧モーダル
   ============================================= */
function initModal() {
  // モーダルを開くボタン（PC ヘッダー + モバイルメニュー）
  const openBtns = [
    document.getElementById("shortcutBtn"),
    document.getElementById("shortcutBtnMobile"),
  ].filter(Boolean); // null を除外

  const modal     = document.getElementById("shortcutModal");
  const closeBtn  = document.getElementById("modalClose");

  if (!modal) return;

  // モーダルを開く
  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open"); // 背景スクロール禁止
    // フォーカスを閉じるボタンに移動（アクセシビリティ）
    if (closeBtn) closeBtn.focus();
  }

  // モーダルを閉じる
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open"); // 背景スクロール解除
  }

  // 開くボタンにイベントを登録
  openBtns.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  // 閉じるボタン
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // オーバーレイ（背景）をクリックしても閉じる
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC キーで閉じる
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

/* =============================================
   4. スクロール進捗バー
   ============================================= */
function initScrollProgress() {
  const progressNum  = document.getElementById("progressNum");
  const progressFill = document.getElementById("progressBarFill");
  const progressBar  = document.querySelector(".progress-bar-wrap");

  if (!progressNum || !progressFill) return;

  function updateProgress() {
    // ページ全体の高さからビューポートの高さを引いた値が最大スクロール量
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const maxScroll    = docHeight - windowHeight;

    // 0〜100 の間でパーセンテージを計算
    const percentage = maxScroll > 0
      ? Math.min(100, Math.round((scrollTop / maxScroll) * 100))
      : 0;

    // 表示を更新
    progressNum.textContent = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;

    // aria 属性も更新（スクリーンリーダー対応）
    if (progressBar) {
      progressBar.setAttribute("aria-valuenow", percentage);
    }
  }

  // スクロールイベントで呼び出す
  // パフォーマンスのために requestAnimationFrame を使用
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  });

  // 初回実行
  updateProgress();
}

/* =============================================
   5. 目次の自動ハイライト（現在セクション検出）
   ============================================= */
function initTocHighlight() {
  // 監視対象のセクション ID の配列
  const sectionIds = [
    "lesson-01",
    "lesson-02",
    "lesson-03",
    "lesson-04",
    "lesson-05",
    "lesson-06",
  ];

  const tocList = document.getElementById("tocList");
  if (!tocList) return;

  // セクション要素と目次アイテムを取得
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const tocItems = tocList.querySelectorAll(".toc-item");

  // 「どのセクションが見えているか」を IntersectionObserver で追跡
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;

        if (entry.isIntersecting) {
          // アクティブ状態を更新
          tocItems.forEach((item) => {
            const isTarget = item.dataset.target === id;
            item.classList.toggle("is-active", isTarget);
          });

          // 過去のセクションに「完了」マークをつける
          markCompletedSections(id, sectionIds, tocItems);
        }
      });
    },
    {
      // ビューポートの上から20%の位置で切り替え
      rootMargin: `-${document.querySelector(".site-header")?.offsetHeight || 60}px 0px -60% 0px`,
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));

  /**
   * 現在地より前のセクションを「完了済み」としてマーク
   */
  function markCompletedSections(currentId, ids, items) {
    const currentIndex = ids.indexOf(currentId);
    items.forEach((item, idx) => {
      const check = item.querySelector(".toc-check");
      if (idx < currentIndex) {
        item.classList.add("is-done");
        if (check) check.textContent = "✓";
        if (check) check.setAttribute("aria-label", "完了");
      } else {
        // 現在地以降は未完了に戻す（ページを上に戻したとき）
        if (idx > currentIndex) {
          item.classList.remove("is-done");
          if (check) check.textContent = "";
          if (check) check.setAttribute("aria-label", "未完了");
        }
      }
    });
  }
}

/* =============================================
   6. アコーディオン UI（FAQ + レスキュー共通）
   ============================================= */
function initAccordions() {
  // FAQ
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((btn) => {
    btn.addEventListener("click", () => toggleAccordion(btn, "faq-answer"));
  });

  // レスキュー
  const rescueQuestions = document.querySelectorAll(".rescue-question");
  rescueQuestions.forEach((btn) => {
    btn.addEventListener("click", () => toggleAccordion(btn, "rescue-answer"));
  });
}

/**
 * アコーディオンの開閉トグル
 * @param {HTMLButtonElement} btn - クリックされたボタン
 * @param {string} answerClass   - 回答エリアのクラス名（スタイル参照用）
 */
function toggleAccordion(btn, answerClass) {
  const isExpanded = btn.getAttribute("aria-expanded") === "true";
  const targetId   = btn.getAttribute("aria-controls");
  const answer     = document.getElementById(targetId);

  if (!answer) return;

  if (isExpanded) {
    // 閉じる
    btn.setAttribute("aria-expanded", "false");
    answer.hidden = true;
  } else {
    // 開く
    btn.setAttribute("aria-expanded", "true");
    answer.hidden = false;
  }
}

/* =============================================
   7. フェードイン アニメーション（Intersection Observer）
   ============================================= */
function initFadeIn() {
  const fadeTargets = document.querySelectorAll(".fade-in");

  if (!fadeTargets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // ビューポートに入ったら visible クラスを付与してフェードイン
          entry.target.classList.add("visible");
          // 一度表示したら監視を外す（パフォーマンス向上）
          observer.unobserve(entry.target);
        }
      });
    },
    {
      // 要素が10%見えたらトリガー
      threshold: 0.1,
      // ヘッダー分だけ上マージンを補正
      rootMargin: "-40px 0px 0px 0px",
    }
  );

  fadeTargets.forEach((target) => observer.observe(target));
}

/* =============================================
   補足：スムーススクロール（CSS サポートのフォールバック）
   ============================================= */
// CSS に scroll-behavior: smooth を設定済みのため、
// JS による実装は基本的に不要ですが、
// 古いブラウザ向けに簡易実装しています。
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    // CSS scroll-behavior: smooth が効かない環境向けフォールバック
    if (!("scrollBehavior" in document.documentElement.style)) {
      e.preventDefault();
      const headerHeight = document.querySelector(".site-header")?.offsetHeight || 60;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }
  });
});
