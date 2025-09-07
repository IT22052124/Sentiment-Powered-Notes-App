const API_BASE_URL = "http://127.0.0.1:8000";

class NotesApp {
  constructor() {
    this.noteForm = document.getElementById("noteForm");
    this.noteText = document.getElementById("noteText");
    this.submitBtn = document.getElementById("submitBtn");
    this.refreshBtn = document.getElementById("refreshBtn");
    this.notesContainer = document.getElementById("notesContainer");
    this.messageDiv = document.getElementById("message");

    this.init();
  }

  init() {
    this.noteForm.addEventListener("submit", this.handleSubmit.bind(this));
    this.refreshBtn.addEventListener("click", this.loadNotes.bind(this));

    // Load notes on startup
    this.loadNotes();
  }

  async handleSubmit(e) {
    e.preventDefault();

    const text = this.noteText.value.trim();
    if (!text) {
      this.showMessage("Please enter some text for your note.", "error");
      return;
    }

    this.setLoading(true);
    console.log("Creating note with text:", text);

    try {
      const response = await fetch(`${API_BASE_URL}/notes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const note = await response.json();
      this.showMessage("Note created successfully! ✨", "success");
      this.noteText.value = "";
      this.loadNotes(); // Refresh the notes list
    } catch (error) {
      console.error("Error creating note:", error);
      this.showMessage(
        "Failed to create note. Please check if your API server is running.",
        "error"
      );
    } finally {
      this.setLoading(false);
    }
  }

  async loadNotes() {
    this.notesContainer.innerHTML =
      '<div class="loading"><div class="loading-spinner"></div></div>';

    try {
      const response = await fetch(`${API_BASE_URL}/notes/`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const notes = await response.json();
      this.renderNotes(notes);
    } catch (error) {
      console.error("Error loading notes:", error);
      this.notesContainer.innerHTML = `
                        <div class="error-message">
                            Failed to load notes. Please check if your API server is running on ${API_BASE_URL}
                        </div>
                    `;
    }
  }

  renderNotes(notes) {
    if (notes.length === 0) {
      this.notesContainer.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">📝</div>
                            <h3>No notes yet</h3>
                            <p>Create your first note to get started!</p>
                        </div>
                    `;
      return;
    }

    const notesHtml = notes.map((note) => this.renderNote(note)).join("");
    this.notesContainer.innerHTML = `<div class="notes-grid">${notesHtml}</div>`;
  }

  renderNote(note) {
    const sentimentClass = note.sentiment.toLowerCase();
    const sentimentEmoji = note.sentiment === "POSITIVE" ? "😊" : "😔";

    return `
                    <div class="note-item ${sentimentClass}">
                        <div class="note-header">
                            <span class="note-id">#${note.id}</span>
                            <span class="sentiment-badge ${sentimentClass}">
                                <span>${sentimentEmoji}</span>
                                ${note.sentiment}
                            </span>
                        </div>
                        <div class="note-text">${this.escapeHtml(
                          note.text
                        )}</div>
                    </div>
                `;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  showMessage(message, type = "success") {
    const className = type === "success" ? "success-message" : "error-message";
    this.messageDiv.innerHTML = `<div class="${className}">${message}</div>`;

    // Clear message after 5 seconds
    setTimeout(() => {
      this.messageDiv.innerHTML = "";
    }, 5000);
  }

  setLoading(loading) {
    if (loading) {
      this.submitBtn.disabled = true;
      this.submitBtn.innerHTML =
        '<div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div> Creating...';
    } else {
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = "<span>✍️</span> Create Note";
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new NotesApp();
});
