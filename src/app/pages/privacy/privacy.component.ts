import { Component } from '@angular/core';
import { SafeHtmlComponent } from '@core/safe-html/safe-html.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy',
  imports: [TranslateModule, SafeHtmlComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css',
})
export class PrivacyComponent {}
