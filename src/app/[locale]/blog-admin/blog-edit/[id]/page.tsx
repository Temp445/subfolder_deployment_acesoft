'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Upload, X, AlertCircle } from 'lucide-react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface BlogFormData {
  title: string;
  author: string;
  description: string;
  products: string;
  category: string;
  blogimage: File[];
}

interface BlogData {
  id: string;
  title: string;
  author: string;
  description: string;
  products: string;
  category: string;
  blogimage?: string[];
  content?: object;
}

interface ApiError {
  message: string;
  status?: number;
}


 const productCategoryMap: Record<string, string> = {
  'ACE CMS': 'Engineering',
  'ACE PMS': 'Engineering',
  'ACE Profit PPAP': 'Engineering',
  'PPAP Manager': 'Engineering',
  'ACE CRM': 'Sales',
  'ACE Project': 'Project Management',
  'ACE TMS': 'Project Management',
  'ACE FAM': 'Finance',
  'ACE Profit ERP': 'ERP Solutions',
  'ACE Profit HRMS': 'Human Resource',
  'ACE Profit Payroll': 'Human Resource',
  'Engineering Balloon Annotator': 'Engineering',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function BlogEdit() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    author: '',
    description: '',
    products: '',
    category: '',
    blogimage: [],
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [blogContent, setBlogContent] = useState<object | undefined>(undefined);


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
        
        const response = await axios.put<BlogData>(`${apiUrl}/api/blog/${id}`);
        const blog = response.data;
        
        setFormData({
          title: blog.title || '',
          author: blog.author || '',
          description: blog.description || '',
          products: blog.products || '',
          category: blog.category || productCategoryMap[blog.products] || '',
          blogimage: [],
        });
        
        setExistingImages(blog.blogimage || []);
        setBlogContent(blog.content || {});
        
      } catch (err) {

        const error = err as AxiosError<ApiError>;
        const errorMessage = error.response?.data?.message || 'Failed to load blog data.';
        showMessage(errorMessage, true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, showMessage, clearMessages]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
        setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'products' && productCategoryMap[value]
        ? { category: productCategoryMap[value] }
        : {}),
    }));
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

  const handleContentChange = useCallback((content: object) => {
    setBlogContent(content);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearMessages();

    const { title, author, description, products, category } = formData;

    if (!title.trim() || !author.trim() || !description.trim() || !products || !category) {
      showMessage('All required fields must be filled.', true);
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', title.trim());
      data.append('author', author.trim());
      data.append('description', description.trim());
      data.append('products', products);
      data.append('category', category);
      
     formData.blogimage.forEach((file) => data.append('blogimage', file));
      
     if (blogContent) data.append('content', JSON.stringify(blogContent));

     await axios.put(`${apiUrl}/api/blog/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
   
      showMessage('Blog updated successfully!');
      
      setTimeout(() => {
        router.push('/blog-admin');
      }, 1500);
      
    } catch (err) {
      
      const error = err as AxiosError<ApiError>;
      
      const msg =
        error.response?.data?.message || 'Failed to update blog. Please try again.';
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
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded mt-10">
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

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Banner Image
          </label>
          
          <div className="relative w-full min-h-52 border-2 border-dashed rounded-lg border-gray-300 hover:border-gray-400 transition-colors">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-0">
              <Upload size={24} className="mb-2" />
              <p className="text-sm font-medium">Upload New Banner Image</p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WebP or GIF (max. 5MB)
              </p>
            </div>
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
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
                    className="h-72 w-full object-cover rounded"
                  />
                  {previewUrls.length > 0 && (
                    <button
                      type="button"
                      onClick={removeNewImages}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove new images"
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
            placeholder="Enter blog title"
          />
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Short Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
            placeholder="Enter a brief description of the blog"
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


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Content
          </label>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <SimpleEditor
              content={blogContent}
              onContentChange={handleContentChange}
            />
          </div>
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
  );
}