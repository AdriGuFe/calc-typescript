import { format } from "date-fns";
import { interval, map } from "rxjs";

export class Clock {
  private container: HTMLElement;
  private clock = interval(1000).pipe(
    map(() => format(new Date(), "HH:mm:ss")),
  );

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
  }

  private renderClock(): void {
    this.clock.subscribe((value) => (this.container.innerHTML = value));
  }

}
