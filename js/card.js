var getParent = (el, level = 1) => {
    let i;
    for (i = 0; i < level && el != document.body; i++) el = el.parentElement;
    return el;
};
var card = function () {
    this.data = [[], [], [], []];
    this.currentDrag = {};
    this.store = () => {
        localStorage.setItem("data", JSON.stringify(this.data));
    };
    /**Add card with value to target
     * @param {*} target
     * @param {*} value
     * @param {*} inArray store in array
     */
    this.add = (target, value, inArray = true, oldCard = false, d = null) => {
        let draggable = document.createElement("SECTION");
        draggable.className = "draggable";
        draggable.innerHTML = value;
        draggable.draggable = true;
        let obj;
        if (inArray) {
            let key = Number(target.getAttribute("key"));
            obj = {
                title: value,
                created_at: new Date().getTime(),
            };
            this.data[key].push(obj);
        }
        if (oldCard) obj = { created_at: d };
        draggable.setAttribute("data-created", obj.created_at);
        this.store();
        target.querySelector(".cards-container").appendChild(draggable);
        draggable.addEventListener("dragstart", () => {
            draggable.classList.add("dragging");
            let x = Number(getParent(draggable, 2).getAttribute("key"));
            let z = draggable.getAttribute("data-created");
            let y = this.data[x].findIndex((v) => z == v.created_at);
            this.currentDrag = { x, y };
            console.log(this.currentDrag);
        });
        draggable.addEventListener("dragend", () => {
            draggable.classList.remove("dragging");
        });
    };
    this.getDragAfterElement = function (container, y) {
        const draggableElements = [
            ...container.querySelectorAll(".draggable:not(.dragging)"),
        ];

        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element;
    };

    this.load = () => {
        let d = localStorage.getItem("data");
        if (d != null) {
            this.data = JSON.parse(d);
            this.data.forEach((ar, i) => {
                if (ar.length != 0) {
                    let target = document.querySelector(
                        `.container > [key="${i}"]`
                    );
                    ar.forEach((v) =>
                        this.add(target, v.title, false, true, v.created_at)
                    );
                }
            });
        }
    };
    return this;
}.call({});
window.onload = card.load;
document.querySelectorAll(".cards-container").forEach((c) => {
    c.addEventListener("drop", function drop_handler(e) {
        e.preventDefault();
        let key;
        const afterElement = card.getDragAfterElement(c, e.clientY);
        const draggable = document.querySelector(".dragging");
        let { x, y } = card.currentDrag;
        let b = card.data[x].splice(y, 1)[0];
        if (afterElement == null) {
            let parent = e.target.parentElement;
            if (parent.classList.contains("cards-container"))
                parent = parent.parentElement;
            console.log(parent);
            key = Number(parent.getAttribute("key"));
            c.appendChild(draggable);
            card.data[key].push(b);
        } else {
            key = Number(getParent(e.target, 2).getAttribute("key"));
            c.insertBefore(draggable, afterElement);
            let i = [...e.target.parentElement.children].indexOf(draggable);
            card.data[key].splice(i, 0, b);
        }
        card.store();
    });
    c.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
});
