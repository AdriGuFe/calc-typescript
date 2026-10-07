export class Calculator {
    private container: HTMLElement;
    private currentInput: string = '0';
    private lastInput: string = '0';
    private operation: string = '';
    private shouldResetInput: boolean = false;

    constructor(id: string) {
        const selector = id.startsWith('#') || id.startsWith('.') ? id : `#${id}`;

        const element = document.querySelector<HTMLElement>(selector);
        if (!element) {
            throw new Error(`Element not found for selector: ${selector}`);
        }

        this.container = element;
        this.init();
    }

    private init(): void {
        this.renderUI();
        this.initEventListeners();
    }

    private renderUI(): void {
        this.container.innerHTML = `
            <div class="calculadora">
                <div class="display">
                    <input type="text" class="display-input" value="0" disabled />
                </div>
                <div class="teclado">
                    <button class="delete span-two">DEL</button>
                    <button class="reset">C</button>
                    <button class="operation" data-action="sign">+/-</button>
                    <button class="operation" data-action="square">x²</button>
                    <button class="operation" data-action="sqrt">√x</button>
                    <button class="operation" data-action="inverse">1/x</button>
                    <button class="operation" data-action="+">+</button>
                    <button class="number" data-value="7">7</button>
                    <button class="number" data-value="8">8</button>
                    <button class="number" data-value="9">9</button>
                    <button class="operation" data-action="-">-</button>
                    <button class="number" data-value="4">4</button>
                    <button class="number" data-value="5">5</button>
                    <button class="number" data-value="6">6</button>
                    <button class="operation" data-action="*">*</button>
                    <button class="number" data-value="1">1</button>
                    <button class="number" data-value="2">2</button>
                    <button class="number" data-value="3">3</button>
                    <button class="operation" data-action="/">/</button>        
                    <button class="equals span-two">=</button>
                    <button class="number" data-value="0">0</button>
                    <button class="decimal">.</button>
                </div>
            </div>
        `;
    }

    private updateDisplay(value: string): void {
        const displayInput = this.container.querySelector('.display-input') as HTMLInputElement;
        if (displayInput) {
            displayInput.value = value;
        }
    }

    private initEventListeners(): void {
        const numberButtons = this.container.querySelectorAll('.number');
        numberButtons.forEach((element) => {
            element.addEventListener('click', (event) => {
                const value = (event.target as HTMLElement).dataset.value;
                if (this.shouldResetInput) {
                    this.currentInput = value || '0';
                    this.shouldResetInput = false;
                } else {
                    if (this.currentInput === '0' && value === '0') return;
                    if (this.currentInput === '0') this.currentInput = '';
                    this.currentInput += value;
                }
                this.updateDisplay(this.currentInput);
            });
        });

        const resetButton = this.container.querySelector('.reset');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.currentInput = '0';
                this.lastInput = '0';
                this.operation = '';
                this.shouldResetInput = false;
                this.updateDisplay(this.currentInput);
            });
        }

        const deleteButton = this.container.querySelector('.delete');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                if (this.currentInput.length === 1) {
                    this.currentInput = '0';
                } else {
                    this.currentInput = this.currentInput.slice(0, -1);
                }
                this.updateDisplay(this.currentInput);
            });
        }

        const decimalButton = this.container.querySelector('.decimal');
        if (decimalButton) {
            decimalButton.addEventListener('click', () => {
                if (this.shouldResetInput) {
                    this.currentInput = '0.';
                    this.shouldResetInput = false;
                } else {
                    if (!this.currentInput.includes('.')) {
                        this.currentInput += '.';
                    }
                }
                this.updateDisplay(this.currentInput);
            });
        }

        const operationButtons = this.container.querySelectorAll('.operation');
        operationButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const action = (event.target as HTMLElement).dataset.action;

                if (action === 'sign' || action === 'square' || action === 'sqrt' || action === 'inverse') {
                    this.executeUnaryOperation(action);
                    return;
                }

                if (this.operation && !this.shouldResetInput) {
                    const result = this.calculate();
                    this.currentInput = result.toString();
                    this.updateDisplay(this.currentInput);
                }

                this.lastInput = this.currentInput;
                this.operation = action || '';
                this.shouldResetInput = true;
            });
        });

        const equalsButton = this.container.querySelector('.equals');
        if (equalsButton) {
            equalsButton.addEventListener('click', () => {
                if (this.operation) {
                    const result = this.calculate();
                    this.currentInput = result.toString();
                    this.updateDisplay(this.currentInput);
                    this.lastInput = '0';
                    this.operation = '';
                    this.shouldResetInput = true;
                }
            });
        }
    }

    private calculate(): number {
        const num1 = parseFloat(this.lastInput);
        const num2 = parseFloat(this.currentInput);

        switch (this.operation) {
            case '+': return num1 + num2;
            case '-': return num1 - num2;
            case '*': return num1 * num2;
            case '/': return num2 !== 0 ? num1 / num2 : 0;
            default: return num2;
        }
    }

    private executeUnaryOperation(action: string): void {
        const num = parseFloat(this.currentInput);
        let result: number | string;

        switch (action) {
            case 'sign':
                if (this.currentInput !== '0') {
                    result = this.currentInput.startsWith('-') ? this.currentInput.substring(1) : '-' + this.currentInput;
                    this.currentInput = result;
                    this.updateDisplay(this.currentInput);
                }
                return;
            case 'square':
                result = num * num;
                break;
            case 'sqrt':
                result = num >= 0 ? Math.sqrt(num) : 'Error';
                break;
            case 'inverse':
                result = num !== 0 ? 1 / num : 'Error';
                break;
            default:
                return;
        }

        this.currentInput = result.toString();
        this.updateDisplay(this.currentInput);
        this.shouldResetInput = true;
    }
}