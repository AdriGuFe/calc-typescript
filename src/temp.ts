import { format } from "date-fns";
import { Subscription, interval, map, startWith } from "rxjs";

export class Temp {
  private container: HTMLElement;
  private subscription?: Subscription;
  private temp = interval(1000);

  constructor(id: string) {
    const selector = id.startsWith("#") || id.startsWith(".") ? id : `#${id}`;

    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
      throw new Error(`Element not found for selector: ${selector}`);
    }

    this.container = element;
    this.init();
  }
  private init(): void {
    this.renderClock();
    this.initEventListener();
  }

  private renderClock(): void {
    this.container.innerHTML = `
            <div class="temp">
                <div class="display">
                    00:00
                </div>
                <div class="botones">
                    <button class="start">Iniciar cronómetro</button>
                    <button class="stop">Parar cronómetro</button>
                    <button class="reset">Reiniciar cronómetro</button>
                </div>
            </div>
        `;
  }

  private initEventListener() {
    const resetButton = this.container.querySelector(".reset");
    if (resetButton) {
      resetButton.addEventListener("click", () => this.reset());
    }
    const startButton = this.container.querySelector(".start");
    if (startButton) {
      startButton.addEventListener("click", () => this.start());
    }
    const stopButton = this.container.querySelector(".stop");
    if (stopButton) {
      stopButton.addEventListener("click", () => this.stop());
    }
  }

  private stop(): void {
    this.subscription?.unsubscribe();
  }

  private start(): void {
    if (this.subscription) return; 

    this.subscription = this.temp.subscribe((value) => {
      this.updateDisplay(value);
    });
  }

  private reset(): void {
    this.stop();
    this.updateDisplay(0);
  }

  private updateDisplay(totalSeconds: number): void {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const display = this.container.querySelector(".display");
    if (display) {
      display.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
  }
}
