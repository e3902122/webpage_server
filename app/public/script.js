document.addEventListener('DOMContentLoaded', function() {
    // 处理联系表单提交
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('感谢您的留言！我们会尽快回复。');
            this.reset();
        });
    }

    // 从服务器获取商品数据
    async function fetchProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    // 渲染商品
    async function renderProducts() {
        const products = await fetchProducts();
        const productGrids = document.querySelectorAll('.product-grid');
        productGrids.forEach(grid => {
            grid.innerHTML = ''; // 清空现有内容
            products.forEach(product => {
                const productCard = createProductCard(product);
                grid.appendChild(productCard);
            });
        });
    }

    // 创建商品卡片
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card glass';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>价格: $${parseFloat(product.price).toFixed(2)}</p>
            <button class="add-to-cart">加入购物车</button>
        `;
        card.querySelector('.add-to-cart').addEventListener('click', () => {
            alert(`${product.name} 已添加到购物车！`);
        });
        return card;
    }

    // 渲染商品
    renderProducts();
});

// 管理员功能 - 仅在控制台可用
async function adminLogin(password) {
    if (password === 'admin123') { // 请更改为更安全的密码
        console.log('管理员登录成功');
        await showAdminPanel();
    } else {
        console.log('管理员登录失败');
    }
}

async function showAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.innerHTML = `
        <h2>管理员面板</h2>
        <form id="add-product-form">
            <input type="text" id="product-name" placeholder="商品名称" required>
            <input type="number" id="product-price" placeholder="商品价格" required>
            <input type="url" id="product-image" placeholder="商品图片URL" required>
            <button type="submit">添加商品</button>
        </form>
    `;
    document.body.appendChild(adminPanel);

    const addProductForm = document.getElementById('add-product-form');
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const image = document.getElementById('product-image').value;

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, price, image }),
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            alert('商品添加成功！');
            addProductForm.reset();
            renderProducts(); // 重新渲染商品列表
        } catch (error) {
            console.error('Error adding product:', error);
            alert('添加商品失败，请重试。');
        }
    });
}