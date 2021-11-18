class BudgetApp {
    switchInput = null;
    descriptionInput = null;
    valueInput = null;
    enterButton = null;
    balanceList = null;
    balanceListIncomes = null;
    balanceListExpenses = null;
    deleteButton = null;
    totalBudgetInfo = null;
    error = null;

    totalBudget = null;
    editedItem = null;

    currency = 'PLN';

    balanceItems = [];

    numberOfItems = 0;
    UiSelectors = {
        switchInput: 'switch',
        descriptionInput: 'description',
        valueInput: 'value',
        enterButton: '[data-enter-button]',
        balanceList: '[data-balance-list]',
        balanceListIncomes: '[data-balance-list-incomes]',
        balanceListExpenses: '[data-balance-list-expenses]',
        itemDescription: '[data-item-description]',
        itemValue: '[data-item-value]',
        totalBudgetInfo: '[data-total-budget]',
        deleteButton: '[data-delete-button]',
        editButton: '[data-edit-button]',

        error: '[data-error]',
    }
    initializeApp() {
        this.enterButton = document.querySelector(this.UiSelectors.enterButton);
        this.descriptionInput = document.getElementById(this.UiSelectors.descriptionInput);
        this.valueInput = document.getElementById(this.UiSelectors.valueInput);
        this.switchInput = document.getElementById(this.UiSelectors.switchInput);

        this.balanceList = document.querySelector(this.UiSelectors.balanceList);
        this.balanceListIncomes = document.querySelector(this.UiSelectors.balanceListIncomes);
        this.balanceListExpenses = document.querySelector(this.UiSelectors.balanceListExpenses);

        this.totalBudgetInfo = document.querySelector(this.UiSelectors.totalBudgetInfo);
        this.error = document.querySelector(this.UiSelectors.error);

        this.addEventListeners();
        this.updateTotalBudget();
        this.toggleListVisibility();
    }
    addEventListeners() {
        this.enterButton.addEventListener('click', () => this.addItem());
        this.descriptionInput.addEventListener('blur', () => this.hideError());
        this.valueInput.addEventListener('blur', () => this.hideError());

        this.balanceList.addEventListener('click', (e) => {
            this.listClickHandler(e.target)
        })

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        })
    }

    addItem() {
        const newItem = this.getInputValues();
        if (!newItem) {
            this.showError();
        }

        const isNotChecked = !this.switchInput.checked;

        const element = isNotChecked ? this.balanceListIncomes : this.balanceListExpenses;

        this.balanceItems.push(newItem);

        element.insertAdjacentHTML('beforeend', this.createItem(newItem.id, newItem.isPlus, newItem.description, newItem.value, ), );

        this.updateTotalBudget();
        this.numberOfItems++;
        this.toggleListVisibility();
    }

    deleteItem(target) {
        const {
            element,
            id
        } = this.getListElement(target);
        const items = [...this.balanceItems];

        this.balanceItems = items.filter((item) => item.id !== id);

        this.updateTotalBudget();
        element.remove()
        this.toggleListVisibility();
    }

    editItem() {
        const {
            element,
            id
        } = this.getListElement(target);
        this.editedItem = element;
        const selectedElement = this.balanceItems.find(item => item.id === id);

        this.descriptionInput.value = selectedElement.description;
        this.valueInput.value = selectedElement.value;
        this.switchInput.checked = !selectedElement.isPlus;
    }

    createItem(id, isPositive, description, price) {
        return `<li class="list__item" id="${id}">
        <p class="item__description" data-item-description>${description}</p>
        <p class="item__value ${isPositive ? 'item__value--income' : 'item__value--expense'}" data-item-value>${this.formatPrice(parseFloat(price), isPositive)}</p>
        <div class="item__buttons">
            <button class="item__button item__button--edit" data-edit-button></button>
            <button class="item__button item__button--delete" data-delete-button></button>
        </div>
    </li>`
    }

    listClickHandler(target) {
        if (target.dataset && target.dataset.editButton !== undefined) {
            this.editItem(target);
        }
        if (target.dataset && target.dataset.deleteButton !== undefined) {
            this.deleteItem(target);
        }
    }
    getListElement(target) {
        const listElement = target.parentElement.parentElement;
        const listElementId = listElement.id

        return {
            element: listElement,
            id: listElementId,
        }
    }

    getInputValues() {
        const isPlus = !this.switchInput.checked;
        const description = this.descriptionInput.value;
        const value = this.valueInput.value;

        if (value > 0 && description) {
            return {
                id: `${this.numberOfItems}`,
                isPlus,
                description,
                value,
            }
        }
        return null;
    }

    updateTotalBudget() {
        this.totalBudget = 0;
        this.balanceItems.forEach(({
            isPlus,
            value
        }) => {
            isPlus ? (this.totalBudget += parseFloat(value)) : (this.totalBudget -= parseFloat(value))
        })
        this.totalBudgetInfo.innerHTML = `
                    Your total budget is <span class = "${this.totalBudget >= 0 ? 'balance__heading--positive' : 'balance__heading--negative'}"> ${this.formatPrice(Math.abs(this.totalBudget), this.totalBudget >= 0 ? true : false)
                    } </span>`
    }

    toggleListVisibility() {
        this.balanceListExpenses.children.length ? this.balanceListExpenses.parentElement.classList.remove('hide') : this.balanceListExpenses.parentElement.classList.add('hide');
        this.balanceListIncomes.children.length ? this.balanceListIncomes.parentElement.classList.remove('hide') : this.balanceListIncomes.parentElement.classList.add('hide');
    }

    formatPrice(price, isPositive) {
        return `${isPositive ? '+' : '-'} ${this.setNumberOfDigits(price, 2)} ${this.currency}`
    }

    setNumberOfDigits(number, digits) {
        return number.toFixed(digits)
    }
    showError() {
        this.error.classList.remove('hide');
    }
    hideError() {
        this.error.classList.add('hide');
    }
}
