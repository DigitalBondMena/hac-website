import {
  AsyncPipe,
  CommonModule,
  DOCUMENT,
  isPlatformBrowser,
} from '@angular/common';
import {
  Component,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { filter, map, Subscription } from 'rxjs';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LanguageService } from './core/services/lang/language.service';
import { AlertComponent } from './shared/alert/alert.component';
import { NotificationComponent } from './shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    TranslateModule,
    NavbarComponent,
    FooterComponent,
    AlertComponent,
    NotificationComponent,
    NgxSpinnerModule,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private titleService = inject(Title);
  private meta = inject(Meta);
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private _languageService = inject(LanguageService);
  private langSubscription!: Subscription;
  private routerSubscription!: Subscription;

  // Flag to ensure meta tags are only updated once per navigation
  private metaTagsUpdated = false;

  currentLang$ = this._languageService.getLanguage();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.translate.addLangs(['ar', 'en']);
    this.translate.setDefaultLang('ar');
    this.translate.use('ar');
  }

  ngOnInit(): void {
    // Initialize meta title/description on first load
    this.updateMetaTags();

    // Subscribe to language changes
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      // Reset flag when language changes
      this.metaTagsUpdated = false;

      // Only update meta tags if not on a dynamic meta page
      const currentUrl = this.router.url;
      const isDynamicMetaPage =
        currentUrl.includes('/product-details/') ||
        currentUrl.includes('/blog/');
      if (!isDynamicMetaPage) {
        this.updateMetaTags();
      }
    });

    // Subscribe to route changes
    this.routerSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.router.routerState.root;
          while (child.firstChild) {
            child = child.firstChild;
          }
          return child.snapshot.data;
        })
      )
      .subscribe((data) => {
        // Reset flag on navigation
        this.metaTagsUpdated = false;
        this.setMetaTags(data);
      });
  }

  private updateMetaTags() {
    const currentRoute = this.router.routerState.snapshot.root;
    let child = currentRoute;
    while (child.firstChild) {
      child = child.firstChild;
    }
    this.setMetaTags(child.data);
  }

  /**
   * Set meta tags for SEO and social sharing following the same pattern as other components
   */
  private setMetaTags(data: any) {
    if (this.metaTagsUpdated) return;

    // Check if this is a page that handles its own dynamic meta tags
    const currentUrl = this.router.url;
    const isDynamicMetaPage =
      currentUrl.includes('/product-details/') || currentUrl.includes('/blog/');

    const currentLang = this.translate.currentLang;

    // Only update title and description meta tags for non-dynamic pages
    if (!isDynamicMetaPage) {
      // Remove existing meta tags first
      this.meta.removeTag("name='title'");
      this.meta.removeTag("property='og:title'");
      this.meta.removeTag("property='twitter:title'");
      this.meta.removeTag("name='description'");
      this.meta.removeTag("property='og:description'");
      this.meta.removeTag("property='twitter:description'");
      this.meta.removeTag("property='og:image'");
      this.meta.removeTag("property='twitter:image'");
      this.meta.removeTag("name='keywords'");

      // Handle title meta tags
      if (data['title']) {
        this.translate.get(data['title']).subscribe((translatedTitle) => {
          if (translatedTitle && translatedTitle.trim() !== '') {
            // Set document title
            this.titleService.setTitle(translatedTitle);

            // Remove any fallback title that might have been set by the router
            if (this.isBrowser) {
              const titleElement = this.document.querySelector('title');
              if (titleElement) {
                titleElement.textContent = translatedTitle;
              }
            }

            // Set meta tags for social sharing and SEO
            this.meta.updateTag({
              name: 'title',
              content: translatedTitle,
            });
            this.meta.updateTag({
              property: 'og:title',
              content: translatedTitle,
            });
            this.meta.updateTag({
              property: 'twitter:title',
              content: translatedTitle,
            });
          }
        });
      }

      // Handle description meta tags
      if (data['description']) {
        this.translate.get(data['description']).subscribe((translatedDesc) => {
          if (translatedDesc && translatedDesc.trim() !== '') {
            // Remove old description tags
            this.meta.removeTag("name='description'");
            this.meta.removeTag("property='og:description'");
            this.meta.removeTag("property='twitter:description'");

            // Add updated meta description tags
            this.meta.updateTag({
              name: 'description',
              content: translatedDesc,
            });
            this.meta.updateTag({
              property: 'og:description',
              content: translatedDesc,
            });
            this.meta.updateTag({
              property: 'twitter:description',
              content: translatedDesc,
            });
          }
        });
      }

      // Add meta keywords only if Arabic
      if (currentLang === 'ar') {
        this.meta.updateTag({
          name: 'keywords',
          content: 'وجهتك المثالية للجمال ومستحضرات التجميل',
        });
      }

      // Set default image meta tags if no specific image is provided
      const defaultImageUrl =
        'https://digitalbondmena.com/mesoshop/uploads/about/1748785929orPXHndjzd.webp';
      this.meta.updateTag({
        property: 'og:image',
        content: defaultImageUrl,
      });

      this.meta.updateTag({
        property: 'twitter:image',
        content: defaultImageUrl,
      });
    }

    // Always handle canonical and alternate URLs regardless of page type
    this.updateSEOLinks();

    // Mark meta tags as updated to prevent multiple updates
    this.metaTagsUpdated = true;
  }

  /**
   * Update SEO-related links (canonical, alternate, og:url)
   */
  private updateSEOLinks(): void {
    const currentLang = this.translate.currentLang;
    const currentPath = this.router.url;
    const withoutLangPrefix = currentPath.replace(/^\/(ar|en)/, '');
    const cleanSlug = withoutLangPrefix === '/' ? '' : withoutLangPrefix;

    // Update Canonical URL with production domain
    const canonicalUrl = `https://haccosmetics.com/${currentLang}${cleanSlug}`;
    this.updateCanonicalLink(canonicalUrl);

    // Update alternate language links
    const alternateUrl = `https://haccosmetics.com/${
      currentLang === 'ar' ? 'en' : 'ar'
    }${cleanSlug}`;
    this.updateAlternateLinks(canonicalUrl, alternateUrl);

    // Update or create the og:url tag
    this.meta.updateTag({
      property: 'og:url',
      content: canonicalUrl,
    });
  }

  private updateCanonicalLink(url: string): void {
    // Remove any existing canonical link
    const existingCanonical = this.document.querySelector(
      'link[rel="canonical"]'
    );
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Create and append new canonical link
    const canonical = this.document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', url);
    this.document.head.appendChild(canonical);
  }

  private updateAlternateLinks(currentUrl: string, alternateUrl: string): void {
    // Remove existing alternate links
    const existingAlternates = this.document.querySelectorAll(
      'link[rel="alternate"]'
    );
    existingAlternates.forEach((link) => link.remove());

    // Add x-default (pointing to Arabic version)
    const xDefault = this.document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', currentUrl.replace(/\/(ar|en)/, '/ar'));
    this.document.head.appendChild(xDefault);

    // Add current language alternate
    const currentLang = this.translate.currentLang;
    const currentAlt = this.document.createElement('link');
    currentAlt.setAttribute('rel', 'alternate');
    currentAlt.setAttribute('hreflang', currentLang);
    currentAlt.setAttribute('href', currentUrl);
    this.document.head.appendChild(currentAlt);

    // Add alternate language link
    const alternateLang = currentLang === 'ar' ? 'en' : 'ar';
    const altLink = this.document.createElement('link');
    altLink.setAttribute('rel', 'alternate');
    altLink.setAttribute('hreflang', alternateLang);
    altLink.setAttribute('href', alternateUrl);
    this.document.head.appendChild(altLink);
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    // Reset meta tags updated flag
    this.metaTagsUpdated = false;
  }
}
