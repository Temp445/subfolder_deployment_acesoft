  'use client';

  import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
  import axios from 'axios';
  import { Upload } from 'lucide-react';
  import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
  import { useRouter } from 'next/navigation';


  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  interface BlogFormData {
    title: string;
    author: string;
    description: string;
    products: string;
    category: string;
    blogimage: File[];
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

  export default function BlogForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<BlogFormData>({
      title: '',
      author: '',
      description: '',
      products: '',
      category: '',
      blogimage: [],
    });

   
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [blogContent, setBlogContent] = useState<object | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      let updatedCategory = formData.category;
    if (name === 'products' && productCategoryMap[value]) {
      updatedCategory = productCategoryMap[value];
    }
      setFormData((prev) => ({
        ...prev,
        [name]: value,
         category: name === 'products' ? updatedCategory : prev.category,
      }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const fileArray = Array.from(files);
        setFormData((prev) => ({
          ...prev,
          blogimage: fileArray,
        }));

        const urls = fileArray.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
      }
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setMessage('');

      const data = new FormData();
      data.append('title', formData.title);
      data.append('author', formData.author);
      data.append('description', formData.description);
      data.append('products', formData.products);
      data.append('category', formData.category);
      formData.blogimage.forEach((file) => data.append('blogimage', file));
      if (blogContent) {
    data.append("content", JSON.stringify(blogContent))
  }


      try {
        await axios.post(`${apiUrl}/api/blog`, data);
        setMessage('Blog created successfully!');
        setFormData({
          title: '',
          author: '',
          description: '',
          category: '',
          products: '',
          blogimage: [],
        });
        setPreviewUrls([]);
          setBlogContent(null);
       router.push('/blog-admin');
      } catch (error) {
        console.error(error);
        setMessage('Something went wrong.');
      } finally {
        setIsSubmitting(false);
      }
    };
    useEffect(() => {
      if (message) {
        window.alert(message);
      }
    }, [message]);

    return (
      <div className="max-w-7xl mx-auto p-6 bg-white  shadow rounded mt-10">
        <h2 className="text-2xl font-semibold mb-4">Create Blog </h2>

        {isSubmitting && <p className="mb-4 text-sm text-blue-500">Submitting...</p>}

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <div className=' relative w-full min-h-52 border-2 border-dashed rounded-lg border-gray-400 cursor-pointer mb-5'>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <Upload size={24} className="mb-2" />
              <p className="text-sm font-medium">Upload Banner Image</p>
            </div>
            <input
                id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
      {previewUrls.length > 0 && (
            <div className="grid grid-cols-1 gap-4 z-50">
              {previewUrls.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                  className="h-72 w-full object-cover rounded z-50"
                />
              ))}
            </div>
          )}
          
          </div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Short Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
              rows={4}
            />
          </div>
            <div>
            <label className="block font-medium">Products</label>
            <select
              name="products"
              value={formData.products}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded bg-white"
            >
              <option value="">-- Select Product --</option>
              {Object.keys(productCategoryMap).map((product) => (
            <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>

  <div className='h-auto min-h-screen border border-gray-200 rounded'>
    <SimpleEditor onContentChange={setBlogContent} />
  </div>
    
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Uploading...' : 'Upload Blog'}
          </button>
        </form>
      </div>
    );
  }
