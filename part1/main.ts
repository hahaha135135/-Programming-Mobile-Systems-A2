interface InventoryItem {
    id: number;
    name: string;
    category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
    quantity: number;
    price: number;
    supplier: string;
    stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
    popular: 'Yes' | 'No';
    comment?: string;
}

let inventory: InventoryItem[] = [
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
    }
];

const messageArea = document.getElementById('messageArea') as HTMLDivElement;
const inventoryList = document.getElementById('inventoryList') as HTMLDivElement;

function showMessage(message: string, isError: boolean = false): void {
    messageArea.innerHTML = `<div style="color: ${isError ? '#dc2626' : '#166534'}">${message}</div>`;
    setTimeout(() => {
        if (messageArea.innerHTML.includes(message)) {
            messageArea.innerHTML = '';
        }
    }, 3000);
}

function renderInventory(items: InventoryItem[]): void {
    if (!items.length) {
        inventoryList.innerHTML = '<p>No items to display.</p>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr><th>ID</th><th>Name</th><th>Category</th><th>Qty</th><th>Price</th><th>Supplier</th><th>Stock</th><th>Popular</th><th>Comment</th><th>Actions</th></tr>
        </thead>
        <tbody>
            ${items.map(item => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${item.supplier}</td>
                    <td>${item.stockStatus}</td>
                    <td>${item.popular}</td>
                    <td>${item.comment || '-'}</td>
                    <td>
                        <button class="edit-btn" data-name="${item.name}">Edit</button>
                        <button class="delete-btn" data-name="${item.name}">Delete</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    inventoryList.innerHTML = '';
    inventoryList.appendChild(table);

    // Attach delete event listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = (e.target as HTMLButtonElement).getAttribute('data-name');
            if (name) deleteItemByName(name);
        });
    });

    // Attach edit event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = (e.target as HTMLButtonElement).getAttribute('data-name');
            if (name) fillFormForEdit(name);
        });
    });
}

function showAllItems(): void {
    renderInventory(inventory);
    showMessage(`Showing ${inventory.length} items`);
}

function addItem(): void {
    const idInput = document.getElementById('itemId') as HTMLInputElement;
    const nameInput = document.getElementById('itemName') as HTMLInputElement;
    const categorySelect = document.getElementById('category') as HTMLSelectElement;
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;
    const priceInput = document.getElementById('price') as HTMLInputElement;
    const supplierInput = document.getElementById('supplier') as HTMLInputElement;
    const stockStatusSelect = document.getElementById('stockStatus') as HTMLSelectElement;
    const popularSelect = document.getElementById('popular') as HTMLSelectElement;
    const commentInput = document.getElementById('comment') as HTMLInputElement;

    const id = parseInt(idInput.value);
    const name = nameInput.value.trim();
    const category = categorySelect.value as InventoryItem['category'];
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceInput.value);
    const supplier = supplierInput.value.trim();
    const stockStatus = stockStatusSelect.value as InventoryItem['stockStatus'];
    const popular = popularSelect.value as InventoryItem['popular'];
    const comment = commentInput.value.trim();

    // Validation
    if (!name || !category || !supplier) {
        showMessage('Please fill all required fields.', true);
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
    if (isNaN(quantity) || quantity < 0) {
        showMessage('Quantity must be a non-negative number.', true);
        return;
    }
    if (isNaN(price) || price < 0) {
        showMessage('Price must be a non-negative number.', true);
        return;
    }

    const newItem: InventoryItem = {
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
    showAllItems();
    showMessage(`Item "${name}" added successfully.`);

    // Clear form
    clearForm();
}

function deleteItemByName(name: string): void {
    const item = inventory.find(i => i.name === name);
    if (!item) {
        showMessage(`Item "${name}" not found.`, true);
        return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete item "${name}"?`);
    if (confirmDelete) {
        inventory = inventory.filter(i => i.name !== name);
        showAllItems();
        showMessage(`Item "${name}" deleted successfully.`);
    }
}

function fillFormForEdit(name: string): void {
    const item = inventory.find(i => i.name === name);
    if (!item) {
        showMessage(`Item "${name}" not found.`, true);
        return;
    }

    const idInput = document.getElementById('itemId') as HTMLInputElement;
    const nameInput = document.getElementById('itemName') as HTMLInputElement;
    const categorySelect = document.getElementById('category') as HTMLSelectElement;
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;
    const priceInput = document.getElementById('price') as HTMLInputElement;
    const supplierInput = document.getElementById('supplier') as HTMLInputElement;
    const stockStatusSelect = document.getElementById('stockStatus') as HTMLSelectElement;
    const popularSelect = document.getElementById('popular') as HTMLSelectElement;
    const commentInput = document.getElementById('comment') as HTMLInputElement;

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

function updateItem(): void {
    const nameInput = document.getElementById('itemName') as HTMLInputElement;
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

    const idInput = document.getElementById('itemId') as HTMLInputElement;
    const categorySelect = document.getElementById('category') as HTMLSelectElement;
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;
    const priceInput = document.getElementById('price') as HTMLInputElement;
    const supplierInput = document.getElementById('supplier') as HTMLInputElement;
    const stockStatusSelect = document.getElementById('stockStatus') as HTMLSelectElement;
    const popularSelect = document.getElementById('popular') as HTMLSelectElement;
    const commentInput = document.getElementById('comment') as HTMLInputElement;

    const newId = parseInt(idInput.value);
    const newCategory = categorySelect.value as InventoryItem['category'];
    const newQuantity = parseInt(quantityInput.value);
    const newPrice = parseFloat(priceInput.value);
    const newSupplier = supplierInput.value.trim();
    const newStockStatus = stockStatusSelect.value as InventoryItem['stockStatus'];
    const newPopular = popularSelect.value as InventoryItem['popular'];
    const newComment = commentInput.value.trim();

    // Validation
    if (!newCategory || !newSupplier) {
        showMessage('Please fill all required fields.', true);
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

    showAllItems();
    showMessage(`Item "${itemName}" updated successfully.`);
    clearForm();
}

function clearForm(): void {
    const idInput = document.getElementById('itemId') as HTMLInputElement;
    const nameInput = document.getElementById('itemName') as HTMLInputElement;
    const categorySelect = document.getElementById('category') as HTMLSelectElement;
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;
    const priceInput = document.getElementById('price') as HTMLInputElement;
    const supplierInput = document.getElementById('supplier') as HTMLInputElement;
    const stockStatusSelect = document.getElementById('stockStatus') as HTMLSelectElement;
    const popularSelect = document.getElementById('popular') as HTMLSelectElement;
    const commentInput = document.getElementById('comment') as HTMLInputElement;

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

function init(): void {
    showAllItems();
    
    const addBtn = document.getElementById('addBtn');
    if (addBtn) addBtn.onclick = addItem;
    
    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn) updateBtn.onclick = updateItem;
    
    const showAllBtn = document.getElementById('showAllBtn');
    if (showAllBtn) showAllBtn.onclick = () => showAllItems();
}

document.addEventListener('DOMContentLoaded', init);