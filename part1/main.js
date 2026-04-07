let inventory = [
    {
        id: 1,
        name: "MacBook Pro",
        category: "Electronics",
        quantity: 15,
        price: 1999.99,
        supplier: "Apple Inc.",
        stockStatus: "In Stock",
        popular: "Yes",
        comment: "Best seller"
    },
    {
        id: 2,
        name: "Office Desk",
        category: "Furniture",
        quantity: 3,
        price: 299.99,
        supplier: "IKEA",
        stockStatus: "Low Stock",
        popular: "No",
        comment: ""
    },
    {
        id: 3,
        name: "Wireless Mouse",
        category: "Electronics",
        quantity: 50,
        price: 29.99,
        supplier: "Logitech",
        stockStatus: "In Stock",
        popular: "Yes",
        comment: "Customer favorite"
    },
    {
        id: 4,
        name: "Gaming Chair",
        category: "Furniture",
        quantity: 0,
        price: 399.99,
        supplier: "Secretlab",
        stockStatus: "Out of Stock",
        popular: "Yes",
        comment: "High demand"
    }
];
// ============================================
// Global State Variables
// ============================================
let currentSearchTerm = '';
let isShowingPopularOnly = false;
// ============================================
// DOM Element References
// ============================================
const messageArea = document.getElementById('messageArea');
const inventoryList = document.getElementById('inventoryList');
const searchInput = document.getElementById('searchInput');
// ============================================
// Helper Functions
// ============================================
// Display message to user
function showMessage(message, isError = false) {
    messageArea.innerHTML = `<div style="color: ${isError ? '#dc2626' : '#166534'}">${message}</div>`;
    setTimeout(() => {
        if (messageArea.innerHTML.includes(message)) {
            messageArea.innerHTML = '';
        }
    }, 3000);
}
// Escape HTML to prevent XSS attacks
function escapeHtml(str) {
    if (!str)
        return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
// Get color for stock status display
function getStockColor(status) {
    switch (status) {
        case 'In Stock': return '#16a34a';
        case 'Low Stock': return '#eab308';
        case 'Out of Stock': return '#dc2626';
        default: return '#1e293b';
    }
}
// Get filtered items based on search term and popular filter
function getFilteredItems() {
    let filtered = [...inventory];
    if (isShowingPopularOnly) {
        filtered = filtered.filter(item => item.popular === 'Yes');
    }
    if (currentSearchTerm) {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(currentSearchTerm.toLowerCase()));
    }
    return filtered;
}
// Update the display based on current filters
function updateDisplay() {
    const filteredItems = getFilteredItems();
    renderInventory(filteredItems);
    let statusMessage = '';
    if (isShowingPopularOnly && currentSearchTerm) {
        statusMessage = `Showing popular items matching "${currentSearchTerm}"`;
    }
    else if (isShowingPopularOnly) {
        statusMessage = 'Showing popular items only';
    }
    else if (currentSearchTerm) {
        statusMessage = `Showing items matching "${currentSearchTerm}"`;
    }
    else {
        statusMessage = `Showing all ${inventory.length} items`;
    }
    if (filteredItems.length !== inventory.length) {
        statusMessage += ` (${filteredItems.length} results)`;
    }
    showMessage(statusMessage);
}
// ============================================
// Render Functions
// ============================================
// Render inventory items as HTML table
function renderInventory(items) {
    if (!items.length) {
        let message = 'No items to display.';
        if (isShowingPopularOnly) {
            message = 'No popular items found.';
        }
        else if (currentSearchTerm) {
            message = `No items found matching "${currentSearchTerm}".`;
        }
        inventoryList.innerHTML = `<p>${message}</p>`;
        return;
    }
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Supplier</th>
                <th>Stock</th>
                <th>Popular</th>
                <th>Comment</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${items.map(item => `
                <tr>
                    <td>${item.id}</td>
                    <td>${escapeHtml(item.name)}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${escapeHtml(item.supplier)}</td>
                    <td style="color: ${getStockColor(item.stockStatus)}; font-weight: 500;">
                        ${item.stockStatus}
                    </td>
                    <td style="background: ${item.popular === 'Yes' ? '#fef3c7' : 'transparent'};">
                        ${item.popular}
                    </td>
                    <td>${escapeHtml(item.comment || '-')}</td>
                    <td>
                        <button class="edit-btn" data-name="${escapeHtml(item.name)}">Edit</button>
                        <button class="delete-btn" data-name="${escapeHtml(item.name)}">Delete</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    inventoryList.innerHTML = '';
    inventoryList.appendChild(table);
    // Attach delete event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            if (name)
                deleteItemByName(name);
        });
    });
    // Attach edit event listeners to edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            if (name)
                fillFormForEdit(name);
        });
    });
}
// ============================================
// Core CRUD Operations
// ============================================
// Show all items (clear filters)
function showAllItems() {
    currentSearchTerm = '';
    isShowingPopularOnly = false;
    if (searchInput)
        searchInput.value = '';
    updateDisplay();
}
// Show only popular items
function showPopularItems() {
    currentSearchTerm = '';
    isShowingPopularOnly = true;
    if (searchInput)
        searchInput.value = '';
    updateDisplay();
}
// Search items by name
function searchItems() {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        showMessage('Please enter a search term.', true);
        return;
    }
    currentSearchTerm = searchTerm;
    isShowingPopularOnly = false;
    updateDisplay();
}
// Reset search and show all items
function resetSearch() {
    currentSearchTerm = '';
    isShowingPopularOnly = false;
    if (searchInput)
        searchInput.value = '';
    updateDisplay();
}
// Add new item to inventory
function addItem() {
    const idInput = document.getElementById('itemId');
    const nameInput = document.getElementById('itemName');
    const categorySelect = document.getElementById('category');
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('price');
    const supplierInput = document.getElementById('supplier');
    const stockStatusSelect = document.getElementById('stockStatus');
    const popularSelect = document.getElementById('popular');
    const commentInput = document.getElementById('comment');
    const id = parseInt(idInput.value);
    const name = nameInput.value.trim();
    const category = categorySelect.value;
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceInput.value);
    const supplier = supplierInput.value.trim();
    const stockStatus = stockStatusSelect.value;
    const popular = popularSelect.value;
    const comment = commentInput.value.trim();
    // Validation checks
    if (!name || !category || !supplier) {
        showMessage('Please fill all required fields (Name, Category, Supplier).', true);
        return;
    }
    if (isNaN(id) || id <= 0) {
        showMessage('Please enter a valid positive ID.', true);
        return;
    }
    if (inventory.some(item => item.id === id)) {
        showMessage(`Item ID ${id} already exists. Please use a unique ID.`, true);
        return;
    }
    if (inventory.some(item => item.name.toLowerCase() === name.toLowerCase())) {
        showMessage(`Item name "${name}" already exists. Please use a unique name.`, true);
        return;
    }
    if (isNaN(quantity) || quantity < 0) {
        showMessage('Quantity must be a non-negative number.', true);
        return;
    }
    if (isNaN(price) || price < 0) {
        showMessage('Price must be a non-negative number.', true);
        return;
    }
    const newItem = {
        id,
        name,
        category,
        quantity,
        price,
        supplier,
        stockStatus,
        popular,
        comment: comment || undefined
    };
    inventory.push(newItem);
    resetSearch();
    showMessage(`Item "${name}" added successfully.`);
    clearForm();
}
// Delete item by name with confirmation
function deleteItemByName(name) {
    const item = inventory.find(i => i.name === name);
    if (!item) {
        showMessage(`Item "${name}" not found.`, true);
        return;
    }
    const confirmDelete = confirm(`Are you sure you want to delete item "${name}"?`);
    if (confirmDelete) {
        inventory = inventory.filter(i => i.name !== name);
        updateDisplay();
        showMessage(`Item "${name}" deleted successfully.`);
        clearForm();
    }
}
// Fill form with item data for editing
function fillFormForEdit(name) {
    const item = inventory.find(i => i.name === name);
    if (!item) {
        showMessage(`Item "${name}" not found.`, true);
        return;
    }
    const idInput = document.getElementById('itemId');
    const nameInput = document.getElementById('itemName');
    const categorySelect = document.getElementById('category');
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('price');
    const supplierInput = document.getElementById('supplier');
    const stockStatusSelect = document.getElementById('stockStatus');
    const popularSelect = document.getElementById('popular');
    const commentInput = document.getElementById('comment');
    idInput.value = item.id.toString();
    nameInput.value = item.name;
    categorySelect.value = item.category;
    quantityInput.value = item.quantity.toString();
    priceInput.value = item.price.toString();
    supplierInput.value = item.supplier;
    stockStatusSelect.value = item.stockStatus;
    popularSelect.value = item.popular;
    commentInput.value = item.comment || '';
    showMessage(`Editing item "${name}". Click Update Item to save changes.`);
}
// Update existing item by name
function updateItem() {
    const nameInput = document.getElementById('itemName');
    const itemName = nameInput.value.trim();
    if (!itemName) {
        showMessage('Please enter an item name to update.', true);
        return;
    }
    const existingItemIndex = inventory.findIndex(i => i.name === itemName);
    if (existingItemIndex === -1) {
        showMessage(`Item "${itemName}" not found. Cannot update.`, true);
        return;
    }
    const idInput = document.getElementById('itemId');
    const categorySelect = document.getElementById('category');
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('price');
    const supplierInput = document.getElementById('supplier');
    const stockStatusSelect = document.getElementById('stockStatus');
    const popularSelect = document.getElementById('popular');
    const commentInput = document.getElementById('comment');
    const newId = parseInt(idInput.value);
    const newCategory = categorySelect.value;
    const newQuantity = parseInt(quantityInput.value);
    const newPrice = parseFloat(priceInput.value);
    const newSupplier = supplierInput.value.trim();
    const newStockStatus = stockStatusSelect.value;
    const newPopular = popularSelect.value;
    const newComment = commentInput.value.trim();
    // Validation checks
    if (!newCategory || !newSupplier) {
        showMessage('Please fill all required fields (Category, Supplier).', true);
        return;
    }
    if (isNaN(newId) || newId <= 0) {
        showMessage('Please enter a valid positive ID.', true);
        return;
    }
    if (newId !== inventory[existingItemIndex].id && inventory.some(i => i.id === newId)) {
        showMessage(`Item ID ${newId} already exists on another item. Please use a unique ID.`, true);
        return;
    }
    if (isNaN(newQuantity) || newQuantity < 0) {
        showMessage('Quantity must be a non-negative number.', true);
        return;
    }
    if (isNaN(newPrice) || newPrice < 0) {
        showMessage('Price must be a non-negative number.', true);
        return;
    }
    inventory[existingItemIndex] = {
        id: newId,
        name: itemName,
        category: newCategory,
        quantity: newQuantity,
        price: newPrice,
        supplier: newSupplier,
        stockStatus: newStockStatus,
        popular: newPopular,
        comment: newComment || undefined
    };
    resetSearch();
    showMessage(`Item "${itemName}" updated successfully.`);
    clearForm();
}
// Clear all form fields
function clearForm() {
    const idInput = document.getElementById('itemId');
    const nameInput = document.getElementById('itemName');
    const categorySelect = document.getElementById('category');
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('price');
    const supplierInput = document.getElementById('supplier');
    const stockStatusSelect = document.getElementById('stockStatus');
    const popularSelect = document.getElementById('popular');
    const commentInput = document.getElementById('comment');
    idInput.value = '';
    nameInput.value = '';
    categorySelect.value = '';
    quantityInput.value = '';
    priceInput.value = '';
    supplierInput.value = '';
    stockStatusSelect.value = 'In Stock';
    popularSelect.value = 'No';
    commentInput.value = '';
}
// ============================================
// Initialization
// ============================================
function init() {
    updateDisplay();
    const addBtn = document.getElementById('addBtn');
    if (addBtn)
        addBtn.onclick = addItem;
    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn)
        updateBtn.onclick = updateItem;
    const showAllBtn = document.getElementById('showAllBtn');
    if (showAllBtn)
        showAllBtn.onclick = () => showAllItems();
    const showPopularBtn = document.getElementById('showPopularBtn');
    if (showPopularBtn)
        showPopularBtn.onclick = () => showPopularItems();
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn)
        searchBtn.onclick = () => searchItems();
    const resetSearchBtn = document.getElementById('resetSearchBtn');
    if (resetSearchBtn)
        resetSearchBtn.onclick = () => resetSearch();
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchItems();
            }
        });
    }
}
// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
