let mouseDown = false;
let showGrid = false;
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

// buttons
const btn_oneColorMode = document.getElementById("onecolor");
const btn_randomColorMode = document.getElementById("randomcolor");
const btn_grayColorMode = document.getElementById("graycolor");
const btn_eraseMode = document.getElementById("eraser");
const btn_clearBoard = document.getElementById("clear");
const btn_showgrid = document.getElementById("showgrid");
const btn_download = document.getElementById("download");

// interactive elements
const colorPicker = document.getElementById("colorpicker");
const slider = document.getElementById("slider");

// html display elements
const gridContainer = document.getElementById("grid-container");
const gridValueInfo = document.getElementById("grid-value-info");

// variables
let currentColor = colorPicker.value,
    oneColorMode = true,
    randomColorMode = false,
    grayColorMode = false,
    eraseMode = false,
    sliderValue = slider.value;

// button click events
btn_oneColorMode.onclick = () => {
    oneColorMode = true;

    eraseMode = false;
    randomColorMode = false;
    grayColorMode = false;

    btn_oneColorMode.classList.add("button-bg");
    btn_randomColorMode.classList.remove("button-bg");
    btn_grayColorMode.classList.remove("button-bg");
    btn_eraseMode.classList.remove("button-bg");
}
btn_randomColorMode.onclick = () => {
    randomColorMode = true;

    eraseMode = false;
    oneColorMode = false;
    grayColorMode = false;

    btn_oneColorMode.classList.remove("button-bg");
    btn_randomColorMode.classList.add("button-bg");
    btn_grayColorMode.classList.remove("button-bg");
    btn_eraseMode.classList.remove("button-bg");
}
btn_grayColorMode.onclick = () => {
    grayColorMode = true;

    eraseMode = false;
    oneColorMode = false;
    randomColorMode = false;

    btn_oneColorMode.classList.remove("button-bg");
    btn_randomColorMode.classList.remove("button-bg");
    btn_grayColorMode.classList.add("button-bg");
    btn_eraseMode.classList.remove("button-bg");
}
btn_eraseMode.onclick = () => {
    eraseMode = true;

    oneColorMode = false;
    randomColorMode = false;
    grayColorMode = false;

    btn_oneColorMode.classList.remove("button-bg");
    btn_randomColorMode.classList.remove("button-bg");
    btn_grayColorMode.classList.remove("button-bg");
    btn_eraseMode.classList.add("button-bg");
}
btn_showgrid.onclick = () => {
    showGrid = !showGrid;
    toggleGridLines();
}
btn_download.onclick = () => {
    domtoimage.toJpeg(gridContainer)
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'sketchy.jpeg';
        link.href = dataUrl;
        link.click();
        link.remove();
    });
}
btn_clearBoard.onclick = () => {
    createGrid();
}

// methods 
function createGrid() {
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateRows = `repeat(${sliderValue}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${sliderValue}, 1fr)`;
    for (let i = 1; i <= sliderValue * sliderValue; i++) {
        const div = document.createElement("div");
        div.addEventListener('mouseover', changeColor);
        div.addEventListener('mousedown', changeColor);
        gridContainer.appendChild(div);
    }
    updateGridInfo();
    if (showGrid) 
        toggleGridLines();
}
function toggleGridLines() {
    let gridItems = gridContainer.getElementsByTagName('div');
    if (showGrid) {
        for (let i = 0; i < sliderValue * sliderValue; i++) {
            var gridItem = gridItems[i];
            gridItem.classList.add('border-gray');
        }
    } else {
        for (let i = 0; i < sliderValue * sliderValue; i++) {
            var gridItem = gridItems[i];
            gridItem.classList.remove('border-gray');
        }
    }
}
function updateGridInfo() {
    gridValueInfo.innerHTML = `${sliderValue} x ${sliderValue}`;
}

function changeColor(e) {
    if (e.type === 'mouseover' && !mouseDown) return;
    if (eraseMode) {
        e.target.style.background = "white";
    } else if (oneColorMode) {
        e.target.style.background = currentColor;
    } else if (randomColorMode) {
        let randomHexCode = Math.floor(Math.random()*16777215).toString(16);
        e.target.style.background = '#' + randomHexCode;
    } else if (grayColorMode) {
        let rgbaValuesArray = getComputedStyle(e.target).getPropertyValue("background-color").match(/[\d.]+/g);
        if (rgbaValuesArray[0] != 0 || rgbaValuesArray[1] != 0 || rgbaValuesArray[2] != 0) {
            e.target.style.background = `rgba(0, 0, 0, 0.1)`
        } else {
            let alphaValueOfItem = parseFloat(rgbaValuesArray[3]) + 0.1;
            if (alphaValueOfItem > 1) {
                alphaValueOfItem = 0;
            }
            e.target.style.background = `rgba(0, 0, 0, ${alphaValueOfItem})`;
        }
    }
}

// slider events
slider.onchange = (event) => {
    sliderValue = event.target.value;
    createGrid();
};
slider.onmousemove = (event) => {
    sliderValue = event.target.value;
    updateGridInfo();
}

// pick color
colorPicker.onchange = () => {
    currentColor = colorPicker.value;
}

// initiate 
createGrid();