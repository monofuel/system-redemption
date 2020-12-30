import templateStr from "./index.html";
import { CustomElement } from "../../CustomElement";
import { LoadingBarElement } from "../../loadingBar";

export class PlanefrontUITestElement extends CustomElement {
  constructor() {
    super(templateStr);
    setInterval(() => this.onInterval(), 30);
  }

  onInterval(): void {
    const loadingBar: LoadingBarElement | null = this.querySelector(
      "loading-bar"
    );
    if (loadingBar) {
      let val = loadingBar.progress.value + 1;
      if (val > 100) {
        val = 0;
      }
      loadingBar.progress.value = val;
    }
  }
}
