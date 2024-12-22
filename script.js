document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const textGrid = document.getElementById("textGrid");
  const newTextBtn = document.getElementById("newTextBtn");
  const modal = document.getElementById("newTextModal");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const closeBtn = document.querySelector(".close-modal");
  const menuItems = document.querySelectorAll(".menu-item");

  // Initial Texts
  let texts = [
    {
      id: 1,
      content: "i love you my dear",
      category: "messages"
    },
    {
      id: 2,
      content: "i miss you so much",
      category: "messages"
    },
    {
      id: 3,
      content: "goodnight sleep tight like the ropes",
      category: "messages"
    },
    {
      id: 4,
      content: "sleep soon my love",
      category: "messages"
    },
    {
      id: 5,
      content: "im not that drunk",
      category: "excuses"
    },
    {
      id: 6,
      content: "im actually not",
      category: "excuses"
    },
    {
      id: 7,
      content: "what are you up to",
      category: "messages"
    },
    {
      id: 8,
      content: "how are you my dear",
      category: "messages"
    },
    {
      id: 9,
      content: "who are you with",
      category: "messages"
    }
  ];

  // Functions
  function renderTexts(category = "all") {
    textGrid.innerHTML = "";
    const filteredTexts =
      category === "all"
        ? texts
        : texts.filter((text) => text.category === category);

    filteredTexts.forEach((text) => {
      const card = createTextCard(text);
      textGrid.appendChild(card);
    });
  }

  function createTextCard(text) {
    const card = document.createElement("div");
    card.className = "text-card";
    card.innerHTML = `
        <div class="text-content">${text.content}</div>
        <div class="card-actions">
            <span class="category-tag">Category: ${
              text.category.charAt(0).toUpperCase() + text.category.slice(1)
            }</span>
            <div class="action-buttons">
                <button class="copy-btn" data-text="${text.content}">
                    <i class="fas fa-copy"></i>
                    Copy Text
                </button>
                <button class="delete-btn" data-id="${text.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    // Add event listeners
    const copyBtn = card.querySelector(".copy-btn");
    copyBtn.addEventListener("click", () => copyText(text.content));

    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteText(text.id));

    return card;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied! 👍");
    } catch (err) {
      showToast("Failed to copy 😕", "error");
    }
  }

  function deleteText(id) {
    texts = texts.filter((text) => text.id !== id);
    renderTexts();
    showToast("Deleted! 🗑️");
  }

  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.querySelector(".toast-message").textContent = message;
    toast.style.display = "block";
    toast.style.backgroundColor =
      type === "success" ? "var(--success-color)" : "var(--error-color)";

    setTimeout(() => {
      toast.style.display = "none";
    }, 2000);
  }

  function addNewText() {
    const content = document.getElementById("textContent").value;
    const category = document.getElementById("textCategory").value;

    if (!content.trim()) {
      showToast("Please enter some text! 📝", "error");
      return;
    }

    const newText = {
      id: Date.now(),
      content: content.trim(),
      category: category
    };

    texts.unshift(newText);
    renderTexts();
    closeModal();
    showToast("Added! ✨");
  }

  function openModal() {
    modal.style.display = "block";
    document.getElementById("textContent").focus();
  }

  function closeModal() {
    modal.style.display = "none";
    document.getElementById("textContent").value = "";
    document.getElementById("textCategory").value = "messages";
  }

  // Event Listeners
  newTextBtn.addEventListener("click", openModal);
  saveBtn.addEventListener("click", addNewText);
  cancelBtn.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Category navigation
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      menuItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      renderTexts(item.dataset.category);
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Close modal with Escape key
    if (e.key === "Escape" && modal.style.display === "block") {
      closeModal();
    }
    // Save with Ctrl/Cmd + Enter in modal
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key === "Enter" &&
      modal.style.display === "block"
    ) {
      addNewText();
    }
    // Open modal with Ctrl/Cmd + N
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault();
      openModal();
    }
  });

  // Initialize
  renderTexts();

  // Save texts to localStorage
  function saveToLocalStorage() {
    localStorage.setItem("drunkTexts", JSON.stringify(texts));
  }

  // Load texts from localStorage
  function loadFromLocalStorage() {
    const savedTexts = localStorage.getItem("drunkTexts");
    if (savedTexts) {
      texts = JSON.parse(savedTexts);
      renderTexts();
    }
  }

  // Save whenever texts change
  ["addNewText", "deleteText"].forEach((funcName) => {
    const originalFunc = window[funcName];
    window[funcName] = function (...args) {
      originalFunc.apply(this, args);
      saveToLocalStorage();
    };
  });

  // Load saved texts on startup
  loadFromLocalStorage();
});
