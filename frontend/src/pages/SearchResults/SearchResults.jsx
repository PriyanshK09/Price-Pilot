import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, ChevronDown, ChevronRight, ArrowUpDown, 
  Tag, Percent, Star, Filter,
  LayoutGrid, LayoutList, X
} from 'lucide-react';
import Breadcrumb from '../../components/UI/Breadcrumb/Breadcrumb';
import ProductCard from '../../components/Product/ProductCard/ProductCard';
import Pagination from '../../components/UI/Pagination/Pagination';
import Loader from '../../components/UI/Loader/Loader';
import './SearchResults.css';
import { apiFetch } from '../../utils/apiFetch';
import { addRecentSearch } from '../../utils/searchHistoryService';

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
  const [allProducts, setAllProducts] = useState([]);  // Cache for all products
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');
  const [filtersOpen, setFiltersOpen] = useState(window.innerWidth > 992);
  const [viewMode, setViewMode] = useState('grid');
  const filterRef = useRef(null);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [availableBrands, setAvailableBrands] = useState(sampleBrands);
  
  // New state to track if initial data is loaded
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  
  const fetchInitialResults = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const initialFilterState = {
        page: currentPage,
        sort: sortBy,
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        brands: selectedBrands,
        discounted: onlyDiscounted
      };

      const params = new URLSearchParams({
        q: query,
        page: 1,
        sort: 'relevance',
        filterOnServer: '0'
      });
      
      const endpoint = `/products/search?${params.toString()}`;
      console.log(`Fetching initial results from endpoint: ${endpoint}`);
      
      const data = await apiFetch(endpoint);
      
      if (data.products && Array.isArray(data.products)) {
        setAllProducts(data.products);
        applyFilters(data.products, initialFilterState);
        
        if (data.filters?.brands) {
          setAvailableBrands(data.filters.brands);
        }
        
        setInitialDataLoaded(true);
      } else {
        throw new Error('Received invalid data format from server');
      }
    } catch (error) {
      console.error('Error fetching initial search results:', error);
      const mockResults = generateMockProducts(query, 24);
      setAllProducts(mockResults);
      applyFilters(mockResults, {
        page: currentPage,
        sort: sortBy,
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        brands: selectedBrands,
        discounted: onlyDiscounted
      });
    } finally {
      setIsLoading(false);
    }
  }, [query, currentPage, sortBy, priceRange, selectedBrands, onlyDiscounted]);

  // Fetch initial search results
  useEffect(() => {
    fetchInitialResults();
    
    // Save search query to recent searches
    if (query && query.trim().length > 1) {
      addRecentSearch(query);
    }
  }, [fetchInitialResults, query]); // Added query as a dependency
  
  // Apply filtering and sorting when filter parameters change
  useEffect(() => {
    const shouldApplyFilters = initialDataLoaded && allProducts.length > 0;
    
    if (shouldApplyFilters) {
      setIsFilterLoading(true);
      
      const filterOptions = {
        page: currentPage,
        sort: sortBy,
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        brands: selectedBrands,
        discounted: onlyDiscounted
      };
      
      // Use setTimeout to prevent UI freezing on large datasets
      const timeoutId = setTimeout(() => {
        applyFilters(allProducts, filterOptions);
        setIsFilterLoading(false);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [
    initialDataLoaded, 
    allProducts,
    currentPage, 
    sortBy, 
    priceRange,
    selectedBrands, 
    onlyDiscounted
  ]);
  
  // Function to apply filters and sorting client-side
  const applyFilters = (sourceProducts, options) => {
    let filteredProducts = [...sourceProducts];
    
    // Define featured stores
    const featuredStores = [
      'Amazon',
      'Flipkart',
      'Apple',
      'Myntra',
      'Samsung',
      'Xiaomi'
    ];
    
    // Apply price range filter
    if (options.priceMin > 0) {
      filteredProducts = filteredProducts.filter(p => p.currentPrice >= options.priceMin);
    }
    
    if (options.priceMax < 200000) {
      filteredProducts = filteredProducts.filter(p => p.currentPrice <= options.priceMax);
    }
    
    // Apply discount filter
    if (options.discounted) {
      filteredProducts = filteredProducts.filter(p => p.discountPercent > 0);
    }
    
    // Apply brand filter
    if (options.brands && options.brands.length > 0) {
      filteredProducts = filteredProducts.filter(p => {
        // Use store as brand if no brand field exists
        const brand = p.brand || p.store;
        if (!brand) return false;
        return options.brands.includes(brand.toLowerCase().replace(/\s+/g, '-'));
      });
    }
    
    // Apply sorting
    if (options.sort === 'price_low') {
      filteredProducts.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (options.sort === 'price_high') {
      filteredProducts.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (options.sort === 'discount') {
      filteredProducts.sort((a, b) => b.discountPercent - a.discountPercent);
    } else if (options.sort === 'rating') {
      filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    // For 'relevance' and 'newest', keep the original order
    
    // Group products by featured and non-featured stores
    const featuredProducts = filteredProducts.filter(p => 
      featuredStores.includes(p.store)
    );
    const otherProducts = filteredProducts.filter(p => 
      !featuredStores.includes(p.store)
    );
    
    // Add featured tag to products from featured stores
    featuredProducts.forEach(p => p.featured = true);
    
    // Sort featured products to maintain specific store order
    featuredProducts.sort((a, b) => {
      const aIndex = featuredStores.indexOf(a.store);
      const bIndex = featuredStores.indexOf(b.store);
      return aIndex - bIndex;
    });
    
    // Combine the arrays with featured products first
    filteredProducts = [...featuredProducts, ...otherProducts];

    // Calculate pagination
    const totalFilteredResults = filteredProducts.length;
    const totalFilteredPages = Math.max(1, Math.ceil(totalFilteredResults / 12));
    
    // Make sure current page is valid
    const validPage = Math.min(options.page, totalFilteredPages);
    
    // Get paginated products
    const startIndex = (validPage - 1) * 12;
    const endIndex = startIndex + 12;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Update state
    setProducts(paginatedProducts);
    setTotalResults(totalFilteredResults);
    setTotalPages(totalFilteredPages);
    
    if (validPage !== options.page) {
      setCurrentPage(validPage);
    }
    
    // Scroll to top after filtering
    window.scrollTo(0, 0);
  };
  
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
  
  // Handle filter toggling for all devices
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
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
  
  // Check if any filters are applied
  const hasActiveFilters = () => {
    return (
      priceRange[0] > 0 || 
      priceRange[1] < 200000 || 
      selectedBrands.length > 0 ||
      onlyDiscounted
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 200000]);
    setSelectedBrands([]);
    setOnlyDiscounted(false);
    // Immediate reset visuals for better UX
    setIsFilterLoading(true);
    setTimeout(() => setIsFilterLoading(false), 300);
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
    const handleClickOutside = (event) => {
      const isMobile = window.innerWidth <= 992;
      const isOutsideFilter = filterRef.current && !filterRef.current.contains(event.target);
      const isNotToggleButton = !event.target.closest('.search-results-filter-toggle');
      
      if (isMobile && isOutsideFilter && isNotToggleButton) {
        setFiltersOpen(false);
      }
    };

    const handleEscKey = (event) => {
      const shouldCloseOnEsc = event.key === 'Escape' && window.innerWidth <= 992;
      if (shouldCloseOnEsc) {
        setFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
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
              {hasActiveFilters() && (
                <button 
                  className="search-results-filters-reset" 
                  onClick={resetFilters}
                >
                  Reset All
                </button>
              )}
              
              {/* Mobile close button in header */}
              <button 
                className="filters-close-mobile" 
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Brands Filter - Renamed to Selling Partners and moved up */}
            <div className="search-results-filter-group">
              <div className="filter-group-header">
                <h3>
                  <Star size={16} />
                  Selling Partners
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
            
            {/* Price Range Filter - Moved to bottom */}
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

            {/* Discount Filter - Moved below Selling Partners */}
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
            ) : isFilterLoading ? (
              <div className="search-results-loading filter-loading">
                <Loader size="small" />
                <p>Filtering products...</p>
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
                  We couldn't find any products matching your filters. 
                  Please try with different filter options or <button onClick={resetFilters} className="text-button">reset all filters</button>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;