'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Upload, X, AlertCircle } from 'lucide-react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'be', name: 'Bengali' },
  { code: 'hi', name: 'Hindi' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'kr', name: 'Korean' },
  { code: 'br', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'it', name: 'Italy' },
];

interface LocalizedString {
  [key: string]: string;
}

interface LocalizedContent {
  [key: string]: any;
}

interface BlogFormData {
  metatitle: string;
  metadescription: string;
  title: LocalizedString;
  author: string;
  description: LocalizedString;
  products: string;
  category: LocalizedString;
  content: LocalizedContent;
  blogimage: File[];
}

interface BlogData {
  id: string;
  metatitle: string;
  metadescription: string;
  title: LocalizedString | string;
  author: string;
  description: LocalizedString | string;
  products: string;
  category: LocalizedString | string;
  content: LocalizedContent | object | string;
  blogimage?: string[];
}

interface ApiError {
  message: string;
  status?: number;
}

const productCategoryMap: Record<string, Record<string, string>> = {
  'ACE CMS': {
    en: 'Engineering', hi: 'इंजीनियरिंग', be: 'প্রকৌশল', fr: 'Ingénierie', es: 'Ingeniería',
    de: 'Ingenieurwesen', zh: '工程', ja: 'エンジニアリング', kr: '공학', br: 'Engenharia', ru: 'Инженерия', it: 'Ingegneria'
  },
  'ACE PMS': {
    en: 'Engineering', hi: 'इंजीनियरिंग', be: 'প্রকৌশল', fr: 'Ingénierie', es: 'Ingeniería',
    de: 'Ingenieurwesen', zh: '工程', ja: 'エンジニアリング', kr: '공학', br: 'Engenharia', ru: 'Инженерия', it: 'Ingegneria'
  },
  'ACE Profit PPAP': {
    en: 'Engineering', hi: 'इंजीनियरिंग', be: 'প্রকৌশল', fr: 'Ingénierie', es: 'Ingeniería',
    de: 'Ingenieurwesen', zh: '工程', ja: 'エンジニアリング', kr: '공학', br: 'Engenharia', ru: 'Инженерия', it: 'Ingegneria'
  },
  'PPAP Manager': {
    en: 'Engineering', hi: 'इंजीनियरिंग', be: 'প্রকৌশল', fr: 'Ingénierie', es: 'Ingeniería',
    de: 'Ingenieurwesen', zh: '工程', ja: 'エンジニアリング', kr: '공학', br: 'Engenharia', ru: 'Инженерия', it: 'Ingegneria'
  },
  'Engineering Balloon Annotator': {
    en: 'Engineering', hi: 'इंजीनियरिंग', be: 'প্রকৌশল', fr: 'Ingénierie', es: 'Ingeniería',
    de: 'Ingenieurwesen', zh: '工程', ja: 'エンジニアリング', kr: '공학', br: 'Engenharia', ru: 'Инженерия', it: 'Ingegneria'
  },
  'ACE CRM': {
    en: 'Sales', hi: 'बिक्री', be: 'বিক্রয়', fr: 'Ventes', es: 'Ventas',
    de: 'Vertrieb', zh: '销售', ja: 'セールス', kr: '영업', br: 'Vendas', ru: 'Продажи', it: 'Vendite'
  },
  'ACE Project': {
    en: 'Project Management', hi: 'परियोजना प्रबंधन', be: 'প্রকল্প পরিচালনা', fr: 'Gestion de projet', es: 'Gestión de proyectos',
    de: 'Projektmanagement', zh: '项目管理', ja: 'プロジェクト管理', kr: '프로젝트 관리', br: 'Gerenciamento de Projetos', ru: 'Управление проектами', it: 'Gestione progetti'
  },
  'ACE TMS': {
    en: 'Project Management', hi: 'परियोजना प्रबंधन', be: 'প্রকল্প পরিচালনা', fr: 'Gestion de projet', es: 'Gestión de proyectos',
    de: 'Projektmanagement', zh: '项目管理', ja: 'プロジェクト管理', kr: '프로젝트 관리', br: 'Gerenciamento de Projetos', ru: 'Управление проектами', it: 'Gestione progetti'
  },
  'ACE FAM': {
    en: 'Finance', hi: 'वित्त', be: 'অর্থ', fr: 'Finance', es: 'Finanzas',
    de: 'Finanzen', zh: '金融', ja: 'ファイナンス', kr: '재무', br: 'Finanças', ru: 'Финансы', it: 'Finanza'
  },
  'ACE Profit ERP': {
    en: 'ERP Solutions', hi: 'ईआरपी समाधान', be: 'ERP সমাধান', fr: 'Solutions ERP', es: 'Soluciones ERP',
    de: 'ERP-Lösungen', zh: 'ERP 解决方案', ja: 'ERPソリューション', kr: 'ERP 솔루션', br: 'Soluções ERP', ru: 'ERP-решения', it: 'Soluzioni ERP'
  },
  'ACE Profit HRMS': {
    en: 'Human Resource', hi: 'मानव संसाधन', be: 'মানব সম্পদ', fr: 'Ressources humaines', es: 'Recursos humanos',
    de: 'Personalwesen', zh: '人力资源', ja: '人事', kr: '인사', br: 'Recursos Humanos', ru: 'Кадры', it: 'Risorse umane'
  },
  'ACE Profit Payroll': {
    en: 'Human Resource', hi: 'मानव संसाधन', be: 'মানব সম্পদ', fr: 'Ressources humaines', es: 'Recursos humanos',
    de: 'Personalwesen', zh: '人力资源', ja: '人事', kr: '인사', br: 'Recursos Humanos', ru: 'Кадры', it: 'Risorse umane'
  }
};


