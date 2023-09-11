let __ui_uuid = 0;
let __ui_table = document.createElement('div');
let __ui_list = [];

__ui_table.id = 'ui-table';

document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(__ui_table);
});

function getUUID() {
    __ui_uuid++;
    return __ui_uuid - 1;
}

function addLine() {
    let element = new Line();
    element.add();
}

function clearUI(callback = (element) => {
    element.remove();
}) {
    let index = 0; let vi = 0;
    let count = __ui_list.length;
    
    while (index < count) {
        var currentUI = __ui_list[vi];
        
        callback(currentUI);
        if (!currentUI.valid) vi--;
        index++; vi++;
    }
}

class UI {
    constructor() {
        this.uuid = getUUID(); this.valid = true;
        this.element = document.createElement('div');
        this.listeners = {};
        
        this.listeners.click = [];
        
        this.element.addEventListener('click', (event) => {
            this.listeners.click.forEach((listener) => {
                listener(event);
            });
        });
        
        __ui_list.push(this);
    }
    
    addClass(className) {
        this.element.classList.add(className);
    }
    
    add(element = __ui_table) {
        element.appendChild(this.element);
    }
    
    remove() {
        this.element.remove();
        
        let index = __ui_list.indexOf(this);
        __ui_list.splice(index, 1);
        
        this.valid = false;
    }
    
    /* Direction: 'down'으로 아래로 배치, 'left'로 옆으로 배치 */
    setPlacement(direction) {
        if (direction == 'down') {
            this.element.style.float = 'none';
        } else if (direction == 'left') {
            this.element.style.float = 'left';
        }
    }
    
    setCursor(cursor) {
        this.element.style.cursor = cursor;
    }
    
    click(listener) {
        this.listeners.click.push(listener);
    }
}

class Line extends UI {
    constructor() {
        super(); this.element.classList.add('fill-line');
    }
}

class FileBoxUI extends UI {
    constructor() {
        super();
        
        // Create Filebox Element
        // this.element = document.createElement('div');
        this.element.classList.add('filebox');
        this.element.classList.add('box-ui');
        
        // Create Label
        this.label = document.createElement('label');
        this.label.setAttribute('for', `input_file${this.uuid}`);
        
        // Load Material Folder Icon
        let folderIcon = document.createElement('span');
        folderIcon.classList.add('material-symbols-outlined');
        folderIcon.classList.add('file-selection');
        folderIcon.innerText = 'folder_open';
        
        // UI When File Not Selected
        this.fileNotSelected = document.createElement('div');
        this.fileNotSelected.classList.add('file-not-selected');
        this.fileNotSelected.innerText = '파일을 선택해주세요';
        this.fileNotSelected.appendChild(folderIcon);
        
        // UI When File Selected
        this.fileSelected = document.createElement('div');
        this.fileSelected.classList.add('file-selected');
        this.fileSelected.classList.add('invisible');
        this.fileSelected.innerText = 'filename';
        
        // Add File Selection UI on Label
        this.label.appendChild(this.fileNotSelected);
        this.label.appendChild(this.fileSelected);
        
        this.element.appendChild(this.label);
        
        this.inputbox = document.createElement('input');
        
        this.inputbox.setAttribute('type', 'file');
        this.inputbox.setAttribute('id', `input_file${this.uuid}`);
        this.inputbox.setAttribute('accept', '.adofai');
        
        this.inputbox.classList.add('invisible');
        this.element.appendChild(this.inputbox);
        
        // Add Event Listener System
        this.listeners.change = [];
        this.inputbox.addEventListener('change', (event) => {
            if (this.element.value !== null) {
                this.listeners.change.forEach((listener) => {
                    listener(event);
                });
            }
        });
    }
    
    setText(text) {
        if (text == null) {
            this.fileNotSelected.classList.remove("invisible");
            
            this.inputbox.disabled = false;
            this.fileSelected.classList.add("invisible");
            this.fileSelected.innerText = 'filename';
            this.label.style.cursor = 'pointer';
        } else {
            this.fileNotSelected.classList.add("invisible");
        
            this.inputbox.disabled = true;
            this.fileSelected.innerText = text;
            this.fileSelected.classList.remove("invisible");
            this.label.style.cursor = 'default';
        }
    }
    
    addFileListener(listener) {
        this.listeners.change.push(listener);
    }
    
    clearFile() {
        this.inputbox.value = '';
    }
}

class BoxUI extends UI {
    constructor() {
        super();
        
        // this.element = document.createElement('div');
        this.element.classList.add('box-ui');
        super.setPlacement('left');
    }
    
    setText(text) {
        this.element.innerHTML = '';
        this.element.appendChild(parseText(text));
    }
    
    setSpaced(spaced) {
        let classIndex;
        
        if (spaced) {
            this.element.classList.add('spaced');
        } else if (classIndex = this.element.classList.indexOf('spaced')) {
            this.element.classList.splice(classIndex, 1);
        }
    }
}