document.addEventListener("DOMContentLoaded", () => {
    const dollarInput = document.getElementById("dollar-amount");
    const denominationsContainer = document.getElementById("denominations");
    const updateButton = document.querySelector("button");
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
                <span>$${value} bills:</span>
                <input 
                    type="number" 
                    min="0" 
                    data-denomination="${value}" 
                    value="0" 
                    aria-label="Number of $${value} bills" />
            `;
            denominationsContainer.appendChild(row);
        });
    };

    // Update the remaining amount based on user input
    const updateRemainingAmount = () => {
        const totalAmount = parseInt(dollarInput.value, 10) || 0;
        const inputs = document.querySelectorAll("#denominations input");
        let allocatedAmount = 0;

        // Calculate allocated amount based on user inputs
        inputs.forEach((input) => {
            const denomination = parseInt(input.dataset.denomination, 10);
            const count = parseInt(input.value, 10) || 0;
            allocatedAmount += denomination * count;
        });

        // Update remaining amount
        remainingAmount = totalAmount - allocatedAmount;
        remainingAmountElement.textContent = `Remaining Amount: $${remainingAmount}`;

        // Add or remove the negative class based on remaining amount
        if (remainingAmount < 0) {
            remainingAmountElement.classList.add("negative-remaining");
        } else {
            remainingAmountElement.classList.remove("negative-remaining");
        }

        // Debugging: Log computed styles (optional)
        // console.log(getComputedStyle(remainingAmountElement).color);

        // Disable the button if remaining amount is invalid
        updateButton.disabled = remainingAmount < 0;
    };

    // Auto-fill denominations to minimize remaining amount
    const autoAllocateDenominations = () => {
        let amountToAllocate = parseInt(dollarInput.value, 10) || 0;
        const inputs = document.querySelectorAll("#denominations input");

        inputs.forEach((input) => {
            const denomination = parseInt(input.dataset.denomination, 10);
            const maxBills = Math.floor(amountToAllocate / denomination);
            input.value = maxBills;
            amountToAllocate -= maxBills * denomination;
        });

        updateRemainingAmount();
    };

    // Event listeners
    dollarInput.addEventListener("input", updateRemainingAmount);
    denominationsContainer.addEventListener("input", updateRemainingAmount);
    updateButton.addEventListener("click", autoAllocateDenominations);

    // Initialize the app
    createDenominationRows();
});
