import './style.css'
import { Calculator } from './calculator';
import { Clock } from './clock';
import { Temp } from './temp';

document.addEventListener('DOMContentLoaded', () => {
    const calc1 = new Calculator('calculadora1');
    const calc2 = new Calculator('calculadora2');
    const calc3 = new Calculator('calculadora3');
    const clock = new Clock('clock');
    const temp = new Temp('temp');
});