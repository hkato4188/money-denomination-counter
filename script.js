document.addEventListener("DOMContentLoaded", () => {
    const dollarInput = document.getElementById("dollar-amount");
    const denominationsContainer = document.getElementById("denominations");
    const remainingAmountElement = document.getElementById("remaining");

    const denominations = [100, 50, 20, 10, 5, 1];
    let remainingAmount = 0;

    // Dynamically create denomination rows
    const createDenominationRows = () => {
        denominationsContainer.innerHTML = ""; // Clear existing rows
        denominations.forEach((value) => {
            const row = document.createElement("div");
            row.className = "denomination-row";
            row.innerHTML = `
                <button 
                    class="btn-minus" 
                    aria-label="Decrease $${value} bills">-</button>
                <input 
                    type="number" 
                    min="0" 
                    data-denomination="${value}" 
                    value="0" 
                    aria-label="Number of $${value} bills" 
                    readonly />
                <button 
                    class="btn-plus" 
                    aria-label="Increase $${value} bills">+</button>
                <span class="denomination-label">$${value}</span>
            `;
            denominationsContainer.appendChild(row);
        });
    };

    // Update the remaining amount based on user input
    const updateRemainingAmount = () => {
        const totalAmount = parseInt(dollarInput.value, 10) || 0;
        const inputs = document.querySelectorAll("#denominations input");
        let allocatedAmount = 0;

        inputs.forEach((input) => {
            const denomination = parseInt(input.dataset.denomination, 10);
            const count = parseInt(input.value, 10) || 0;
            allocatedAmount += denomination * count;
        });

        remainingAmount = totalAmount - allocatedAmount;
        remainingAmountElement.textContent = `Remaining Amount: $${remainingAmount}`;

        // Update button states
        updateButtonStates();
    };

    // Update button states based on the remaining amount
    const updateButtonStates = () => {
        const inputs = document.querySelectorAll("#denominations input");

        inputs.forEach((input) => {
            const denomination = parseInt(input.dataset.denomination, 10);
            const count = parseInt(input.value, 10) || 0;
            const maxBills = Math.floor(remainingAmount / denomination) + count;

            // Enable/disable buttons
            const minusButton = input.previousElementSibling;
            const plusButton = input.nextElementSibling;

            minusButton.disabled = count <= 0;
            plusButton.disabled = remainingAmount < denomination;
        });
    };

    // Handle button clicks
    const handleButtonClick = (event) => {
        const button = event.target;
        const input = button.classList.contains("btn-minus")
            ? button.nextElementSibling
            : button.previousElementSibling;
        const denomination = parseInt(input.dataset.denomination, 10);
        const count = parseInt(input.value, 10) || 0;

        if (button.classList.contains("btn-minus") && count > 0) {
            input.value = count - 1;
        } else if (
            button.classList.contains("btn-plus") &&
            remainingAmount >= denomination
        ) {
            input.value = count + 1;
        }

        updateRemainingAmount();
    };

    // Add event listeners
    const addEventListeners = () => {
        dollarInput.addEventListener("input", updateRemainingAmount);
        denominationsContainer.addEventListener("click", (event) => {
            if (
                event.target.classList.contains("btn-minus") ||
                event.target.classList.contains("btn-plus")
            ) {
                handleButtonClick(event);
            }
        });
    };

    // Initialize the app
    createDenominationRows();
    addEventListeners();
});
