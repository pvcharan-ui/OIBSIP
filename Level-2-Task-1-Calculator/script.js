const display = document.getElementById("display");
const history = document.getElementById("history");

// Append values
function appendValue(value) {
    display.value += value;
}

// Clear display
function clearDisplay() {
    display.value = "";
    history.textContent = "";
}

// Delete last character
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Calculate result
function calculate() {

    if (display.value === "") return;

    try {

        const expression = display.value;

        const result = eval(
            expression.replace(/%/g, "/100")
        );

        history.textContent = expression + " =";

        display.value = result;

    } catch {

        display.value = "Error";

        setTimeout(() => {

            display.value = "";

        }, 1200);

    }

}

// Keyboard Support

document.addEventListener("keydown", function (event) {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "." ||
        key === "%"
    ) {

        appendValue(key);

    }

    else if (key === "Enter") {

        event.preventDefault();

        calculate();

    }

    else if (key === "Backspace") {

        deleteLast();

    }

    else if (key === "Escape") {

        clearDisplay();

    }

});