class AjaxDataTable {
  constructor(config) {
    this.tableId = config.tableId;
    this.baseUrl = config.baseUrl;
    this.columns = config.columns || [];
    this.currentPage = 1;
    this.limit = config.limit || 10;
    this.totalPages = 0;
    this.totalRecords = 0;
    this.paginationContainerId =
      config.paginationContainerId || "paginationControls";
    this.itemsPerPageId = config.itemsPerPageId || "itemsPerPage";
    this.showingFromId = config.showingFromId || "showingFrom";
    this.showingToId = config.showingToId || "showingTo";
    this.totalRecordsId = config.totalRecordsId || "totalRecords";
    this.formatters = config.formatters || {};
    this.initialize();
  }

  getApiUrl() {
    return `${this.baseUrl}?page=${this.currentPage}&limit=${this.limit}`;
  }

  async initialize() {
    this.setupEventListeners();
    await this.loadData();
  }

  setupEventListeners() {
    // Items per page change handler
    const itemsPerPageElement = document.getElementById(this.itemsPerPageId);
    if (itemsPerPageElement) {
      itemsPerPageElement.addEventListener("change", async (e) => {
        this.limit = parseInt(e.target.value);
        this.currentPage = 1;
        await this.loadData();
      });
    }
  }

  updatePaginationControls() {
    const controls = document.getElementById(this.paginationContainerId);
    if (!controls) return;

    controls.innerHTML = "";

    // First page button
    const firstButton = this.createPaginationButton(
      "<<",
      1,
      this.currentPage === 1
    );
    controls.appendChild(firstButton);

    // Previous page button
    const prevButton = this.createPaginationButton(
      "<",
      this.currentPage - 1,
      this.currentPage === 1
    );
    controls.appendChild(prevButton);

    // Page numbers
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      const pageButton = this.createPaginationButton(
        i.toString(),
        i,
        false,
        this.currentPage === i
      );
      controls.appendChild(pageButton);
    }

    // Next page button
    const nextButton = this.createPaginationButton(
      ">",
      this.currentPage + 1,
      this.currentPage === this.totalPages
    );
    controls.appendChild(nextButton);

    // Last page button
    const lastButton = this.createPaginationButton(
      ">>",
      this.totalPages,
      this.currentPage === this.totalPages
    );
    controls.appendChild(lastButton);
  }

  createPaginationButton(text, page, disabled = false, active = false) {
    const button = document.createElement("button");
    button.className = `pagination-button ${active ? "active" : ""}`;
    button.textContent = text;
    button.disabled = disabled;

    if (!disabled) {
      button.addEventListener("click", async () => {
        this.currentPage = page;
        await this.loadData();
      });
    }

    return button;
  }

  updatePaginationInfo(pagination) {
    const showingFrom = (this.currentPage - 1) * this.limit + 1;
    const showingTo = Math.min(
      this.currentPage * this.limit,
      pagination.total_records
    );

    this.setElementText(this.showingFromId, showingFrom);
    this.setElementText(this.showingToId, showingTo);
    this.setElementText(this.totalRecordsId, pagination.total_records);

    this.totalPages = pagination.total_pages;
    this.totalRecords = pagination.total_records;

    this.updatePaginationControls();
  }

  setElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text;
    }
  }

  async loadData() {
    try {
      const response = await fetch(this.getApiUrl(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        this.updateTable(data.data);
        this.updatePaginationInfo(data.pagination);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  // Default formatters
  defaultFormatters = {
    date: (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    status: (status) => {
      if (!status) return "-";
      const className = `status-badge status-${status.toLowerCase()}`;
      return `<span class="${className}">${status}</span>`;
    },
  };

  updateTable(data) {
    const tbody = document.querySelector(`${this.tableId} tbody`);
    tbody.innerHTML = "";

    data.forEach((item) => {
      const row = document.createElement("tr");
      const rowHtml = this.columns
        .map((column) => {
          const value = column.key
            .split(".")
            .reduce((obj, key) => obj?.[key], item);
          const formatter =
            column.formatter ||
            this.formatters[column.type] ||
            this.defaultFormatters[column.type] ||
            ((val) => val);
          return `<td>${formatter(value, item)}</td>`;
        })
        .join("");
      row.innerHTML = rowHtml;
      tbody.appendChild(row);
    });
  }
}