const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function BlogEdit() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [activeLanguages, setActiveLanguages] = useState<string[]>(['en']);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>({
    metatitle: '',
    metadescription: '',
    title: { en: '' },
    author: '',
    description: { en: '' },
    products: '',
    category: { en: '' },
    content: { en: '' },
    blogimage: [],
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateFiles = (files: File[]): string | null => {
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return `File "${file.name}" is too large. Maximum size is 5MB.`;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return `File "${file.name}" is not a supported image type.`;
      }
    }
    return null;
  };

  const showMessage = useCallback((msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setMessage('');
    } else {
      setMessage(msg);
      setError('');
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessage('');
    setError('');
  }, []);

  const addLanguage = (langCode: string) => {
    if (!activeLanguages.includes(langCode)) {
      setActiveLanguages([...activeLanguages, langCode]);

      setFormData(prev => ({
        ...prev,
        title: { ...prev.title, [langCode]: '' },
        description: { ...prev.description, [langCode]: '' },
        category: { ...prev.category, [langCode]: '' },
        content: { ...prev.content, [langCode]: '' },
      }));
    }
    setShowLanguageDropdown(false);
  };

  const removeLanguage = (langCode: string) => {
    if (langCode === 'en') return;

    const newActiveLanguages = activeLanguages.filter(lang => lang !== langCode);
    setActiveLanguages(newActiveLanguages);

    setFormData(prev => {
      const removeFromObject = (obj: LocalizedString) => {
        const newObj = { ...obj };
        delete newObj[langCode];
        return newObj;
      };

      return {
        ...prev,
        title: removeFromObject(prev.title),
        description: removeFromObject(prev.description),
        category: removeFromObject(prev.category),
        content: removeFromObject(prev.content),
      };
    });
  };

  const filterLanguageKeys = (obj: Record<string, any>): Record<string, any> => {
  const validLangs = AVAILABLE_LANGUAGES.map(lang => lang.code);
  return Object.keys(obj)
    .filter(key => validLangs.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {} as Record<string, any>);
};


  const getLanguageName = (code: string) =>
    AVAILABLE_LANGUAGES.find(lang => lang.code === code)?.name || code.toUpperCase();

  const getAvailableLanguagesForDropdown = () =>
    AVAILABLE_LANGUAGES.filter(lang => !activeLanguages.includes(lang.code));

