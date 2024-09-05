console.log('電子檔商店前端腳本已加載');

// 從服務器獲取商品數據
async function fetchProducts() {
    const response = await fetch('/api/products');
    return await response.json();
}

// 渲染商品卡片
function renderProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='/placeholder.jpg'">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">NT$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">加入購物車</button>
            </div>
        </div>
    `;
}

// 渲染所有商品
async function renderAllProducts() {
    const products = await fetchProducts();
    const productContainer = document.getElementById('all-products');
    productContainer.innerHTML = products.map(renderProductCard).join('');
}

// 渲染熱門商品（這裡我們只顯示前兩個商品作為示例）
async function renderFeaturedProducts() {
    const products = await fetchProducts();
    const featuredContainer = document.getElementById('featured-products');
    featuredContainer.innerHTML = products.slice(0, 2).map(renderProductCard).join('');
}

// 初始化頁面
async function initializePage() {
    await renderAllProducts();
    await renderFeaturedProducts();
}

// 當頁面加載完成時初始化
window.addEventListener('load', initializePage);

// 模擬添加到購物車的功能
function addToCart(productId) {
    console.log(`商品 ${productId} 已添加到購物車`);
    // 這裡可以添加實際的購物車邏輯
}