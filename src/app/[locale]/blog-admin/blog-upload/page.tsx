'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
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



interface BlogData {
  title: LocalizedString;
  author: string;
  description: LocalizedString;
  products: string;
  category: LocalizedString;
  content: LocalizedContent;
  blogimage: File[];
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



const BlogUpload: React.FC = () => {
  const router = useRouter();
  const [activeLanguages, setActiveLanguages] = useState<string[]>(['en']);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const [blogData, setBlogData] = useState<BlogData>({
    title: { en: '' },
    author: '',
    description: { en: '' },
    products: '',
    category: { en: '' },
    content: { en: '' },
    blogimage: [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const addLanguage = (langCode: string) => {
    if (!activeLanguages.includes(langCode)) {
      setActiveLanguages([...activeLanguages, langCode]);

      setBlogData(prev => ({
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

    setBlogData(prev => {
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

  const getLanguageName = (code: string) => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === code)?.name || code.toUpperCase();
  };

  const getAvailableLanguagesForDropdown = () => {
    return AVAILABLE_LANGUAGES.filter(lang => !activeLanguages.includes(lang.code));
  };

  const handleLocalizedChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    lang: string,
    field: keyof Pick<BlogData, 'title' | 'description' | 'category'>
  ) => {
    setBlogData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as LocalizedString),
        [lang]: e.target.value,
      },
    }));
  };

  const handleContentChange = (content: object | null, lang: string) => {
    setBlogData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: JSON.stringify(content),
      },
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'products') {
      const autoCategory = productCategoryMap[value] || {};
      setBlogData(prev => ({
        ...prev,
        [name]: value,
        category: {
          ...prev.category,
          ...activeLanguages.reduce((acc, lang) => {
               acc[lang] = autoCategory[lang] || '';
            return acc;
          }, {} as LocalizedString)
        }
      }));
    } else {
      setBlogData({ ...blogData, [name]: value });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map(file => URL.createObjectURL(file));
    
    setImageFiles(files);
    setPreviewImages(previews);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData();
    
    imageFiles.forEach(file => formData.append("blogimage", file));
    
    formData.append('author', blogData.author);
    formData.append('products', blogData.products);
    
    formData.append('title', JSON.stringify(blogData.title));
    formData.append('description', JSON.stringify(blogData.description));
    formData.append('category', JSON.stringify(blogData.category));
    formData.append('content', JSON.stringify(blogData.content));

    try {
      await axios.post(`${apiUrl}/api/blog`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage('Blog uploaded successfully!');
      router.push('/blog-admin');
    } catch (error) {
      console.error(error);
      setMessage('Error uploading blog. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (message) {
      alert(message);
    }
  }, [message]);

  return (
    <div className="max-w-4xl mx-auto p-6 border border-gray-200 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Upload Blog</h2>

      {/* Language Management Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Languages</h3>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
              disabled={getAvailableLanguagesForDropdown().length === 0}
            >
              Add Language
            </button>
            {showLanguageDropdown && getAvailableLanguagesForDropdown().length > 0 && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-[150px]">
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
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

             <div className=' relative w-full min-h-52 border-2 border-dashed rounded-lg border-gray-400 cursor-pointer mb-5'>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <Upload size={24} className="mb-2" />
              <p className="text-sm font-medium z-10">Upload Banner Image</p>
            </div>
            <input
                id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />    
             {previewImages.map((img, index) => (
              <img key={index} src={img} className="w-full h-72 rounded object-cover z-50" alt={`Preview ${index}`} />
            ))}   
          </div>
        
        {/* Blog Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Blog Title</label>
          {activeLanguages.map(lang => (
            <input
              key={lang + "title"}
              type="text"
              placeholder={`Blog Title (${getLanguageName(lang)})`}
              value={blogData.title[lang] || ''}
              onChange={e => handleLocalizedChange(e, lang, "title")}
              className="w-full p-2 border border-gray-300 rounded"
              required={lang === 'en'}
            />
          ))}
        </div>

        {/* Author */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            name="author"
            type="text"
            placeholder="Author Name"
            value={blogData.author}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Products */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Products</label>
          <select
            name="products"
            value={blogData.products}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded bg-white"
            required
          >
            <option value="">-- Select Product --</option>
            {Object.keys(productCategoryMap).map((product) => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
        </div>

        {/* Category (Auto-populated) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          {activeLanguages.map(lang => (
            <input
              key={lang + "category"}
              type="text"
              placeholder={`Category (${getLanguageName(lang)})`}
              value={blogData.category[lang] || ''}
              onChange={e => handleLocalizedChange(e, lang, "category")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Short Description</label>
          {activeLanguages.map(lang => (
            <textarea
              key={lang + "desc"}
              placeholder={`Short Description (${getLanguageName(lang)})`}
              value={blogData.description[lang] || ''}
              onChange={e => handleLocalizedChange(e, lang, "description")}
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
              required={lang === 'en'}
            />
          ))}
        </div>

        {/* Blog Content Editor */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Blog Content</label>
          {activeLanguages.map(lang => (
            <div key={lang + "content"} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Content ({getLanguageName(lang)})</h4>
              <div className="h-auto min-h-96 border border-gray-200 rounded">
                <SimpleEditor 
                  key={lang + "editor"} 
                  onContentChange={(content) => handleContentChange(content, lang)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-between space-x-4 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-1/2 bg-black text-white px-4 py-2 rounded hover:bg-green-600 text-[14px] disabled:opacity-50"
          >
            {isSubmitting ? 'Uploading...' : 'Upload Blog'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/blog-admin')}
            className="w-1/2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-red-600 text-[14px]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogUpload;