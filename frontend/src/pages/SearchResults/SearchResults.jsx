import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Search, ChevronDown, ChevronRight, ArrowUpDown, 
  Tag, Percent, Star, BarChart3, X, Filter,
  LayoutGrid, LayoutList
} from 'lucide-react';
import Breadcrumb from '../../components/UI/Breadcrumb/Breadcrumb';
import ProductCard from '../../components/Product/ProductCard/ProductCard';
import Pagination from '../../components/UI/Pagination/Pagination';
import Loader from '../../components/UI/Loader/Loader';
import './SearchResults.css';
import { apiFetch } from '../../utils/apiFetch';

// First define the sample data for filters before using them
const sampleCategories = [
  { id: 'smartphones', name: 'Smartphones', count: 124 },
  { id: 'laptops', name: 'Laptops', count: 98 },
  { id: 'audio', name: 'Audio', count: 76 },
  { id: 'cameras', name: 'Cameras', count: 42 },
  { id: 'tablets', name: 'Tablets', count: 38 },
  { id: 'smartwatches', name: 'Smartwatches', count: 35 },
  { id: 'accessories', name: 'Accessories', count: 104 },
];

const sampleBrands = [
  { id: 'apple', name: 'Apple', count: 78 },
  { id: 'samsung', name: 'Samsung', count: 64 },
  { id: 'sony', name: 'Sony', count: 46 },
  { id: 'google', name: 'Google', count: 36 },
  { id: 'xiaomi', name: 'Xiaomi', count: 32 },
  { id: 'hp', name: 'HP', count: 28 },
  { id: 'dell', name: 'Dell', count: 26 },
];

