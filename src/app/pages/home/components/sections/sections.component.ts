import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICategory } from '@core/interfaces/common.model';
import { LanguageService } from '@core/services/lang/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { CategoriesSkeletonComponent } from '@shared/components/skeleton/categories-skeleton/categories-skeleton.component';
interface Category {
  id: number;
  subcategoryId: number;
  en_name: string;
  ar_name?: string;
  en_slug?: string;
  ar_slug?: string;
  active_status?: number;
  order_view?: number;
  created_at?: string;
  updated_at?: string;
  imgPath?: string;
}
@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [TranslateModule, RouterModule, CategoriesSkeletonComponent],
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.css',
})
export class SectionsComponent implements OnInit {
  @Input({ required: true }) categories: ICategory[] = [];

  private languageService = inject(LanguageService);

  currentLang = 'en';

  staticCategories: Category[] = [
    {
      id: 1,
      subcategoryId: 50,
      en_name: 'Moisturization',
      ar_name: 'ترطيب',
      imgPath: '/images/categories/subcategories/1.jpg',
    },
    {
      id: 2,
      subcategoryId: 49,
      en_name: 'Acne',
      ar_name: 'حب الشباب',
      imgPath: '/images/categories/subcategories/2.jpg',
    },
    {
      id: 3,
      subcategoryId: 48,
      en_name: 'Antiaging',
      ar_name: 'مضاد للشيخوخة',
      imgPath: '/images/categories/subcategories/3.jpg',
    },
    {
      id: 4,
      subcategoryId: 47,
      en_name: 'Skin Cleansers',
      ar_name: 'غسولات البشرة',
      imgPath: '/images/categories/subcategories/4.jpg',
    },
    {
      id: 5,
      subcategoryId: 46,
      en_name: 'Intimate hydration',
      ar_name: 'الترطيب المناطق الحساسة',
      imgPath: '/images/categories/subcategories/5.jpg',
    },
    {
      id: 6,
      subcategoryId: 45,
      en_name: 'Intimate depigmentation',
      ar_name: 'تفتيح المناطق الحساسة',
      imgPath: '/images/categories/subcategories/6.png',
    },
    {
      id: 7,
      subcategoryId: 20,
      en_name: 'Sunscreens',
      ar_name: 'واقيات الشمس',
      imgPath: '/images/categories/subcategories/7.jpg',
    },
    {
      id: 8,
      subcategoryId: 26,
      en_name: 'Antiwrinkles',
      ar_name: 'مضاد للتجاعيد',
      imgPath: '/images/categories/subcategories/8.jpg',
    },
  ];

  ngOnInit() {
    // Subscribe to language changes
    this.languageService.getLanguage().subscribe((lang) => {
      this.currentLang = lang;
    });
  }
}