const normalizeLocalizedData = (data: LocalizedString | string | undefined): LocalizedString => {
  if (!data) return { en: '' };
  if (typeof data === 'string') return { en: data };
  return filterLanguageKeys(data);
};


const normalizeContentData = (data: LocalizedContent | object | string | undefined): LocalizedContent => {
  if (!data) return { en: '' };
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return filterLanguageKeys(parsed);
    } catch {
      return { en: data };
    }
  }
  return filterLanguageKeys(data as LocalizedContent);
};


  const parseContentIfString = (value: any) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (err) {
        console.warn('Invalid JSON content:', value);
        return {};
      }
    }
    return value;
  };

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        showMessage('Blog ID is required.', true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        clearMessages();

        const response = await axios.get<BlogData>(`${apiUrl}/api/blogs/${id}`);
        const blog = response.data;

        const normalizedTitle = normalizeLocalizedData(blog.title);
        const normalizedDescription = normalizeLocalizedData(blog.description);
        const normalizedCategory = normalizeLocalizedData(blog.category);
        const normalizedContent = normalizeContentData(blog.content);

        const allLanguages = new Set([
          ...Object.keys(normalizedTitle),
          ...Object.keys(normalizedDescription),
          ...Object.keys(normalizedCategory),
          ...Object.keys(normalizedContent),
          'en',
        ]);

        setActiveLanguages(Array.from(allLanguages));

        setFormData({
          metatitle: blog.metatitle || '',
          metadescription: blog.metadescription || '',
          title: normalizedTitle,
          author: blog.author || '',
          description: normalizedDescription,
          products: blog.products || '',
          category: normalizedCategory,
          content: normalizedContent,
          blogimage: [],
        });

        setExistingImages(blog.blogimage || []);
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const errorMessage =
          error.response?.data?.message || error.message || `Failed to load blog data.`;
        showMessage(errorMessage, true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, showMessage, clearMessages]);

  const handleLocalizedChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    lang: string,
    field: keyof Pick<BlogFormData, 'title' | 'description' | 'category'>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as LocalizedString),
        [lang]: e.target.value,
      },
    }));
    clearMessages();
  };

  const handleContentChange = (content: object | null, lang: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: content,
      },
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'products') {
      const autoCategory = productCategoryMap[value] || {};
      setFormData(prev => ({
        ...prev,
        [name]: value,
        category: {
          ...prev.category,
          ...activeLanguages.reduce((acc, lang) => {
            acc[lang] = autoCategory[lang] || '';
            return acc;
          }, {} as LocalizedString),
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    clearMessages();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    const validationError = validateFiles(fileArray);
    if (validationError) {
      showMessage(validationError, true);
      e.target.value = '';
      return;
    }

    setFormData(prev => ({ ...prev, blogimage: fileArray }));

    const urls = fileArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    clearMessages();
  };

  const removeNewImages = () => {
    setFormData(prev => ({ ...prev, blogimage: [] }));
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearMessages();

    const { metatitle, metadescription, title, author, description, products, category, content } = formData;

    if (!title.en?.trim() || !metatitle.trim() || !metadescription.trim() || !author.trim() || !description.en?.trim() || !products || !category.en?.trim()) {
      showMessage('All required fields must be filled.', true);
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('metatitle', metatitle.trim());
      data.append('metadescription', metadescription.trim());
      data.append('author', author.trim());
      data.append('products', products);
      data.append('title', JSON.stringify(title));
      data.append('description', JSON.stringify(description));
      data.append('category', JSON.stringify(category));
      data.append('content', JSON.stringify(content));
      formData.blogimage.forEach(file => data.append('blogimage', file));

      await axios.put(`${apiUrl}/api/blog/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showMessage('Blog updated successfully!');
      setTimeout(() => {
        router.push('/blog-admin');
      }, 1500);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const msg = error.response?.data?.message || 'Failed to update blog. Please try again.';
      showMessage(msg, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }

  return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded mt-10 mb-20">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Blog</h2>
      
      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">{message}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Languages</h3>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
              disabled={getAvailableLanguagesForDropdown().length === 0 || isSubmitting}
            >
              Add Language
            </button>
            {showLanguageDropdown && getAvailableLanguagesForDropdown().length > 0 && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[150px]">
                {getAvailableLanguagesForDropdown().map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => addLanguage(lang.code)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeLanguages.map(langCode => (
            <div key={langCode} className="flex items-center bg-white border border-gray-300 rounded px-3 py-1">
              <span className="text-sm mr-2">{getLanguageName(langCode)}</span>
              {langCode !== 'en' && (
                <button
                  type="button"
                  onClick={() => removeLanguage(langCode)}
                  className="text-red-500 hover:text-red-700 text-xs"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
 
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Banner Image
          </label>
          
          <div className="relative w-fit min-h-52 border-2 border-dashed rounded-lg border-gray-300 hover:border-gray-400 transition-colors">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-0">
              <Upload size={24} className="mb-2" />
              <p className="text-sm font-medium">Upload New Banner Image</p>
              
            </div>
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-max-xl h-full opacity-0 cursor-pointer z-50"
              disabled={isSubmitting}
            />
            
            <div className="relative z-10">
              {(previewUrls.length > 0 ? previewUrls : existingImages).map((src, index) => (
                <div key={index} className="relative">
                    <img
                    src={
                      src.startsWith('blob:')
                        ? src
                        : `${apiUrl}/uploads/${src}`
                    }
                    alt={`Preview ${index + 1}`}
                    className="h-72 w-max-xl object-cover rounded"
                  />
                  {previewUrls.length > 0 && (
                    <button
                      type="button"
                      onClick={removeNewImages}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove new images"
                      disabled={isSubmitting}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

         <div>
          <label htmlFor="metatitle" className="block text-sm font-medium text-gray-700">
            Meta Title *
          </label>
          <input
            id="metatitle"
            type="text"
            name="metatitle"
            value={formData.metatitle}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
            placeholder="Enter Meta title"
          />
        </div>

         <div>
          <label htmlFor="metadescription" className="block text-sm font-medium text-gray-700">
            Meta Description *
          </label>
          <input
            id="metadescription"
            type="text"
            name="metadescription"
            value={formData.metadescription}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
            placeholder="Enter Meta description"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Blog Title</label>
          {activeLanguages.map(lang => (
            <input
              key={lang + "title"}
              type="text"
              placeholder={`Blog Title (${getLanguageName(lang)})`}
              value={formData.title[lang] || ''}
              onChange={e => handleLocalizedChange(e, lang, "title")}
              className="w-full p-2 border border-gray-300 rounded"
              required={lang === 'en'}
              disabled={isSubmitting}
            />
          ))}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Author *
          </label>
          <input
            id="author"
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
            placeholder="Enter author name"
          />
        </div>

        <div>
          <label htmlFor="products" className="block text-sm font-medium text-gray-700">
            Product *
          </label>
          <select
            id="products"
            name="products"
            value={formData.products}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50"
          >
            <option value="">-- Select Product --</option>
            {Object.keys(productCategoryMap).map((product) => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          {activeLanguages.map(lang => (
            <input
              key={lang + "category"}
              type="text"
              placeholder={`Category (${getLanguageName(lang)})`}
              value={formData.category[lang] || ''}
              onChange={e => handleLocalizedChange(e, lang, "category")}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={isSubmitting}
            />
          ))}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Short Description</label>
          {activeLanguages.map(lang => (
            <textarea
              key={lang + "desc"}
              placeholder={`Short Description (${getLanguageName(lang)})`}
              value={formData.description[lang] || ''}
              onChange={e => handleLocalizedChange(e, lang, "description")}
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
              required={lang === 'en'}
              disabled={isSubmitting}
            />
          ))}
        </div>

     
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Blog Content</label>
          {activeLanguages.map(lang => (
            <div key={lang + "content"} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Content ({getLanguageName(lang)})</h4>
              <div className="h-auto min-h-96 border border-gray-200 rounded">
               <SimpleEditor
              content={parseContentIfString(formData.content[lang])}
              onContentChange={(content) => handleContentChange(content, lang)}
            />

              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => router.push('/blog-admin')}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  )}