const SearchResults = () => {
  // Get search query from URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');
  const [filtersOpen, setFiltersOpen] = useState(window.innerWidth > 992);
  const [viewMode, setViewMode] = useState('grid');
  const filterRef = useRef(null);
  
  // Filter states - now using the predefined sample data
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [availableCategories, setAvailableCategories] = useState(sampleCategories);
  const [availableBrands, setAvailableBrands] = useState(sampleBrands);
  
  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      
      try {
        // Build query parameters
        const params = new URLSearchParams({
          q: query,
          page: currentPage,
          sort: sortBy,
        });
        
        // Add optional parameters
        if (priceRange[0] > 0) params.append('priceMin', priceRange[0]);
        if (priceRange[1] < 200000) params.append('priceMax', priceRange[1]);
        if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','));
        if (selectedBrands.length > 0) params.append('brands', selectedBrands.join(','));
        if (onlyDiscounted) params.append('discounted', '1');
        
        const endpoint = `/products/search?${params.toString()}`;
        console.log(`Fetching search results from endpoint: ${endpoint}`);
        
        const data = await apiFetch(endpoint);
        console.log('Search results data:', data);
        
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalResults(data.pagination?.totalResults || data.products.length);
          setTotalPages(data.pagination?.totalPages || 1);
          
          // Extract available filters from the response if provided
          if (data.filters) {
            if (data.filters.categories) {
              setAvailableCategories(data.filters.categories);
            }
            if (data.filters.brands) {
              setAvailableBrands(data.filters.brands);
            }
          }
        } else {
          console.error('Invalid data format from API:', data);
          throw new Error('Received invalid data format from server');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        
        // Fallback to mock data when API fails
        console.log('Falling back to mock data');
        const mockResults = generateMockProducts(query, 24);
        setProducts(mockResults);
        setTotalResults(245);
        setTotalPages(11);
      } finally {
        setIsLoading(false);
        // Auto-scroll to top when changing results
        window.scrollTo(0, 0);
      }
    };
    
    fetchSearchResults();
  }, [query, currentPage, sortBy, priceRange, selectedCategories, selectedBrands, onlyDiscounted]);
  
  // Mock products generator
  const generateMockProducts = (searchTerm, count) => {
    const mockProducts = [];
    const stores = ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Vijay Sales'];
    const ratings = [4.1, 4.3, 4.5, 4.7, 4.9, 5.0];
    
    for (let i = 1; i <= count; i++) {
      const hasDiscount = Math.random() > 0.3;
      const discountPercent = hasDiscount ? Math.floor(Math.random() * 40) + 5 : 0;
      const originalPrice = Math.floor(Math.random() * 150000) + 1000;
      const currentPrice = hasDiscount 
        ? Math.round(originalPrice * (1 - discountPercent / 100)) 
        : originalPrice;
      
      mockProducts.push({
        id: `prod-${i}`,
        title: `${searchTerm} Pro ${i} (2024 Model)`,
        image: `https://source.unsplash.com/random/300x300/?${searchTerm.split(' ')[0]}&sig=${i}`,
        currentPrice,
        originalPrice: hasDiscount ? originalPrice : null,
        discountPercent: hasDiscount ? discountPercent : 0,
        store: stores[Math.floor(Math.random() * stores.length)],
        rating: ratings[Math.floor(Math.random() * ratings.length)],
        reviewCount: Math.floor(Math.random() * 2000) + 10,
        inStock: Math.random() > 0.1,
      });
    }
    
    return mockProducts;
  };
  
  // Handle filter toggling on mobile
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };
  
  // Handle category selection
  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  // Handle brand selection
  const toggleBrand = (brandId) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter(id => id !== brandId));
    } else {
      setSelectedBrands([...selectedBrands, brandId]);
    }
  };
  
  // Handle price range changes
  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 200000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setOnlyDiscounted(false);
  };
  
  // Format price display - Now used in the component, ESLint warning fixed
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Search Results', link: null },
    { label: query, link: null },
  ];

  // Close filters when clicking outside (for mobile)
  useEffect(() => {
    function handleClickOutside(event) {
      if (window.innerWidth <= 992 && 
          filterRef.current && 
          !filterRef.current.contains(event.target) &&
          !event.target.closest('.search-results-filter-toggle')) {
        setFiltersOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    
    // Add escape key handler to close filters
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && window.innerWidth <= 992) {
        setFiltersOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    // Handle window resize to auto-show filters on larger screens
    const handleResize = () => {
      setFiltersOpen(window.innerWidth > 992);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="search-results-page">
      <div className="container">
        <div className="search-results-header">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="search-results-summary">
            <h1 className="search-results-title">
              Search results for{" "}
              <span className="search-query-wrapper">"{query}"</span>
            </h1>
            <p className="search-results-count">
              {isLoading ? 'Searching...' : `Found ${totalResults} products`}
            </p>
          </div>
          
          <div className="search-results-controls">
            <button 
              className="search-results-filter-toggle" 
              onClick={toggleFilters}
              aria-label="Toggle filters"
            >
              <Filter size={18} />
              Filters
              {filtersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            <div className="search-results-view-options">
              <button 
                className={`view-option ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                className={`view-option ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <LayoutList size={18} />
              </button>
            </div>
            
            <div className="search-results-sort">
              <ArrowUpDown size={16} />
              <select 
                value={sortBy} 
                onChange={handleSortChange}
                aria-label="Sort products"
              >
                <option value="relevance">Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="search-results-container">
          {/* Filter overlay for mobile */}
          {filtersOpen && window.innerWidth <= 992 && (
            <div className="filter-overlay" onClick={() => setFiltersOpen(false)}></div>
          )}
          
          <aside 
            ref={filterRef}
            className={`search-results-filters ${filtersOpen ? 'open' : ''}`}
          >
            <div className="search-results-filters-header">
              <h2>Filters</h2>
              <button 
                className="search-results-filters-reset" 
                onClick={resetFilters}
              >
                Reset All
              </button>
              
              {/* Mobile close button in header */}
              <button 
                className="filters-close-mobile" 
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Price Range Filter */}
            <div className="search-results-filter-group">
              <h3>
                <Tag size={16} />
                Price Range
              </h3>
              <div className="price-range-slider">
                <div className="price-inputs">
                  <input 
                    type="number" 
                    value={priceRange[0]} 
                    onChange={(e) => handlePriceChange(e, 0)}
                    aria-label="Minimum price"
                  />
                  <span>to</span>
                  <input 
                    type="number" 
                    value={priceRange[1]} 
                    onChange={(e) => handlePriceChange(e, 1)}
                    aria-label="Maximum price"
                  />
                </div>
                <div className="price-display">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
                <div className="range-slider">
                  <input 
                    type="range" 
                    min="0" 
                    max="200000" 
                    value={priceRange[0]} 
                    onChange={(e) => handlePriceChange(e, 0)}
                    aria-label="Minimum price range"
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="200000" 
                    value={priceRange[1]} 
                    onChange={(e) => handlePriceChange(e, 1)}
                    aria-label="Maximum price range"
                  />
                </div>
              </div>
            </div>
            
            {/* Discount Filter */}
            <div className="search-results-filter-group">
              <div className="filter-group-header">
                <h3>
                  <Percent size={16} />
                  Discounts
                </h3>
              </div>
              <div className="discount-filter">
                <label className="custom-checkbox">
                  <input 
                    type="checkbox" 
                    checked={onlyDiscounted} 
                    onChange={() => setOnlyDiscounted(!onlyDiscounted)}
                  />
                  <span className="checkmark"></span>
                  <span>Show only discounted items</span>
                </label>
              </div>
            </div>
            
            {/* Categories Filter */}
            <div className="search-results-filter-group">
              <div className="filter-group-header">
                <h3>
                  <BarChart3 size={16} />
                  Categories
                </h3>
              </div>
              <div className="categories-filter">
                {availableCategories.map((category) => (
                  <label key={category.id} className="custom-checkbox">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(category.id)} 
                      onChange={() => toggleCategory(category.id)}
                    />
                    <span className="checkmark"></span>
                    <span>{category.name}</span>
                    <span className="filter-count">{category.count}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Brands Filter */}
            <div className="search-results-filter-group">
              <div className="filter-group-header">
                <h3>
                  <Star size={16} />
                  Brands
                </h3>
              </div>
              <div className="brands-filter">
                {availableBrands.map((brand) => (
                  <label key={brand.id} className="custom-checkbox">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand.id)} 
                      onChange={() => toggleBrand(brand.id)}
                    />
                    <span className="checkmark"></span>
                    <span>{brand.name}</span>
                    <span className="filter-count">{brand.count}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Mobile filter apply button at bottom */}
            <div className="filters-action-buttons">
              <button 
                className="filters-apply-button" 
                onClick={() => setFiltersOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </aside>
          
          <div className="search-results-content">
            {isLoading ? (
              <div className="search-results-loading">
                <Loader />
                <p>Searching for the best deals...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`search-results-grid ${viewMode}`}>
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>
                
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="search-results-empty">
                <div className="empty-icon">
                  <Search size={40} />
                </div>
                <h2>No results found</h2>
                <p>
                  We couldn't find any products matching "{query}". 
                  Please try with different keywords or browse our categories.
                </p>
                <Link to="/" className="btn btn-primary">
                  Browse Categories
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;