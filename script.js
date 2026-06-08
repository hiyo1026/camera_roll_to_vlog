/**
 * script.js
 * Camera Roll to Vlog — 動画編集学習サイト
 *
 * 実装機能：
 * 1. ハンバーガーメニュー 開閉
 * 2. ショートカット一覧モーダル 開閉（ESCキー対応）
 * 3. 現在レッスンに応じた進捗表示
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
  initLessonProgress();
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
   4. レッスン番号ベースの進捗表示
   ============================================= */
function initLessonProgress() {
  const progressNum  = document.getElementById("progressNum");
  const progressCount = document.getElementById("progressCount");
  const progressFill = document.getElementById("progressBarFill");
  const progressBar  = document.querySelector(".progress-bar-wrap");
  const currentStep  = document.getElementById("currentStep");
  const guideMessage = document.getElementById("guideMessage");

  const lessons = [
    {
      id: "lesson-01",
      count: "1 / 6",
      percentage: 16,
      title: "LESSON 01 今日つくるVlogを決める",
      guide: "まずは編集ソフトを触る前に、どんな思い出を1本にするか決めましょう。",
    },
    {
      id: "lesson-02",
      count: "2 / 6",
      percentage: 33,
      title: "LESSON 02 写真フォルダから素材を選ぶ",
      guide: "素材は多すぎなくて大丈夫です。見返したい瞬間を中心に選びましょう。",
    },
    {
      id: "lesson-03",
      count: "3 / 6",
      percentage: 50,
      title: "LESSON 03 Premiere Proに素材を読み込む",
      guide: "ここからPremiere Proに入ります。素材フォルダは動かさず進めると安心です。",
    },
    {
      id: "lesson-04",
      count: "4 / 6",
      percentage: 66,
      title: "LESSON 04 タイムラインに並べて流れを作る",
      guide: "完璧な順番を探すより、まず最後まで並べることを優先しましょう。",
    },
    {
      id: "lesson-05",
      count: "5 / 6",
      percentage: 83,
      title: "LESSON 05 BGM・文字・色で整える",
      guide: "仕上げは少しずつ。音、文字、色のどれか一つだけでも印象は変わります。",
    },
    {
      id: "lesson-06",
      count: "6 / 6",
      percentage: 100,
      title: "LESSON 06 書き出して、完成したVlogを見返す",
      guide: "完成ファイルを実際に開いて見返すところまでが、今日のゴールです。",
    },
  ];

  if (!progressNum || !progressFill) return;

  function updateProgress(lesson) {
    progressNum.textContent = lesson.percentage === 100 ? "100%" : `約${lesson.percentage}%`;
    progressFill.style.width = `${lesson.percentage}%`;
    if (progressCount) progressCount.textContent = lesson.count;
    if (currentStep) currentStep.textContent = lesson.title;
    if (guideMessage) guideMessage.textContent = lesson.guide;
    if (progressBar) {
      progressBar.setAttribute("aria-valuenow", lesson.percentage);
    }
  }

  const sections = lessons
    .map((lesson) => document.getElementById(lesson.id))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visibleEntries.length) return;

      const current = lessons.find((lesson) => lesson.id === visibleEntries[0].target.id);
      if (current) updateProgress(current);
    },
    {
      rootMargin: "-25% 0px -45% 0px",
      threshold: [0, 0.25, 0.5, 0.75],
    }
  );

  sections.forEach((section) => observer.observe(section));
  updateProgress(lessons[0]);
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

          tocItems.forEach((item) => {
            const link = item.querySelector(".toc-link");
            if (link) {
              link.toggleAttribute("aria-current", item.dataset.target === id);
            }
          });
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
