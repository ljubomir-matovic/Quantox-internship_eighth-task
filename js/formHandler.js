var formHandler = function () {
    this.forms = document.querySelectorAll("form");
    this.inputs = document.querySelectorAll("input[type='text']");
    this.toggleButton = (e) => {
        let el = e.target;
        let button = el.parentElement.querySelector("button");
        if (el.value == "") {
            button.style.display = "none";
        } else {
            button.style.display = "block";
        }
    };
    this.inputs.forEach((i) => i.addEventListener("keyup", this.toggleButton));
    this.forms.forEach((f) =>
        f.addEventListener("submit", (e) => {
            e.preventDefault();
            let input = e.target.querySelector("input[name='title']");
            let value = input.value;
            input.value = "";
            this.toggleButton({ target: input });
            card.add(e.target.parentElement, value);
        })
    );
    return this;
}.call({});
